<template>
    <div>
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
        ini: true,
        build: false,
        plan: false,
        lookat: false,
        iniURL: '',
        'buildURL': '',
      }
    },
    methods: {
      setiniURL(){
        this.iniURL = "/projects/ini/" + this.id;
      },
      setBuildURL(){
        this.buildURL = "/projects/build/" + this.id;
      },
      setAllowByState(state){
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