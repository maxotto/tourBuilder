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
        {{project}}<br>
        {{ id }}<br>
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
                            <v-flex xs4>
                                <upload-block :template="template"></upload-block>
                            </v-flex>
                            <v-flex xs3>
                                <v-card-text class="px-0">uploaded plan</v-card-text>
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
        floorsTemplate: [
          {
            number:0,
            name: 'Basement',
            state: false,
            cb: 'fileChanged0',
          },
          {
            number:1,
            name: 'First floor',
            state: false,
            cb: 'fileChanged1',
          },
          {
            number:2,
            name: 'Second floor',
            state: false,
            cb: 'fileChanged2',
          },
          {
            number:3,
            name: 'Third floor',
            state: false,
            cb: 'fileChanged3',
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
      fileChanged0(file){this.fileChanged(0,file)},
      fileChanged1(file){this.fileChanged(1,file)},
      fileChanged2(file){this.fileChanged(2,file)},
      fileChanged3(file){this.fileChanged(3,file)},
      fileChanged(file){
        console.log(file);
        if(!this.FormData) this.FormData = new FormData();
        this.FormData.append('myfile', file, file.name);
        console.log(this.FormData);
        axios.post( '/upload/floorImage/'+this.id+'/'+'0',
          this.FormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        ).then(function(){
          console.log('SUCCESS!!');
        })
          .catch(function(error){
            console.log(error);
          });
      },
      getProject(){
        ProjectsService.getProject(this.id)
          .then(result => {
            console.log(result.data);
            if (result.data.success){
              this.project = result.data.project;
              this.lastError = '';

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