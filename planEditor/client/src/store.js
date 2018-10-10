import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    xmlData: undefined
  },
  getters:{
    getXmlData: state => {
      return state.xmlData;
    }
  },
  mutations: {
    setXmlData(state, value){
      state.xmlData = value;
    }
  },
  actions: {
    fetchXmlData({commit}){
      axios.get('/readxml')
      .then(function (response) {
        commit('setXmlData', response.data);
      })
      .catch(function (error) {
        // console.log(error);
        throw error
      })
      .then(function () {
        // always executed
      }); 
    }
  }
});


