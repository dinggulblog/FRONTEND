import axios from '../../services/axios'

const state = () => ({
  post: {},
  posts: [],
})

const getters = {}

const actions = {
  // params: String (post ID)
  async getPost({ commit }, payload) {
    try {
      const {
        status,
        data: { data },
      } = await axios.get(`${process.env.VUE_APP_API_URL}posts/${payload}`)
      commit('SET_POST', data.post)
      return status
    } catch (err) {
      console.log(err.message)
    }
  },

  // params: none
  async getPosts({ commit }, payload) {
    try {
      const { data } = await axios.get(process.env.VUE_APP_API_URL + 'posts', { params: payload })
      console.log(data.data.posts)
      commit('SET_POSTS', data.data.posts)
    } catch (err) {
      console.log(err.message)
    }
  },

  // params: Object (category, subject, content, tag)
  async createPost({ commit }, payload) {
    try {
      const { status, data } = await axios.post(process.env.VUE_APP_API_URL + 'posts', payload)
      commit('UPDATE_POSTS', { action: 'create', data: data.data })
      return status
    } catch (err) {
      console.log(err.message)
    }
  },

  // params: Object (category, subject, content, tag)
  async editPost({ commit }, payload) {
    try {
      const response = await axios.put(`${process.env.VUE_APP_API_URL}/${payload._id}`, payload)
      commit('UPDATE_POSTS', { action: 'update', data: response.data.post })
      return response.status
    } catch (err) {
      console.log(err.message)
    }
  },

  // params: String (postId)
  async deletePost({ commit }, payload) {
    try {
      const response = await axios.delete(`${process.env.VUE_APP_API_URL}/${payload}`)
      commit('UPDATE_POSTS', { action: 'delete', data: response.data.post })
      return response.status
    } catch (err) {
      console.log(err.message)
    }
  },

  // params: Object
  /*
  async fileUpload({ commit }, payload) {
    try {
      const response = await axios.post(process.env.VUE_APP_API_URL + 'file', payload)
      return response.status
    } catch (err) {
      console.log(err.message)
    }
  },

  */
}

const mutations = {
  SET_POST(state, data) {
    state.post = data
  },

  SET_POST_TITLE(state, title) {
    state.post.title = title
  },

  SET_POST_CONTENT(state, content) {
    state.post.content = content
  },

  SET_POST_TAGS(state, tags) {
    state.post.tags = tags
  },

  SET_POST_STATE(state, obj) {
    state.post.menu = obj.menu
    state.post.sub = obj.sub
    state.post.category = obj.category
    state.post.isPrivate = obj.isPrivate ? true : false
  },

  UPDATE_POST_TAGS(state, tag) {
    tag = tag.replace(/,/g, '').trim()
    if (tag) {
      state.post.tags.push(tag)
    }
  },

  REMOVE_POST_TAG(state, index) {
    state.post.tags.splice(index, 1)
  },

  SET_POSTS(state, data) {
    state.posts = data
    state.posts.forEach((post, idx) => (post.idx = idx))
  },

  RESET_POSTS(state) {
    state.posts.length = 0
    state.posts = []
  },

  UPDATE_POSTS(state, { action, post }) {
    const newPosts = [...state.posts]

    if (!post) {
      return
    }

    if (action === 'create') {
      post.idx = newPosts.length
      newPosts.push(post)
    } else if (action === 'update') {
      newPosts[post.idx] = post
    } else if (action === 'delete') {
      newPosts.splice(post.idx, 1)
      for (let i = post.idx; i++; i < newPosts.length - 1) {
        newPosts[i].idx -= 1
      }
    }

    state.posts = newPosts
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
