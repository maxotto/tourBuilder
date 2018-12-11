<template>
    <div>
        Build Project
        <v-btn small color="success" @click="startBuild">Start build</v-btn>
        <div class="log">
            <template v-for="row in logTxt">{{row}}<br></template>
        </div>
    </div>

</template>

<script>
  import ProjectsService from '@/services/ProjectsService';

  export default {
    name: "buildProject",
    props: ['id'],
    data () {
      return {
        logTxt: [],
      }
    },
    methods: {
      startBuild: function(){
        ProjectsService.buildProject(this.id)
          .then(res=>{console.log(res)})
          .catch(err=>{console.log(err)});
      },
      clickButton: function(val){
        // $socket is socket.io-client instance
        console.log(this.$socket);
        this.$socket.emit('chat message', 'Проба');
      },

    },
    mounted(){
    this.$socket.on('news', function (data) {
      console.log(data);
    });
      this.$socket.on('build', (data) => {
        const self = this;
        self.logTxt.push(data.message);
//         console.log(self.logTxt, data.message);
      });
    },
  }
</script>

<style scoped>
    .log{
        width: 500px;
        border-style: solid;
        border-width: 5px;
        border-color: #00d800;
        background-color: #e0e0e0;

    }
</style>