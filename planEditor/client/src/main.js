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
  store,
  router,
  render: h => h(App)
}).$mount('#app');
