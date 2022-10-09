import { stringify } from 'querystring'
import axios from '../../services/axios'

const state = () => ({
  post: {},
  posts: [],
})

const getters = {}

const actions = {
  /**
   * @param {String} payload
   */
  async getPost({ commit }, payload) {
    try {
      const { data } = await axios.get(`${process.env.VUE_APP_API_URL}posts/${payload}`)
      commit('SET_POST', data.data.post)
      commit('comment/SET_COMMENTS', data.data.comments, { root: true })
      return data
    } catch (err) {
      return err.response.data
    }
  },

  /**
   * subjects & pagenation options
   * @param {Object} payload
   */
  async getPosts({ commit }, payload) {
    try {
      const { data } = await axios.get(`${process.env.VUE_APP_API_URL}posts`, { params: payload, paramsSerializer: (params) => stringify(params) })
      commit('SET_POSTS', data.data.posts)
      return data
    } catch (err) {
      return err.response.data
    }
  },

  /**
   * post
   * @param {Object} payload
   */
  async createPost({ commit }, payload) {
    try {
      const { data } = await axios.post(`${process.env.VUE_APP_API_URL}posts`, payload)
      commit('SET_POST', data.data.post)
      console.log(data)
      return data
    } catch (err) {
      return err.response.data
    }
  },

  /**
   * post
   * @param {Object} payload
   */
  async updatePost({ commit }, payload) {
    try {
      console.log('페이로드', payload)
      const { data } = await axios.put(`${process.env.VUE_APP_API_URL}posts/${payload._id}`, payload)
      commit('SET_POST', data.data.post)
      return data
    } catch (err) {
      return err.response.data
    }
  },

  /**
   * post ID
   * @param {String} payload
   */

  async updateLike({ commit }, payload) {
    try {
      const { data } = await axios.put(`${process.env.VUE_APP_API_URL}posts/${payload}/like`)
      commit('SET_POST_LIKE', data.data.post)
      return data
    } catch (err) {
      return err.response.data
    }
  },

  /**
   * post ID
   * @param {String} payload
   */
  async deletePost({ commit }, payload) {
    try {
      const { data } = await axios.delete(`${process.env.VUE_APP_API_URL}posts/${payload}`)
      return data
    } catch (err) {
      return err.response.data
    }
  },

  async deleteFile({ commit }, { postId, imageId }) {
    try {
      const { data } = await axios.delete(`${process.env.VUE_APP_API_URL}posts/${postId}/file`, { data: imageId })
      return data
    } catch (err) {
      return err.response.data
    }
  },

  /**
   * post ID
   * @param {String} payload
   */
  async deleteLike({ commit }, payload) {
    try {
      const { data } = await axios.delete(`${process.env.VUE_APP_API_URL}posts/${payload}/like`)
      commit('SET_POST_LIKE', data.data.post)
      return data
    } catch (err) {
      return err.response.data
    }
  },
}

const mutations = {
  SET_POST(state, post) {
    state.post = post
  },

  SET_POSTS(state, posts) {
    state.posts = posts
  },

  SET_POST_LIKE(state, post) {
    state.post.likes = post.likes
    state.post.likeCount = post.likeCount
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
