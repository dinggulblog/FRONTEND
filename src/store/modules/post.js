import { stringify } from 'querystring'
import axios from '../../services/axios'

const state = () => ({
  post: null,
  posts: null,
  page: 1,
  maxPage: 1,
  quickMove: false
})

const getters = {}

const actions = {
  /**
   * Get post with Post ID
   * @param {Object} postId Post ID
   * @return {Object} { success, post, error }
   */
  async getPost({ commit }, { postId }) {
    try {
      if (!postId) throw new Error('게시물을 찾을 수 없습니다.')

      const { data } = await axios.get(`v1/posts/${postId}`)
      const {
        success,
        data: { post },
      } = data

      if (!post?.isActive) throw new Error('비활성화된 게시물입니다.')

      commit('SET_POST', post)

      return { success, post, error: null }
    } catch (err) {
      return { success: false, post: null, error: err?.response?.data?.message ?? err.message }
    }
  },

  /**
   * Get posts with pagenation query object
   * @param {Object} payload { menu, skip, limit, category, hasThumbnail }
   * @return {Object} { success, posts, maxPage, error }
   */
  async getPosts({ rootState, commit }, payload) {
    try {
      const { data } = await axios.get('v1/posts', {
        params: payload,
        paramsSerializer: (params) => stringify(params),
      })

      const {
        success,
        data: { posts, maxCount },
      } = data

      return { success, posts, maxCount, error: null }
    } catch (err) {
      return { success: false, posts: [], maxCount: null, error: err?.response?.data?.message || err.message }
    }
  },

  /**
   * Create a post with post object
   * @param {Object} Post { title, content, menu, ... }
   * @return {Object} { success, post, error }
   */
  async createPost({ rootState }, payload) {
    try {
      if (!rootState.auth.isLogin) throw new Error('로그인 후 사용 가능합니다.')

      const { data } = await axios.post('v1/posts', payload)
      const {
        success,
        data: { post },
      } = data

      return { success, post, error: null }
    } catch (err) {
      return { success: false, post: null, error: err?.response?.data?.message || err.message }
    }
  },

  /**
   * Update a post with post object
   * @param {Object} Post { _id, title, content, menu, ... }
   * @return {Object} { success, post, images, error }
   */
  async updatePost({ rootState }, { postId, authorId, payload }) {
    try {
      if (!postId) throw new Error('게시물을 찾을 수 없습니다.')
      if (!rootState.auth.isLogin) throw new Error('로그인 후 사용 가능합니다.')
      if (rootState.auth.id !== authorId) throw new Error('본인 소유의 게시물만 삭제가 가능합니다.')

      const { data } = await axios.put(`v1/posts/${postId}`, payload)
      const {
        success,
        data: { post, images },
      } = data

      return { success, post, images, error: null }
    } catch (err) {
      return { success: false, post: null, images: null, error: err?.response?.data?.message || err.message }
    }
  },

  /**
   * Add my ID from the like field of a post
   * @param {String} payload Post ID
   * @return {Object} { success, error }
   */
  async updateLike({ rootState, commit }, { postId }) {
    try {
      if (!postId) throw new Error('게시물을 찾을 수 없습니다.')
      if (!rootState.auth.isLogin) throw new Error('로그인 후 사용 가능합니다.')

      const {
        data: { success },
      } = await axios.put(`v1/posts/${postId}/like`)

      commit('ADD_POST_LIKE')

      return { success, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message }
    }
  },

  /**
   * Delete a post with post ID
   * @param {String} payload Post ID
   * @return {Object} { success, error }
   */
  async deletePost({ rootState, commit }, { postId, authorId }) {
    try {
      if (!postId) throw new Error('게시물을 찾을 수 없습니다.')
      if (!rootState.auth.isLogin) throw new Error('로그인 후 사용 가능합니다.')
      if (rootState.auth.id !== authorId) throw new Error('본인 소유의 게시물만 삭제가 가능합니다.')

      const {
        data: { success },
      } = await axios.delete(`v1/posts/${postId}`)

      commit('SET_POST', null)

      return { success, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message }
    }
  },

  /**
   * Delete a file from the post
   * @param {String} postId
   * @param {String} imageId
   * @return {Object} { success, error }
   */
  async deleteFile({ rootState }, { postId, imageId }) {
    try {
      if (!postId) throw new Error('게시물을 찾을 수 없습니다.')
      if (!rootState.auth.isLogin) throw new Error('로그인 후 사용 가능합니다.')

      const {
        data: { success },
      } = await axios.delete(`v1/posts/${postId}/file`, { data: { image: imageId } })

      return { success, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message }
    }
  },

  /**
   * Remove my ID from the like field of a post
   * @param {String} payload
   * @return {Object} { success, error }
   */
  async deleteLike({ rootState, commit }, { postId }) {
    try {
      if (!postId) throw new Error('게시물을 찾을 수 없습니다.')
      if (!rootState.auth.isLogin) throw new Error('로그인 후 사용 가능합니다.')

      const {
        data: { success },
      } = await axios.delete(`v1/posts/${postId}/like`)

      commit('DELETE_POST_LIKE')

      return { success, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message }
    }
  },
}

const mutations = {
  SET_PAGE(state, page = 1) {
    state.page = page
  },

  SET_MAXPAGE(state, maxPage = 1) {
    state.maxPage = maxPage
  },

  SET_POST(state, post = {}) {
    state.post = post
  },

  SET_POSTS(state, posts = []) {
    state.posts = posts
  },

  SET_QUICKMOVE(state, boolean = false) {
    state.quickMove = boolean
  },

  ADD_POST_LIKE(state) {
    if (typeof state.post === 'object') {
      state.post.liked = true
      state.post.likeCount = parseInt(state.post.likeCount, 10) + 1
    }
  },

  DELETE_POST_LIKE(state) {
    if (typeof state.post === 'object') {
      state.post.liked = false
      state.post.likeCount = parseInt(state.post.likeCount, 10) - 1
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
