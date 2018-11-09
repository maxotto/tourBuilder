import axios from "axios"

export default {
  fetchProjects () {
    return axios.get('projects/list')
  },

  addProject (params) {
    return axios.post('projects/create', params)
  },

  updateProject (params) {
    return axios.put('projects/' + params.id, params)
  },

  getProject (id) {
    return axios.get('projects/' + id)
  },

  getProjectXml (id) {
    return axios.get('projects/' + id + '/xml')
  },

  saveProjectXml (id, xml) {
    return axios.post('projects/' + id + '/xml', xml);
  },

  deleteProject (id) {
    return axios.delete('projects/' + id)
  }
}