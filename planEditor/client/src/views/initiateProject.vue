<template>
    <div>
        <v-snackbar
                v-model="snackbar.visible"
                :bottom="snackbar.y === 'bottom'"
                :left="snackbar.x === 'left'"
                :multi-line="snackbar.mode === 'multi-line'"
                :right="x === 'right'"
                :timeout="snackbar.timeout"
                :top="y === 'top'"
                :vertical="snackbar.mode === 'vertical'"
        >
            {{ snackbar.text }}
            <v-btn
                    color="pink"
                    flat
                    @click="snackbar.snackbar = false"
            >
                Close
            </v-btn>
        </v-snackbar>
        <h1>Initiate project</h1>
        <span style="color: red;"><b> {{lastError}}</b></span><br>
        <v-stepper v-model="step" vertical>
            <v-stepper-step :complete="step > 1" step="1">
                <h3>Select number of floors</h3>
                and upload appropriate plans` images<br>
            </v-stepper-step>

            <v-stepper-content step="1">
                <v-card color="grey lighten-1" class="mb-5">
                    <v-flex xs12 style="margin: 15px;">
                        <v-subheader class="pl-0">Select number of floors</v-subheader>
                        <div class="floorSelectorContainer">
                            <v-layout row wrap v-for="(template, i) in floorsTemplate" :key="`${i}`" class="floorSelector" align-content-center>
                                <v-flex xs3 align-content-center>
                                    <v-switch
                                            :label="`${template.name}`"
                                            v-model="template.state"
                                    ></v-switch>
                                </v-flex>
                                <v-flex xs1 align-content-center>
                                    <img :src="`/getimage/fromtemplate/${id}/floorselector/${i}/up`"/>
                                </v-flex>
                                <v-flex xs4 align-content-center>
                                    <upload-block :template="template" :recordId="id" @clicked="uploaded" :forceUpload="template.state"></upload-block>
                                </v-flex>
                                <v-flex xs4 align-content-center>
                                    <v-img
                                            :id="`floormap${i}`"
                                            class="floormap"
                                            :src="`${template.image}`"
                                            max-height="64"
                                            aspect-ratio="1"
                                            contain
                                    />
                                </v-flex>
                            </v-layout>
                        </div>
                    </v-flex>
                </v-card>
                <v-btn color="primary" @click="step = 2">Continue</v-btn>
                <v-btn flat>Cancel</v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="step > 2" step="2">Configure analytics for this app</v-stepper-step>

            <v-stepper-content step="2">
                <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
                <v-btn color="primary" @click="step = 3">Continue</v-btn>
                <v-btn flat>Cancel</v-btn>
            </v-stepper-content>

            <v-stepper-step :complete="step > 3" step="3">Select an ad format and name ad unit</v-stepper-step>

            <v-stepper-content step="3">
                <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
                <v-btn color="primary" @click="step = 4">Continue</v-btn>
                <v-btn flat>Cancel</v-btn>
            </v-stepper-content>

            <v-stepper-step step="4">View setup instructions</v-stepper-step>
            <v-stepper-content step="4">
                <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
                <v-btn color="primary" @click="step = 1">Continue</v-btn>
                <v-btn flat>Cancel</v-btn>
            </v-stepper-content>
        </v-stepper>
    </div>
</template>

<script>
  import ProjectsService from '@/services/ProjectsService';
  import UploadBlock from '@/components/uploadBlock'
  import axios from "axios";

  export default {
    name: "initiateProject",
    components: {UploadBlock},
    props: ['id'],
    data () {
      return {
        ready: false,
        step: 1,
        FormData: undefined,
        floorsCount: 0,
        floors: [],
        floorItem: {

        },
        emptyImage: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
        floorsTemplate: [
          {
            number:0,
            name: 'Basement',
            state: false,
            files: [],
            image: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
            uploaded: false,
          },
          {
            number:1,
            name: 'First floor',
            state: false,
            files: [],
            image: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
            uploaded: false,
          },
          {
            number:2,
            name: 'Second floor',
            state: false,
            files: [],
            image: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
            uploaded: false,
          },
          {
            number:3,
            name: 'Third floor',
            state: false,
            files: [],
            image: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
            uploaded: false,
          },
        ],

        tour: undefined,
        project: null,
        snackbar: {
          visible: false,
          y: 'top',
          x: null,
          mode: 'multi-line',
          timeout: 6000,
          text: 'Hello, I\'m a snackbar'
        },
        lastError: ''
      }
    },
    methods: {
      uploaded(floorNumber){
        // console.log('Uploaded', floorNumber);
        this.getProject();
      },
      getProject(){
        ProjectsService.getProject(this.id)
          .then(result => {
            // console.log(result.data);
            if (result.data.success){
              this.project = result.data.project;
              this.lastError = '';
              this.updateFloorMaps();
            } else {
              this.project = null;
              this.lastError = result.data.message;
              this.snackbar.text = this.lastError;
              this.lastError = result.data.message;
              this.snackbar.visible = true;
            }

          })
          .catch(error => {console.log(error)});
        ProjectsService.getProjectXml(this.id)
          .then(tour => {
            this.tour = tour;
          })
          .catch(error => {console.log(error)});
      },
      updateFloorMaps(){
        this.floorsTemplate.forEach((floor, i) => {
          const index = this.project.floorSelect.findIndex(elem => {
            return (floor.number == elem.floor);
          });
          if (index >= 0){
            this.floorsTemplate[i].image = this.emptyImage;
            this.floorsTemplate[i].state = true;
            this.floorsTemplate[i].uploaded = true;
            setTimeout(()=>{
                this.floorsTemplate[i].image = `getimage/floormap/${this.id}/${i}?rnd` + +Math.random();
            },100);
          } else {
            // console.log('Clear state', this.floorsTemplate);
            this.floorsTemplate[i].image = this.emptyImage;
            this.floorsTemplate[i].state = false;
            this.floorsTemplate[i].uploaded = false;
            this.floorsTemplate[i].files = [];
          }
        });

/*
        this.project.floorSelect.forEach((v, i, a) => {
          console.log(v,i);
          const index = this.floorsTemplate.findIndex((element, index, array) => {
            return (element.number == v.floor);
          });
          if (index >= 0){
            this.floorsTemplate[index].image = this.emptyImage;
            this.floorsTemplate[index].state = true;
            this.floorsTemplate[index].uploaded = true;
            setTimeout(()=>{
              this.floorsTemplate[index].image = `getimage/floormap/${this.id}/${index}?rnd` + +Math.random();
              },100);
          } else {
            console.log('Clear state', this.floorsTemplate);
            this.floorsTemplate[index].image = this.emptyImage;
            this.floorsTemplate[index].state = false;
            this.floorsTemplate[index].uploaded = false;
          }
        });
        */
        setTimeout(()=>{this.ready = true;},100);

      },
      getFloorSelectorPicNames(number){
        return {
          up: number + 'FloorUp.jpg',
          down: number + 'FloorDown.jpg',
        }
      },
      detectStateChange(val){
        let changes = [];
        val.forEach((newFloor,i)=>{
          if(!newFloor.state && newFloor.image!==this.emptyImage){
            changes.push(i);
          }
        });
        // console.log({changes});
        changes.forEach(change => {
          this.axios.delete(`/delete/floorImage/${this.id}/${this.floorsTemplate[change].number}`)
            .then(res => {
              if(res.data.success){
                this.getProject();
              } else {
                // console.log(res);
              }
            })
            .catch(err=>{
              // console.log(err);
            });
        });
      }
    },
    watch: {
      id(val){
        this.getProject();
      },
      floorsTemplate: {
        handler: function (val){
          if (this.ready) {
            this.detectStateChange(val);
            // console.log("Deep watcher",val);
          }
        },
      deep: true
      }
    },

    mounted(){
      this.id = this.$route.params.id;
      this.getProject();
    },
  }
</script>

<style scoped>
    .floorSelector{
        min-height: 85px;
    }
    .floorSelectorContainer{
        max-width: 600px;
    }
</style>