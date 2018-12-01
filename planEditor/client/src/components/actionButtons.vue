<template>
    <div>
        <v-dialog
                v-model="dialog"
                width="500"
        >
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
                            @file-success="fileSuccess"
                            @file-error="fileError"
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
        <v-btn
                color="success"
                small
                :disabled="!upload"
                @click="dialog = true"
        >
            Upload
        </v-btn>
        <v-btn small color="success" :disabled="!ini" :to="iniURL">Initiate</v-btn>
        <!--- <v-btn small color="success" :disabled="!build" :to="buildURL">Build</v-btn> --->
        <v-btn small color="success" :disabled="!build" @click="buildDlgShow=true">Build</v-btn>
        <v-btn small color="success" :disabled="!plan">Set plan</v-btn>
        <v-btn small color="success" :disabled="!lookat">Set look at</v-btn>
        <build-dlg :id="id" :show="buildDlgShow" @closeDlg="closeBuildDlg"></build-dlg>
    </div>
</template>

<script>
    import BuildDlg from '@/components/buildDlg.vue';
  export default {
    components: {BuildDlg},
    name: "actionButtons",
    props: ['state', 'id'],
    data () {
      return {
        buildDlgShow:false,
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
      closeBuildDlg(val){
        this.buildDlgShow = false;
      },
      getTarget(){
        return '/upload/project/' + this.id
      },
      fileSuccess(rootFile, file, message, chunk){
        //console.log(rootFile, file, message, chunk);
        this.$emit('unzipped', message);
      },
      fileError(rootFile, file, message, chunk){
        //console.log(rootFile, file, message, chunk);
        this.$emit('unzipped', message);
      },
      setiniURL(){
        this.iniURL = "/projects/ini/" + this.id;
      },
      setBuildURL(){
        this.buildURL = "/projects/build/" + this.id;
      },
      setAllowByState(state){
        this.upload = !state.uploaded;
        this.ini = state.uploaded && !state.built;
        this.build =
          state.floors &&
          state.floorsImages &&
          state.hotspots;

        this.lookat =
          state.lookatTag;

        this.plan = state.built && !state.needRebuild;
      }
    },
    computed:{
      currentState: {
        get(){
          console.log('State change', this.state);
          this.setAllowByState(this.state);
          return this.state;
        },
      }
    },
    wathch:{
      id(val){
          this.setiniURL();
          this.setBuildURL();
          this.setAllowByState(this.state);
          this.options.target = this.getTarget();
      },
    },
    mounted(){
      this.setiniURL();
      this.setBuildURL();
      this.setAllowByState(this.state);
      this.$socket.on('unzip', function (data) {
        // console.log(data);
      });
    },
  }
</script>

<style scoped>

</style>