<template>
    <div>
        <v-btn small color="success" :disabled="!ini" :to="iniURL">Initiate</v-btn>
        <v-btn small color="success" :disabled="!build">Build</v-btn>
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
      }
    },
    methods: {
      setiniURL(){
        this.iniURL = "/projects/ini/" + this.id;
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
      }
    },
    mounted(){
      this.setiniURL();
    },
  }
</script>

<style scoped>

</style>