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

      if (!success) throw new Error('게시물들을 받아오는 데 실패하였습니다.')

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

      if (!success) throw new Error('게시물이 작성되지 않았습니다.')

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
      const { success, data: { post, images } } = data

      if (!success) throw new Error('게시물 수정에 실패하였습니다.')
      
      return { success, post, images }
    } catch (err) {
      console.log(err.response)
      return { success: false }
    }
  },

  /**
   * Add my ID from the like field of a post
   * @param {String} payload Post ID
   */
  async updateLike({ commit }, { postId, userId }) {
    try {
      const { data } = await axios.put(`v1/posts/${postId}/like`)
      const { success } = data
      
      if (!success) throw new Error('게시물 좋아요 수정에 실패하였습니다.')

      commit('ADD_POST_LIKE', userId)
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

      if (!success) throw new Error('게시물 삭제에 실패하였습니다.')

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
      
      if (!success) throw new Error('게시물 파일 삭제에 실패하였습니다.')

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
  async deleteLike({ commit }, { postId, userId }) {
    try {
      const { data } = await axios.delete(`v1/posts/${postId}/like`)
      const { success } = data

      if (!success) throw new Error('게시물 좋아요 삭제에 실패하였습니다.')

      commit('DELETE_POST_LIKE', userId)
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

  ADD_POST_LIKE(state, userId) {
    const idx = state.likes.findIndex(likedUserId => likedUserId === userId)

    if (idx === -1 && Array.isArray(state.likes)) {
      state.likes = state.likes.concat(userId)
      state.likeCount = state.likes.length
    }
  },

  DELETE_POST_LIKE(state, userId) {
    if (Array.isArray(state.likes)) {
      state.likes = state.likes.filter(likedUserId => likedUserId !== userId)
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
