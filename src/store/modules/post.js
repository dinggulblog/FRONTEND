import { stringify } from 'querystring'
import axios from '../../services/axios'
import router from '../../router'

const state = () => ({
  post: {},
  posts: [],
  likes: [],
  likeCount: 0,
  category: '전체',
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
      const {
        success,
        data: { post, likes, likeCount, comments },
      } = data

      if (!success || !post) {
        throw new Error('포스트가 업서요!')
      }

      commit('SET_POST', post)
      commit('SET_POST_LIKES', { likes, likeCount })
      commit('comment/SET_COMMENTS', comments, { root: true })

      return { success, post }
    } catch (err) {
      console.log(err.response?.data)
      return { success: false }
    }
  },

  /**
   * Get posts with pagenation query object
   * @param {Object} payload { menu, page, limit, ... }
   */
  async getPosts({ commit }, payload) {
    try {
      const { data } = await axios.get('v1/posts', { params: payload, paramsSerializer: (params) => stringify(params) })
      const { posts, maxPage } = data.data
      commit('SET_POSTS', { posts, maxPage })
    } catch (err) {
      console.log(err.response?.data)
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
      const {
        success,
        data: { post },
      } = data

      if (success) {
        commit('SET_POST', post)
        router.push({ name: 'post', query: { id: post._id } })
      }

      return { success }
    } catch (err) {
      console.log(err.response?.data)
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
      const {
        success,
        data: { post },
      } = data

      if (success) {
        commit('SET_POST', post)
      }

      return { success, post }
    } catch (err) {
      console.log(err.response?.data)
      return { success: false }
    }
  },

  /**
   * Add my ID from the like field of a post
   * @param {String} payload Post ID
   */
  async updateLike({ commit }, payload) {
    try {
      const { data } = await axios.put(`v1/posts/${payload}/like`)
      const { likes, likeCount } = data.data
      commit('SET_POST_LIKES', { likes, likeCount })
    } catch (err) {
      console.log(err.response?.data)
      return { success: false }
    }
  },

  /**
   * Delete a post with post ID
   * @param {String} payload Post ID
   */
  async deletePost({ commit }, payload) {
    try {
      await axios.delete(`v1/posts/${payload}`)
      router.push({
        name: 'posts',
        params: { main: router.currentRoute.value.params.main, sub: router.currentRoute.value.params?.sub },
      })
    } catch (err) {
      console.log(err.response?.data)
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
      return data
    } catch (err) {
      console.log(err.response?.data)
      return { success: false }
    }
  },

  /**
   * Remove my ID from the like field of a post
   * @param {String} payload
   */
  async deleteLike({ commit }, payload) {
    try {
      const { data } = await axios.delete(`v1/posts/${payload}/like`)
      const { likes, likeCount } = data.data
      commit('SET_POST_LIKES', { likes, likeCount })
    } catch (err) {
      console.log(err.response?.data)
      return { success: false }
    }
  },
}

const mutations = {
  SET_POST(state, post) {
    state.post = post
  },

  SET_POSTS(state, { posts, maxPage }) {
    state.posts = [...posts]
    state.maxPage = Number(maxPage)
  },

  SET_POST_LIKES(state, { likes, likeCount }) {
    state.likes = likes
    state.likeCount = likeCount
  },

  SET_PAGE(state, page) {
    state.page = page
  },

  SET_CATEGORY(state, category) {
    state.category = category
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
