import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    xmlData: undefined,
    saving: false,
  },
  getters:{
    getXmlData: state => {
      return state.xmlData;
    },
    getSaving: state => {
      return state.saving;
    }
  },
  mutations: {
    setXmlData(state, value){
      state.xmlData = value;
    },

    setSaving(state, value){
      state.saving = value;
    },

    setHotspotsByFloor(state, data){
      state.xmlData[data.floor]['hotspots'] = data.hotspots;
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
    },

    writeDatToXmlFile({commit}){
      setTimeout(()=>{
        commit('setSaving', false);
      }, 3000);
    },

    saveFloorJob({commit, dispatch}, data){
      // console.log(data);
      commit('setHotspotsByFloor', data);
      commit('setSaving', true);
      dispatch('writeDatToXmlFile');
    }
  }
});


