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
                Select number of floors<br>
                and upload appropriate plans` images<br>
                {{formData}}
            </v-stepper-step>

            <v-stepper-content step="1">
                <v-card color="grey lighten-1" class="mb-5" height="200px">
                    <v-flex xs12 style="margin: 15px;">
                        <v-subheader class="pl-0">Custom thumb color</v-subheader>
                        <v-slider
                                style="width: 240px"
                                v-model="floorsCount"
                                thumb-label="always"
                                color="red"
                                ticks="always"
                                tick-size="1"
                                :max="4"
                                step="1"
                        ></v-slider>
                    </v-flex>
                    <v-btn small color="blue-grey" class="black--text" @click.native="openFileDialog">
                        Select file
                        <v-icon right dark>mdi-cloud-upload</v-icon>
                    </v-btn>
                    <input type="file" id="file-upload" style="display:none" @change="onFileChange">
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
  export default {
    name: "initiateProject",
    props: ['id'],
    data () {
      return {
        step: 1,
        floorsCount: 1,
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
      },
    },
    watch: {
      id(val){
        this.getProject();
      }
    },

    mounted(){
      this.formData = new FormData();
      this.id = this.$route.params.id;
      this.getProject();
    },
  }
</script>

<style scoped>

</style>