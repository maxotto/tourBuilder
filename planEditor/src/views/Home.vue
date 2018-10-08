<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'


export default {
  name: 'home',
  components: {
    HelloWorld
  },
  mounted(){
    require(['esprima'], function (parser) {
      // Do something with parser, e.g.
      var syntax = parser.parse('var answer = 42');
      console.log(JSON.stringify(syntax, null, 4));
    });
  }
}
</script>
