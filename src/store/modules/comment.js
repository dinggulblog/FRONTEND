import axios from '../../services/axios'

const state = () => ({
  comments: [],
})

const getters = {}

const actions = {
  // params: String (post ID)
  async getComments({ commit }, postId) {
    try {
      const { data } = await axios.get(`v1/comments/${postId}`)
      commit('SET_COMMENTS', data.data.comments)
    } catch (err) {
      return err.response.data
    }
  },

  // params: Object
  async createComment({ commit }, { postId, parentId, ...payload }) {
    try {
      const { data } = await axios.post(`v1/comments/${postId}/${parentId}`, payload)
      console.log(data)
      if (data.success) {
        await actions.getComments({ commit }, postId)
      }
    } catch (err) {
      return err.response.data
    }
  },

  // params: Object
  async updateComment({ commit }, { id, postId, ...payload }) {
    try {
      const { data } = await axios.put(`v1/comments/${postId}/${id}`, payload)
      if (data.success) {
        await actions.getComments({ commit }, postId)
      }
    } catch (err) {
      return err.response.data
    }
  },

  // params: Object (post ID, comment ID)
  async deleteComment({ commit }, { id, postId }) {
    try {
      const { data } = await axios.delete(`v1/comments/${postId}/${id}`)
      if (data.success) {
        await actions.getComments({ commit }, postId)
      }
    } catch (err) {
      return err.response.data
    }
  },
}

const mutations = {
  SET_COMMENTS(state, comments = []) {
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
