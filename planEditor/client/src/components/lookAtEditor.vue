<template>
    <div style="width: 100%; height: 100%">
        <v-container grid-list-md text-xs-center>
            <v-layout row wrap>
                <v-flex xs4>
                    <p style="color: crimson" id="angle"> Azimuthal Angle = {{hAngle}}</p>
                    <p style="color: green" id="vangle"> Polar Angle = {{vAngle}}</p>
                    <v-card v-for="s in scenesData" >
                        <img style="border:6px solid green; background-color: #0c82df" :src='s.url'/>
                    </v-card>
                </v-flex>
                <v-flex xs8 id="container">
                </v-flex>
            </v-layout>
        </v-container>
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
        console.log('Scenes wathed ',val);
        for (let s in val){
          if(val.hasOwnProperty(s)){
            this.scenesData[s] = val[s];
            this.scenesData[s].url = "/getimage?scene="+s.substring(6);
          }
        }
      },
    },
    computed:{
      error(){
        return this.$store.getters['getError'];
      }
    },
    methods: {
      test: function(){
        var scene = new THREE.Scene();
      },
      getTexturesFromFolder: function(folder){
        var textures = [];
        var names = [
          'pano_r.jpg',
          'pano_l.jpg',
          'pano_u.jpg',
          'pano_d.jpg',
          'pano_f.jpg',
          'pano_b.jpg',
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
      animate: function() {
        this.hAngle = Math.floor(this.controls.getAzimuthalAngle()/Math.PI*180*100)/100;
        this.vAngle = Math.floor(this.controls.getPolarAngle()/Math.PI*180*100)/100;
        requestAnimationFrame( this.animate );
        this.controls.update(); // required when damping is enabled
        this.renderer.render( this.scene, this.camera );
      }
  },
    mounted: function(){
      const container = document.getElementById( 'container' );
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

      const textures = this.getTexturesFromFolder();

      const materials = [];

      for ( var i = 0; i < 6; i ++ ) {
        materials.push( new THREE.MeshBasicMaterial( { map: textures[ i ] } ) );
      }

      const skyBox = new THREE.Mesh( new THREE.BoxBufferGeometry( 1, 1, 1 ), materials );
      skyBox.geometry.scale( 1, 1, - 1 );
      this.scene.add( skyBox );

      window.addEventListener( 'resize', this.onWindowResize, false );
      this.animate();
    }
  }
</script>

<style scoped>
    .container {
        padding: unset!important;
    }
</style>