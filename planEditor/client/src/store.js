import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //Plan Editor and LookAt Editor values
    xmlData: undefined,
    scenes: undefined,
    saving: false,
    error: '',
    // projectList values
    currentId: undefined,
    needToReloadCurrent: false,
  },
  getters:{
    getNeedToReloadCurrent: state => {
      return state.needToReloadCurrent;
    },
    getCurrentId: state => {
      return state.currentId;
    },
    getXmlData: state => {
      return state.xmlData;
    },
    getScenes: state => {
      return state.scenes;
    },
    getSaving: state => {
      return state.saving;
    },
    getError: state => {
      return state.error;
    }
  },
  mutations: {
    setNeedToReloadCurrent(state, value) {
      state.needToReloadCurrent = value;
    },
    setCurrentId(state, value) {
      state.currentId = value;
    },
    setXmlData(state, value){
      state.xmlData = value;
    },

    setScenes(state, value){
      state.scenes = value;
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

    fetchXmlData({commit}, id){
      commit('setError', '');
      axios.get('/readxml/' + id)
      .then(function (response) {
        commit('setXmlData', response.data.planHotspotsData);
        commit('setScenes', response.data.lookATData);
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
      let dataType = 'floor';
      if(data.dataType){
        dataType = data.dataType;
      }
      commit('setError', '');
      axios.post(`/writexml/${data.id}?type=`+dataType, data).then(response => {
        if(response.data.status === 'ok'){
          dispatch('fetchXmlData', data.id);
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
      commit('setHotspotsByFloor', data);
      commit('setSaving', true);
      dispatch('writeDatToXmlFile', data);
    },

    saveLookAtJob({commit, dispatch}, data){
      commit('setScenes', data.scenesData);
      commit('setSaving', true);
      dispatch('writeDatToXmlFile', data);
    },
  }
});


