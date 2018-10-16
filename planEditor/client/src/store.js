import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    xmlData: undefined,
    saving: false,
    error: '',
  },
  getters:{
    getXmlData: state => {
      return state.xmlData;
    },
    getSaving: state => {
      return state.saving;
    },
    getError: state => {
      return state.error;
    }
  },
  mutations: {
    setXmlData(state, value){
      state.xmlData = value;
    },

    setSaving(state, value){
      state.saving = value;
    },

    setError(state, value){
      state.error = value;
    },

    setHotspotsByFloor(state, data){
      state.xmlData[data.floor]['hotspots'] = data.hotspots;
    }
  },
  actions: {
    fetchXmlData({commit}){
      commit('setError', '');
      axios.get('/readxml')
      .then(function (response) {
        commit('setXmlData', response.data);
      })
      .catch(function (error) {
        console.log(error);
        commit('setError', error.message);
        throw error;
      })
      .then(function () {
        // always executed
      }); 
    },

    writeDatToXmlFile({commit, dispatch}, data){
      commit('setError', '');
      axios.post('/writexml', data).then(response => {
        if(response.data.status === 'ok'){
          dispatch('fetchXmlData');
        } else {
          console.log(response.data.message);
        }
        commit('setSaving', false);
      }
      ).catch(error => {
        console.log({error});
        commit('setError', error.message);
        commit('setSaving', false);
      });
    },

    saveFloorJob({commit, dispatch}, data){
      // console.log(data);
      commit('setHotspotsByFloor', data);
      commit('setSaving', true);
      dispatch('writeDatToXmlFile', data);
    }
  }
});


