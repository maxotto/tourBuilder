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

                        <v-layout row wrap v-for="(template, i) in floorsTemplate" :key="`${i}`">
                            <v-flex xs2>
                                <v-switch
                                        :label="`${template.name}`"
                                        v-model="template.state"
                                ></v-switch>
                            </v-flex>
                            <v-flex xs1>
                                <img :src="`/getimage/fromtemplate/${id}/floorselector/${i}/up`"/>
                            </v-flex>
                            <v-flex xs5>
                                <upload-block :template="template" :recordId="id" @clicked="uploaded"></upload-block>
                            </v-flex>
                            <v-flex xs2>
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
            cb: 'fileChanged0',
            files: [],
            image: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
          },
          {
            number:1,
            name: 'First floor',
            state: false,
            cb: 'fileChanged1',
            files: [],
            image: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
          },
          {
            number:2,
            name: 'Second floor',
            state: false,
            cb: 'fileChanged2',
            files: [],
            image: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
          },
          {
            number:3,
            name: 'Third floor',
            state: false,
            cb: 'fileChanged3',
            files: [],
            image: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
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
        console.log('Uploaded', floorNumber);
        this.getProject();
      },
      getProject(){
        ProjectsService.getProject(this.id)
          .then(result => {
            console.log(result.data);
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
          .then()
          .catch(error => {console.log(error)});
      },
      updateFloorMaps(){
        this.project.floorSelect.forEach((v, i, a) => {
          console.log(v,i);
          const index = this.floorsTemplate.findIndex((element, index, array) => {
            return (element.number == v.floor);
          });
          if (index >= 0){
            this.floorsTemplate[index].image = this.emptyImage;
            setTimeout(()=>{
              this.floorsTemplate[index].image = `getimage/floormap/${this.id}/${index}?rnd` + +Math.random();
              },100);

            console.log(this.floorsTemplate);
          }
        });
      },
      getFloorSelectorPicNames(number){
        return {
          up: number + 'FloorUp.jpg',
          down: number + 'FloorDown.jpg',
        }
      }
    },
    watch: {
      id(val){
        this.getProject();
      }
    },

    mounted(){
      this.id = this.$route.params.id;
      this.getProject();
    },
  }
</script>

<style scoped>

</style>