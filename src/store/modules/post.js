import { stringify } from 'querystring'
import axios from '../../services/axios'

const state = () => ({
  temp: {},
  post: {},
  posts: [],
})

const getters = {
  getPostWithNum: (state) => (postNum) => {
    return state.posts.find((post) => String(post.postNum) === String(postNum)) ?? {}
  }
}

const actions = {
  // params: String (post ID)
  async getPost({ commit }, payload) {
    try {
      const { data } = await axios.get(`${process.env.VUE_APP_API_URL}posts/post`, { params: payload })
      commit('SET_POST', data.data.post)
      commit('comment/SET_COMMENTS', data.data.comments, { root: true })
      return data
    } catch (err) {
      return err.response.data
    }
  },
  
  // params: Object (subjects & pagenation options)
  async getPosts({ commit }, payload) {
    try {
      const { data } = await axios.get(`${process.env.VUE_APP_API_URL}posts`, { params: payload, paramsSerializer: (params) => stringify(params) })
      commit('SET_POSTS', data.data.posts)
      return data
    } catch (err) {
      return err.response.data
    }
  },

  // params: Object (post)
  async createPost({ commit }, payload) {
    try {
      const { data } = await axios.post(`${process.env.VUE_APP_API_URL}posts`, payload)
      commit('SET_POST', data.data.post)
      return data
    } catch (err) {
      return err.response.data
    }
  },

  // params: Object (post)
  async updatePost({ commit }, payload) {
    try {
      const { data } = await axios.put(`${process.env.VUE_APP_API_URL}posts/${payload._id}`, payload)
      commit('SET_POST', data.data.post)
      return data
    } catch (err) {
      return err.response.data
    }
  },

  // params: String (post ID)
  async updateLike({ commit }, payload) {
    try {
      const { data } = await axios.put(`${process.env.VUE_APP_API_URL}posts/like/${payload}`)
      commit('SET_POST_LIKE', data.data.post)
      return data
    } catch (err) {
      return err.response.data
    }
  },

  // params: String (post ID)
  async deletePost({ commit }, payload) {
    try {
      const { data } = await axios.delete(`${process.env.VUE_APP_API_URL}posts/${payload}`)
      return data
    } catch (err) {
      return err.response.data
    }
  },

   // params: String (post ID)
  async deleteLike({ commit }, payload) {
    try {
      const { data } = await axios.delete(`${process.env.VUE_APP_API_URL}posts/like/${payload}`)
      commit('SET_POST_LIKE', data.data.post)
      return data
    } catch (err) {
      return err.response.data
    }
  }
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
