import { stringify } from 'querystring'
import axios from '../../services/axios'

const state = () => ({
  post: {},
  posts: [],
  likes: [],
  likeCount: 0,
  page: 1,
  maxPage: 1
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
      const { success, data: { post, likes, likeCount } } = data

      commit('SET_POST', post)
      commit('SET_POST_LIKES', { likes, likeCount })

      return { success, post }
    } catch (err) {
      return { success: false, error: '오류가 발생하여 게시물을 가져오지 못하였습니다.' }
    }
  },

  /**
   * Get posts with pagenation query object
   * @param {Object} payload { menu, page, limit, ... }
   */
  async getPosts({ commit }, payload) {
    try {
      const { data } = await axios.get('v1/posts', { params: payload, paramsSerializer: (params) => stringify(params) })
      const { success, data: { posts, maxPage } } = data

      commit('SET_POSTS', { posts, category: payload.category })

      return { success, posts, maxPage }
    } catch (err) {
      return { success: false, maxPage: 1, error: '오류가 발생하여 게시물들을 가져오지 못하였습니다.' }
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

      return { success, post }
    } catch (err) {
      return { success: false, error: '오류가 발생하여 게시물 저장에 실패하였습니다.' }
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

      return { success, post, images }
    } catch (err) {
      return { success: false, post: null, images: null, error: '오류가 발생하여 게시물 수정에 실패하였습니다.' }
    }
  },

  /**
   * Add my ID from the like field of a post
   * @param {String} payload Post ID
   */
  async updateLike({ commit }, { postId, userId }) {
    try {
      const { data: { success } } = await axios.put(`v1/posts/${postId}/like`)

      commit('ADD_POST_LIKE', userId)

      return { success }
    } catch (err) {
      return { success: false, error: '오류가 발생하여 좋아요 업데이트에 실패하였습니다.' }
    }
  },

  /**
   * Delete a post with post ID
   * @param {String} payload Post ID
   */
  async deletePost({ commit }, payload) {
    try {
      const { data: { success } } = await axios.delete(`v1/posts/${payload}`)

      commit('SET_POST', {})

      return { success }
    } catch (err) {
      return { success: false, error: '오류가 발생하여 게시물 삭제에 실패하였습니다.' }
    }
  },

  /**
   * Delete a file from the post
   * @param {String} postId
   * @param {String} imageId
   */
  async deleteFile({ commit }, { postId, imageId }) {
    try {
      const { data: { success } } = await axios.delete(`v1/posts/${postId}/file`, { data: imageId })
      
      return { success }
    } catch (err) {
      return { success: false, error: '오류가 발생하여 파일 삭제에 실패하였습니다.' }
    }
  },

  /**
   * Remove my ID from the like field of a post
   * @param {String} payload
   */
  async deleteLike({ commit }, { postId, userId }) {
    try {
      const { data: { success } } = await axios.delete(`v1/posts/${postId}/like`)

      commit('DELETE_POST_LIKE', userId)

      return { success }
    } catch (err) {
      return { success: false, error: '오류가 발생하여 좋아요 업데이트에 실패하였습니다.' }
    }
  },
}

const mutations = {
  SET_POST(state, post = {}) {
    state.post = post
  },

  SET_PAGE(state, page) {
    state.page = page
  },

  SET_MAXPAGE(state, maxPage) {
    state.maxPage = maxPage
  },

  SET_POSTS(state, { posts = [], category = '전체' }) {
    state.groupPosts = posts.reduce((acc, post) => {
      if (!acc[category]) acc[category] = []
      acc[category].push(post)
      return acc
    }, {})
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
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
