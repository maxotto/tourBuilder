<template>
    <div>{{options}}
        <v-dialog
                v-model="dialog"
                width="500"
        >
            <v-btn
                    slot="activator"
                    color="red lighten-2"
                    dark
                    small
                    :disabled="!upload"
            >
                Upload
            </v-btn>

            <v-card>
                <v-card-title
                        class="headline grey lighten-2"
                        primary-title
                >
                    Upload project zip
                </v-card-title>

                <v-card-text>
                    <uploader
                            ref="uploader"
                            :options="options"
                            class="uploader-example"
                            @complete="uploaded"
                    >
                        <uploader-unsupport></uploader-unsupport>
                        <uploader-drop>
                            <p>Drop files here to upload or</p>
                            <uploader-btn :attrs="attrs">select files</uploader-btn>
                        </uploader-drop>
                        <uploader-list></uploader-list>
                    </uploader>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            color="primary"
                            flat
                            @click="dialog = false"
                    >
                        I accept
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-btn small color="success" :disabled="!ini" :to="iniURL">Initiate</v-btn>
        <v-btn small color="success" :disabled="!build" :to="buildURL">Build</v-btn>
        <v-btn small color="success" :disabled="!plan">Set plan</v-btn>
        <v-btn small color="success" :disabled="!lookat">Set look at</v-btn>
    </div>
</template>

<script>
  export default {
    name: "actionButtons",
    props: ['state', 'id'],
    data () {
      return {
        dialog: false,
        upload: true,
        ini: false,
        build: false,
        plan: false,
        lookat: false,
        iniURL: '',
        buildURL: '',
        options: {
          chunkSize: 52428800*10,
          target: this.getTarget,
          testChunks: false
        },
        attrs: {
          accept: 'application/zip'
        },
      }
    },
    methods: {
      getTarget(){
        return '/upload/project/' + this.id
      },

      upload(){

      },
      setiniURL(){
        this.iniURL = "/projects/ini/" + this.id;
      },
      setBuildURL(){
        this.buildURL = "/projects/build/" + this.id;
      },
      setAllowByState(state){
        this.upload = !state.uploaded;
        this.build =
          state.floors &&
          state.floorsImages &&
          state.hotspots;

        this.lookat =
          state.lookatTag;

        this.plan = state.built && !state.needRebuild;
      }
    },
    wathch:{
      id(val){
          this.setiniURL();
          this.setBuildURL();
          this.setAllowByState(this.state);
          this.options.target = this.getTarget();
      }
    },
    mounted(){
      this.setiniURL();
      this.setBuildURL();
      this.setAllowByState(this.state);
    },
  }
</script>

<style scoped>

</style>