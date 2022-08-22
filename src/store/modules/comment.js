import axios from '../../services/axios'

const state = () => ({
  comments: [],
})

const getters = {}

const actions = {
  // params: String (post ID)
  async getComments({ commit }, payload) {
    try {
      const { data } = await axios.post(`${process.env.VUE_APP_API_URL}comments/${payload.postId}`)
      commit('SET_COMMENTS', data.data.comments)
      return data
    } catch (err) {
      return err.response.data
    }
  },

  // params: Object
  async createComment({ commit }, payload) {
    try {
      console.log('일반 코멘트 쓰기예욤', payload.parentId)
      const { data } = await axios.post(`${process.env.VUE_APP_API_URL}comments/${payload.postId}/${payload.parentId}`, payload)
      commit('SET_COMMENTS', data.data.comments)
      return data
    } catch (err) {
      return err.response.data
    }
  },

  // params: Object
  async updateComment({ commit }, payload) {
    try {
      const { data } = await axios.put(`${process.env.VUE_APP_API_URL}comments/${payload.postId}/${payload.id}`, payload)
      commit('SET_COMMENTS', data.data.comments)
      return data
    } catch (err) {
      return err.response.data
    }
  },

  // params: Object (post ID, comment ID)
  async deleteComment({ commit }, payload) {
    try {
      const { data } = await axios.delete(`${process.env.VUE_APP_API_URL}comments/${payload.postId}/${payload.id}`)
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
