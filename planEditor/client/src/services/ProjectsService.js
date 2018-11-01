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

  deleteProject (id) {
    return axios.delete('projects/' + id)
  }
}