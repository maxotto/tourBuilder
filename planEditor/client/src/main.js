import '@babel/polyfill'
import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import './plugins/vuetify'
import App from './App.vue'
import store from './store'
import router from './router'

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
