import axios from '../../services/axios'

const state = () => ({
  comments: [],
  commentCount: 1,
})

const getters = {}

const actions = {
  // params: String (post ID)
  async getComments({ commit }, postId) {
    try {
      const { data } = await axios.get(`v1/comments/${postId}`)
      const { success, data: { comments, commentCount } } = data
      
      commit('SET_COMMENTS', { comments, commentCount })

      return { success }
    } catch (err) {
      return { success: false }
    }
  },

  // params: Object
  async createComment({ commit }, { postId, parentId, ...payload }) {
    try {
      const { data: { success } } = await axios.post(`v1/comments/${postId}/${parentId}`, payload)
      
      if (success) await actions.getComments({ commit }, postId)
    } catch (err) {
      return { success: false }
    }
  },

  // params: Object
  async updateComment({ commit }, { id, postId, ...payload }) {
    try {
      const { data: { success } } = await axios.put(`v1/comments/${postId}/${id}`, payload)

      if (success) await actions.getComments({ commit }, postId)
    } catch (err) {
      return { success: false }
    }
  },

  // params: Object (post ID, comment ID)
  async deleteComment({ commit }, { id, postId }) {
    try {
      const { data: { success } } = await axios.delete(`v1/comments/${postId}/${id}`)

      if (success) await actions.getComments({ commit }, postId)
    } catch (err) {
      return { success: false }
    }
  },
}

const mutations = {
  SET_COMMENTS(state, { comments = [], commentCount }) {
    state.comments = comments
    state.commentCount = commentCount
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
