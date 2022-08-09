import jwtDecode from 'jwt-decode'
import axios from '../../services/axios'

const state = () => ({
  user: {},
  token: ''
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
      return data
    } catch (err) {
      return err.response.data
    }
  },

  // params: none
  async logout({ commit }) {
    try {
      const { data } = await axios.delete(process.env.VUE_APP_API_URL + 'auth/me')
      return data
    } catch (err) {
      return err.response.data
    } finally {
      commit('UNSET_USER')
    }
  },

  // params: Object
  async signUp({ commit }, payload) {
    try {
      await axios.post(process.env.VUE_APP_API_URL + 'users', payload)
      return await actions.login({ commit }, { email: payload.email, password: payload.password })
    } catch (err) {
      return err.response.data
    }
  },

  // params: none
  async getUserInfo({ commit }) {
    try {
      const { data } = await axios.get(process.env.VUE_APP_API_URL + 'users/me')
      commit('SET_USER_INFO', data.data.user)
      return data
    } catch (err) {
      return err.response.data
    }
  },

  // params: Object
  async editAccount({ commit }, payload) {
    try {
      await axios.put(process.env.VUE_APP_API_URL + 'users/me', payload)
      return await actions.logout({ commit })
    } catch (err) {
      return err.response.data
    }
  },

  // params: none
  async deleteAccount({ commit }) {
    try {
      await axios.delete(process.env.VUE_APP_API_URL + 'users/me')
      return await actions.logout({ commit })
    } catch (err) {
      return err.response.data
    }
  },
}

const mutations = {
  // params: Access token
  SET_USER(state, token) {
    const decoded = jwtDecode(token)
    state.token = token
    state.user = { id: decoded.sub, nickname: decoded.data.nickname, roles: decoded.data.roles }
    localStorage.setItem('user', JSON.stringify(state.user))
  },

  SET_USER_INFO(state, user) {
    state.user = user
  },

  /* Reset user state */
  UNSET_USER(state) {
    state.user = {}
    state.token = ''
    localStorage.clear()
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
