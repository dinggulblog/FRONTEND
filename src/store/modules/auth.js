import axios from '../../services/axios'

const state = () => ({
  user: {},
  token: '',
  isLogin: sessionStorage.getItem('loginState') ?? false,
})

const getters = {}

const actions = {
  // params: none
  async refresh({ commit }) {
    try {
      const { data } = await axios.post(process.env.VUE_APP_API_URL + 'auth/refresh')
      commit('SET_USER', data.data.accessToken)
      return data
    } catch (err) {
      return err.response.data
    }
  },

  // param: Object (email, password)
  async login({ commit }, payload) {
    try {
      const { data } = await axios.post(process.env.VUE_APP_API_URL + 'auth', payload)
      commit('SET_USER', data.data.accessToken)
      return await actions.getAccount({ commit })
    } catch (err) {
      return err.response.data
    }
  },

  // params: none
  async logout({ commit }) {
    try {
      const { data } = await axios.delete(process.env.VUE_APP_API_URL + 'auth')
      return data
    } catch (err) {
      return err.response.data
    } finally {
      commit('UNSET_USER')
    }
  },

  // params: Object
  async createAccount({ commit }, payload) {
    try {
      await axios.post(process.env.VUE_APP_API_URL + 'users/account', payload)
      return await actions.login({ commit }, { email: payload.email, password: payload.password })
    } catch (err) {
      return err.response.data
    }
  },

  // params: none
  async getAccount({ commit }) {
    try {
      const { data } = await axios.get(process.env.VUE_APP_API_URL + 'users/account')
      commit('SET_USER_INFO', data.data.user)
      return data
    } catch (err) {
      return err.response.data
    }
  },

  // params: Object
  async updateAccount({ commit }, payload) {
    try {
      await axios.put(process.env.VUE_APP_API_URL + 'users/account', payload)
      return await actions.logout({ commit })
    } catch (err) {
      return err.response.data
    }
  },

  // params: none
  async deleteAccount({ commit }) {
    try {
      await axios.delete(process.env.VUE_APP_API_URL + 'users/account')
      return await actions.logout({ commit })
    } catch (err) {
      return err.response.data
    }
  },

  // params: Object
  async getProfile({ commit }, payload) {
    try {
      const { data } = await axios.get(`${process.env.VUE_APP_API_URL}users/profile/${payload}`)
      return data
    } catch (err) {
      return err.response.data
    }
  },

  async updateProfile({ commit }, payload) {
    try {
      const { data } = await axios.put(process.env.VUE_APP_API_URL + 'users/profile', payload)
      return data
    } catch (err) {
      return err.response.data
    }
  },
}

const mutations = {
  // params: Access token
  SET_USER(state, token) {
    state.token = token
    state.isLogin = true
    sessionStorage.setItem('loginState', true)
  },

  // params: User account object
  SET_USER_INFO(state, user) {
    state.user = user
  },

  // Reset user state
  UNSET_USER(state) {
    state.user = {}
    state.token = ''
    sessionStorage.clear()
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
