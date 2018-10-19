<template>
    <div style="width: 100%; height: 100%">
        <v-container grid-list-md text-xs-center>
            <v-layout row wrap>
                <v-flex xs4>
                    <p style="color: crimson" id="angle"> Azimuthal Angle = {{hAngle}}</p>
                    <p style="color: green" id="vangle"> Polar Angle = {{vAngle}}</p>
                    <p>{{selected.scene}}</p>
                    <p>{{selected.hsList}}</p>
                    <p>{{selected.hsIndex}}</p>
                    <p>{{selected.hsLinkedScene}}</p>
                    <div v-for="hs in selected.hsList"
                         style="border:1px solid green;">
                        <div>
                            <span><b>{{hs.name}}</b></span><br>
                            <img    height="80" width="80"
                                    :id="hs.name + hs.linkedscene"
                                    style="background-color: #0c82df"
                                    :src='getUrlBySceneName(hs.linkedscene)'
                                    @click="selectHotSpot(hs)"/>
                        </div>
                    </div>
                </v-flex>
                <v-flex xs8 id="container">
                </v-flex>
            </v-layout>
            <div style="overflow-x: scroll; height: 100%; width: 100%">
                <div v-for="s in scenesData"
                     style="display: inline-block; border:6px solid green;">
                    <div>
                        <span><b>{{s.name}}</b></span><br>
                        <img
                            :id="s.name"
                            style="background-color: #0c82df"
                            :src='s.url'
                            @click="mySelectScene(s.name)"/>
                    </div>
                </div>
            </div>
        </v-container>
        <div style="display: none">
            {{scenes}}
        </div>
    </div>
</template>

<script>
  var THREE = require('three');
  var OrbitControls = require('three-orbit-controls')(THREE);
  export default {
    name: "lookAtEditor",
    props: {
      scenes: Object,
    },
    data: function () {
      return {
        selected: {
          scene: '',
          hsList: [],
          hsIndex: '',
          hsLinkedScene: ''
        },
        camera: undefined,
        controls: undefined,
        renderer: undefined,
        scene: undefined,
        scenesData: {},
        hAngle: 0,
        vAngle: 90,
        panoDim: {
          h:9*40,
          w:16*40,
        }
      }
    },
    watch: {
      scenes(val) {
        for (let s in val){
          if(val.hasOwnProperty(s)){
            this.scenesData[s] = {};
            this.scenesData[s].hotspots = val[s];
            this.scenesData[s].url = "/getimage?scene="+s.substring(6);
            this.scenesData[s].name = s;
          }
        }
        console.log('Scenes watched ',JSON.stringify(this.scenesData));
      },
    },
    computed:{
      error(){
        return this.$store.getters['getError'];
      }
    },
    methods: {
      getUrlBySceneName: function(s){
        return "/getimage?scene="+s.substring(6);
      },
      selectHotSpot: function(hs){
        this.selected.hsIndex = hs.name;
        this.selected.hsLinkedScene = hs.linkedscene;
        this.reRunPano(hs.linkedscene);
      },
      mySelectScene: function(s){
        this.selected.scene = s;
        this.selected.hsList = this.scenesData[this.selected.scene].hotspots;
      },
      getTexturesByScene: function(myScene){
        var textures = [];
        var names = [
          this.getUrlBySceneName(myScene) + '&vr=r',
          this.getUrlBySceneName(myScene) + '&vr=l',
          this.getUrlBySceneName(myScene) + '&vr=u',
          this.getUrlBySceneName(myScene) + '&vr=d',
          this.getUrlBySceneName(myScene) + '&vr=f',
          this.getUrlBySceneName(myScene) + '&vr=b',
        ];
        var imageObj = [];
        for ( var i = 0; i < 6; i ++ ) {
          textures[ i ] = new THREE.Texture();
        }

        names.forEach((name, i) => {
          imageObj[i] = new Image();
          imageObj[i].onload = function(){
            var canvas, context;
            var tileWidth = imageObj[i].height;
            canvas = document.createElement( 'canvas' );
            context = canvas.getContext( '2d' );
            canvas.height = tileWidth;
            canvas.width = tileWidth;
            context.drawImage( imageObj[i], 0, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth );
            textures[ i ].image = canvas;
            textures[ i ].needsUpdate = true;
          };
          imageObj[i].src = names[i];
        });
        return textures;
      },
      onWindowResize: function () {
        this.camera.aspect = this.panoDim.w/this.panoDim.h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( this.panoDim.w, this.panoDim.h );
      },

      reRunPano: function(myScene){
        const container = document.getElementById( 'container' );
        // make container empty
        while (container.firstChild) container.removeChild(container.firstChild);
        const s = this.scenes;
        console.log(s);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( this.panoDim.w, this.panoDim.h );
        container.appendChild( this.renderer.domElement );

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera( 90, this.panoDim.w/this.panoDim.h, 0.1, 100 );
        this.camera.position.z = 0.01;

        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.enableZoom = false;
        this.controls.enablePan = false;
        this.controls.enableDamping = true;
        this.controls.rotateSpeed = - 0.25;

        const textures = this.getTexturesByScene(myScene);

        const materials = [];

        for ( var i = 0; i < 6; i ++ ) {
          materials.push( new THREE.MeshBasicMaterial( { map: textures[ i ] } ) );
        }

        const skyBox = new THREE.Mesh( new THREE.BoxBufferGeometry( 1, 1, 1 ), materials );
        skyBox.geometry.scale( 1, 1, - 1 );
        this.scene.add( skyBox );
        this.animate();
      },
      animate: function() {
        this.hAngle = (-1)*Math.floor(this.controls.getAzimuthalAngle()/Math.PI*180*100)/100;
        this.vAngle = Math.floor(this.controls.getPolarAngle()/Math.PI*180*100)/100;
        requestAnimationFrame( this.animate );
        this.controls.update(); // required when damping is enabled
        this.renderer.render( this.scene, this.camera );
      }
  },
    mounted: function(){
      // this.reRunPano();
      window.addEventListener( 'resize', this.onWindowResize, false );
    }
  }
</script>

<style scoped>
    .container {
        padding: unset!important;
    }
    .table-div1:nth-child(n+2) {
        margin-left:-1px;
    }
</style>