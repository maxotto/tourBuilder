<template>
    <v-dialog
            v-model="show"
            max-width="650"
            persistent
    >
        <v-card>
            <v-card-title class="headline">Build Project</v-card-title>
            <div>
                <div class="log" id="log">
                    <template v-for="row in logTxt">{{row}}<br></template>
                </div>
            </div>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small color="success" @click="startBuild" :disabled="inProcess">Start build</v-btn>
                <v-btn
                        color="green darken-1"
                        flat="flat"
                        :disabled="inProcess"
                        @click="closeDlg()"
                >
                    Close
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
  import ProjectsService from '@/services/ProjectsService';

  export default {
    name: "buildDlg",
    props: ['id', 'show'],
    data () {
      return {
        logTxt: [],
        logDiv: undefined,
        inProcess: false,
        success: false,
      }
    },
    methods: {
      closeDlg(){
        this.logTxt=[];
        this.$emit('closeDlg', this.success);
      },
      startBuild: function(){
        this.inProcess = true;
        this.success = false;
        ProjectsService.buildProject(this.id)
            .then(res=>{
              this.inProcess = false;
              this.success = true;
              this.logDiv.scrollTop = this.logDiv.scrollHeight - this.logDiv.clientHeight;
              alert('Project is built!');
              this.$store.commit('setNeedToReloadCurrent', true);
            })
            .catch(err=>{
              // this.logDiv.scrollTop = this.logDiv.scrollHeight - this.logDiv.clientHeight;
              this.inProcess = false;
              console.log(err)});
      },
    },
    mounted(){
      this.logDiv = document.getElementById("log");
      this.$socket.on('build', (data) => {
        this.logTxt.push(data.message);
        Promise.resolve().then(()=>{
          this.logDiv.scrollTop = this.logDiv.scrollHeight - this.logDiv.clientHeight;
        });

      });
    },
  }
</script>

<style scoped>
    .log{
        width: 500px;
        max-height: 350px;
        height: 350px;
        border-style: solid;
        border-width: 5px;
        border-color: #00d800;
        background-color: #e0e0e0;
        overflow-y: scroll;
    }
</style>