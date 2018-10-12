<template>
<v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>

        <v-select
          v-model="floor"
          :items="items"
          item-text="name"
          item-value="name"
          label="Select floor to edit"
          persistent-hint
          return-object
          single-line
        ></v-select>
        <plan-editor :floor="floor.name" :xmlData="xmlData"></plan-editor>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.container {
    padding: unset!important;
}
</style>

<script>
// @ is an alias to /src
import planEditor from '@/components/planEditor.vue'

export default {
  name: 'home',
  components: {
    planEditor
  },
  data: function () {
    return {
      floor: '',
      items: []
    }
  },
  computed:{
    xmlData(){
      const data = this.$store.getters['getXmlData']; 
      for(let plan in data){
        if(data.hasOwnProperty(plan)){
          this.items.push({
            floor: data[plan].floor,
            name: plan,
            image: data[plan].image
          });
        }
      }
      return data;
    }
  },
  mounted(){
    this.$store.dispatch('fetchXmlData');
  }
}
</script>
