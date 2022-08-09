import axios from '../../services/axios'

const state = () => ({
  comments: [],
})

const getters = {}

const actions = {
  // params: String (post ID)
  async getComments({ commit }, payload) {
    try {
      const { data } = await axios.post(`${process.env.VUE_APP_API_URL}comments/${payload.pid}`)
      commit('SET_COMMENTS', data.data.comments)
      return data
    } catch (err) {
      return err.response.data
    }
  },

  // params: Object
  async createComment({ commit }, payload) {
    try {
      const { data } = await axios.post(`${process.env.VUE_APP_API_URL}comments/${payload.pid}`, payload)
      commit('SET_COMMENTS', data.data.comments)
      return data
    } catch (err) {
      return err.response.data
    }
  },

  // params: Object
  async updateComment({ commit }, payload) {
    try {
      const { data } = await axios.put(`${process.env.VUE_APP_API_URL}comments/${payload.pid}/${payload._id}`, payload)
      commit('SET_COMMENTS', data.data.comments)
      return data
    } catch (err) {
      return err.response.data
    }
  },

  // params: Object (post ID, comment ID)
  async deleteComment({ commit }, payload) {
    try {
      const { data } = await axios.delete(`${process.env.VUE_APP_API_URL}comments/${payload.pid}/${payload._id}`)
      commit('SET_COMMENTS', data.data.comments)
      return data
    } catch (err) {
      return err.response.data
    }
  },
}

const mutations = {
  SET_COMMENTS(state, comments) {
    state.comments = comments
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
