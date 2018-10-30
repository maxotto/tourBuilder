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

  getPost (params) {
    return axios.get('projects/' + params.id)
  },

  deleteProject (id) {
    return axios.delete('projects/' + id)
  }
}