import '@babel/polyfill'
import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import './plugins/vuetify'
import App from './App.vue'
import store from './store'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import uploader from 'vue-simple-uploader'
import VueSocketio from 'vue-socket.io-extended';
import io from 'socket.io-client';
Vue.use(VueSocketio, io('http://localhost:3000'));
Vue.use(uploader);
Vue.use(VueAxios, axios);
Vue.config.productionTip = false;
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyARIMiX_C7rE4U-pM6nih2n2z2z0YfhrfY',
    libraries: 'places',
  },
});

new Vue({
  sockets:{
    connect: function(){
      console.log('socket connected')
    },
    customEmit: function(val){
      console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
    }
  },
  store,
  router,
  render: h => h(App)
}).$mount('#app');
