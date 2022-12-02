import { stringify } from 'querystring'
import axios from '../../services/axios'

const state = () => ({
  post: {},
  posts: [],
  likes: [],
  likeCount: 0,
  page: 1,
  limit: 6,
  maxPage: 1,
})

const getters = {}

const actions = {
  /**
   * Get post with Post ID
   * @param {String} payload Post ID
   * @return {Object} Success, Post
   */
  async getPost({ commit }, payload) {
    try {
      const { data } = await axios.get(`v1/posts/${payload}`)
      const { success, message, data: { post, likes, likeCount } } = data

      if (!success || !post) throw new Error(message || '게시물을 받아오지 못하였습니다.')

      commit('SET_POST', post)
      commit('SET_POST_LIKES', { likes, likeCount })

      return { success, post }
    } catch (err) {
      console.log(err.response)
      return { success: false }
    }
  },

  /**
   * Get posts with pagenation query object
   * @param {Object} payload { menu, page, limit, ... }
   */
  async getPosts({ commit }, { auth = true, payload }) {
    try {
      const { data } = await axios.get('v1/posts', { params: payload, paramsSerializer: (params) => stringify(params), headers: { Authorization: auth } })
      const { success, data: { posts = [], maxPage = 1 } } = data

      if (!success) throw new Error('게시물 리스트 쿼리가 이상해요')

      commit('SET_POSTS', { posts, maxPage })
    } catch (err) {
      console.log(err.response)
      return { success: false }
    }
  },

  /**
   * Create a post with post object
   * @param {Object} Post { title, content, menu, ... }
   */
  async createPost({ commit }, payload) {
    try {
      const { data } = await axios.post('v1/posts', payload)
      const { success, data: { post } } = data

      if (!success) throw new Error('게시물이 작성되지 않앗따')

      return { success, post }
    } catch (err) {
      console.log(err.response)
      return { success: false }
    }
  },

  /**
   * Update a post with post object
   * @param {Object} Post { _id, title, content, menu, ... }
   * @return Success, Post
   */
  async updatePost({ commit }, { postId, payload }) {
    try {
      const { data } = await axios.put(`v1/posts/${postId}`, payload)
      const { success, data: { post } } = data

      if (!success) throw new Error('게시물이 수정되지 않앗따')
      
      return { success, post }
    } catch (err) {
      console.log(err.response)
      return { success: false }
    }
  },

  /**
   * Add my ID from the like field of a post
   * @param {String} payload Post ID
   */
  async updateLike({ commit }, { postId, user }) {
    try {
      const { data } = await axios.put(`v1/posts/${postId}/like`)
      const { success } = data
      
      if (!success) throw new Error('게시물 좋아요가 수정되지 않앗따')

      commit('ADD_POST_LIKE', user)
      return { success }
    } catch (err) {
      console.log(err.response)
      return { success: false }
    }
  },

  /**
   * Delete a post with post ID
   * @param {String} payload Post ID
   */
  async deletePost({ commit }, payload) {
    try {
      const { data } = await axios.delete(`v1/posts/${payload}`)
      const { success } = data

      if (!success) throw new Error('게시물이 삭제되지 않았따')

      commit('SET_POST', {})
      return { success }
    } catch (err) {
      console.log(err.response)
      return { success: false }
    }
  },

  /**
   * Delete a file from the post
   * @param {String} postId
   * @param {String} imageId
   */
  async deleteFile({ commit }, { postId, imageId }) {
    try {
      const { data } = await axios.delete(`v1/posts/${postId}/file`, { data: imageId })
      const { success } = data
      
      if (!success) throw new Error('게시물이 삭제되지 않았따')

      return { success }
    } catch (err) {
      console.log(err.response)
      return { success: false }
    }
  },

  /**
   * Remove my ID from the like field of a post
   * @param {String} payload
   */
  async deleteLike({ commit }, { postId, user }) {
    try {
      const { data } = await axios.delete(`v1/posts/${postId}/like`)
      const { success } = data

      if (!success) throw new Error('게시물 좋아요가 삭제되지 않아따')

      commit('DELETE_POST_LIKE', user)
      return { success }
    } catch (err) {
      console.log(err.response)
      return { success: false }
    }
  },
}

const mutations = {
  SET_POST(state, post = {}) {
    state.post = post
  },

  SET_POSTS(state, { posts, maxPage }) {
    state.posts = posts
    state.maxPage = Number(maxPage)
  },

  SET_POST_LIKES(state, { likes, likeCount }) {
    state.likes = likes
    state.likeCount = likeCount
  },

  ADD_POST_LIKE(state, user) {
    const idx = state.likes.findIndex(likeuser => likeuser._id === user._id)

    if (idx === -1 && Array.isArray(state.likes)) {
      state.likes = state.likes.concat(user)
      state.likeCount = state.likes.length
    }
  },

  DELETE_POST_LIKE(state, user) {
    if (Array.isArray(state.likes)) {
      state.likes = state.likes.filter(likeuser => likeuser._id !== user._id)
      state.likeCount = state.likes.length
    }
  },

  SET_PAGE(state, page) {
    state.page = page
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
