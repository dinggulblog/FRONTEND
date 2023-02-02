import { searchParentComment } from '../../common/util.js' 
import axios from '../../services/axios'

const state = () => ({
  comments: [],
  commentCount: 0,
})

const getters = {
  getParentComment: (state) => (parentId) => {
    return state.comments.find(comment => searchParentComment(comment, parentId))
  }
}

const actions = {
  // params: String (post ID)
  async getComments({ commit }, postId) {
    try {
      const { data } = await axios.get(`v1/comments/${postId}`)
      const { success, data: { comments, commentCount } } = data
      
      commit('SET_COMMENTS', { comments, commentCount })

      return { success, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message }
    }
  },

  // params: Object
  async createComment({ commit }, { postId, parentId, ...payload }) {
    try {
      const { data: { success } } = await axios.post(`v1/comments/${postId}/${parentId}`, payload)
      
      if (success) await actions.getComments({ commit }, postId)
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message }
    }
  },

  // params: Object
  async updateComment({ commit }, { id, postId, ...payload }) {
    try {
      const { data: { success } } = await axios.put(`v1/comments/${postId}/${id}`, payload)

      if (success) await actions.getComments({ commit }, postId)
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message }
    }
  },

  // params: Object (post ID, comment ID)
  async deleteComment({ rootState, commit }, { id, postId, commenterId }) {
    try {
      if (!id || !postId) throw new Error(`${id ? '게시물' : '댓글'}을 찾을 수 없습니다.`)
      if (!rootState.auth.isLogin) throw new Error('로그인 후 사용 가능합니다.')
      if (rootState.auth.id !== commenterId) throw new Error('본인 댓글만 삭제가 가능합니다.')

      const { data: { success } } = await axios.delete(`v1/comments/${postId}/${id}`)

      if (success) await actions.getComments({ commit }, postId)
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message }
    }
  },
}

const mutations = {
  SET_COMMENTS(state, { comments = [], commentCount = 0 }) {
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
