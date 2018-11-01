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
        {{project}}
        {{ id }}
        <span style="color: red;"><b> {{lastError}}</b></span>
    </div>
</template>

<script>
  import ProjectsService from '@/services/ProjectsService';
  export default {
    name: "initiateProject",
    props: ['id'],
    data () {
      return {
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
        console.log('Id changed and became ', val);
        this.getProject();
      }
    },

    mounted(){
      console.log('Ini page mounted. Id = ', this.$route.params.id);
      this.id = this.$route.params.id;
      this.getProject();
    },
  }
</script>

<style scoped>

</style>