<template>
    <div>
        Build Project page
        {{id}}
        <v-btn small color="success" @click="clickButton">Socket send Test</v-btn>
    </div>
</template>

<script>
  import ProjectsService from '@/services/ProjectsService';

  export default {
    name: "buildProject",
    props: ['id'],
    methods: {
      clickButton: function(val){
        // $socket is socket.io-client instance
        console.log(this.$socket);
        this.$socket.emit('chat message', 'Проба');
        ProjectsService.buildProject(this.id);
      },

    },
    mounted(){
    this.$socket.on('news', function (data) {
      console.log(data);
    });
    },
  }
</script>

<style scoped>

</style>