import { stringify } from 'querystring'
import axios from '../../services/axios'

const state = () => ({
  post: {},
  quickMove: false,
  editPosts: [],
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
      const { success, data: { post } } = data

      if (!post?.isActive) throw new Error('비활성화된 게시물입니다.')

      commit('SET_POST', post)

      return { success, post, error: null }
    } catch (err) {
      return { success: false, post: null, error: err?.response?.data?.message ?? err.message }
    }
  },

  /**
   * Get posts with pagenation query object
   * @param {Object} payload { menu, skip, limit, category }
   * @return {Object} { success, error }
   */
  async getPosts({ rootState },{ main, sub, ...payload}) {
    try {
      if (main) {
        payload.menus = rootState.menu.menus[main].filter((menu) => !sub ? true : menu.sub === sub).map(({ _id }) => _id)
      }

      const { data } = await axios.get('v1/posts', { params: payload , paramsSerializer: (params) => stringify(params) })

      const { success, data: { posts, maxCount } } = data

      if (!success || !posts) throw new Error('네트워크 에러가 발생하였습니다. 잠시 후에 다시 시도해 주세요.')

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
  async createPost({ rootState }, { payload }) {
    try {
      if (!rootState.auth.user) throw new Error('로그인 후 사용 가능합니다.')

      const { data } = await axios.post('v1/posts', payload)
      const { success, data: { post } } = data

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
  async updatePost({ rootState }, { postId, payload }) {
    try {
      if (!postId) throw new Error('게시물을 찾을 수 없습니다.')
      if (!rootState.auth.user) throw new Error('로그인 후 사용 가능합니다.')

      const { data } = await axios.put(`v1/posts/${postId}`, payload)
      const { success, data: { post, images } } = data

      return { success, post, images, error: null }
    } catch (err) {
      return { success: false, post: null, images: [], error: err?.response?.data?.message || err.message }
    }
  },

  async updatePosts({ commit }, payload) {
    try {
      const { data: { success } } = await axios.put('v1/posts', { posts: payload })

      if (!success) throw new Error('게시물 업데이트에 실패하였습니다.')

      commit('UNSET_EDIT_POSTS')

      return await actions.getPosts({ commit })
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
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
      if (!rootState.auth.user) throw new Error('로그인 후 사용 가능합니다.')

      const { data: { success } } = await axios.put(`v1/posts/${postId}/like`)

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
      if (!rootState.auth.user) throw new Error('로그인 후 사용 가능합니다.')

      const { data: { success } } = await axios.delete(`v1/posts/${postId}`)

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
      if (!rootState.auth.user) throw new Error('로그인 후 사용 가능합니다.')

      const { data: { success } } = await axios.delete(`v1/posts/${postId}/file`, { data: { image: imageId } })

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
      if (!rootState.auth.user) throw new Error('로그인 후 사용 가능합니다.')

      const { data: { success } } = await axios.delete(`v1/posts/${postId}/like`)

      commit('DELETE_POST_LIKE')

      return { success, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message }
    }
  },
}

const mutations = {
  SET_POST(state, post = {}) {
    state.post = post
    state.category = post.category
    if (typeof post.menu === 'object') {
      state.main = post.menu.main
      state.sub = post.menu.sub
    }
  },

  SET_MAIN(state, main) {
    state.main = main
  },

  SET_SUB(state, sub) {
    state.sub = sub
  },

  SET_TITLE(state, title) {
    state.post.title = title
  },

  SET_CONTENT(state, content) {
    state.post.content = content
  },

  SET_CATEGORY(state, category) {
    state.post.category = category
  },

  SET_IS_PUBLIC(state, isPublic) {
    state.post.isPublic = isPublic
  },

  SET_IMAGES(state, images = []) {
    if (!Array.isArray(state.post.images)) state.post.images = []

    state.post.images.push(...images)
  },

  SET_THUMBNAIL(state, thumbnail) {
    state.post.thumbnail = thumbnail
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

  UNSET_IMAGE(state, index) {
    if (Array.isArray(state.post.images)) state.post.images.splice(index, 1)
  },

  UNSET_POST(state) {
    state.post = {}
    state.main = ''
    state.sub = ''
    state.category = ''
  },

  SET_EDIT_POSTS(state, post) {
    state.editPosts.push(post)
  },

  UNSET_EDIT_POSTS(state) {
    state.editPosts = []
  },

  CHANGE_EDIT_POSTS(state) {
    state.editPosts.forEach((post) => {
      post.main = state.main
      post.sub = state.sub
      post.category = state.category
    })
  },

  ACTIVE_EDIT_POSTS(state, active) {
    state.editPosts.forEach((post) => {
      post.active = active
    })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
