import jwt from 'jsonwebtoken'
import axios from '../../services/axios'

const dummy = {
  _id: jwt.decode(sessionStorage.getItem('accessToken'))?._id,
  nickname: jwt.decode(sessionStorage.getItem('accessToken'))?.nickname,
  accessToken: sessionStorage.getItem('accessToken'),
}

const state = () => ({
  user: jwt.decode(sessionStorage.getItem('accessToken')) || {},
})

const getters = {}

const actions = {
  // @param: Object (email, password)
  async login({ commit }, payload) {
    try {
      const { status, data } = await axios.post(process.env.VUE_APP_API_URL + 'auth', payload)
      commit('setUserToken', data.data.accessToken)
      return status
    } catch (err) {
      return false
    }
  },

  // params: none
  logout({ commit }) {
    commit('unsetUser')
  },

  /* params: Object (userId, password, name, email)
   * return: call actions.login
   *         none (when failed)
   */
  async signUp({ commit }, payload) {
    try {
      const { status } = await axios.post(process.env.VUE_APP_API_URL + 'users', payload)
      if (status === 200) return await actions.login({ commit }, { email: payload.email, password: payload.password })
    } catch (err) {
      console.error('Sign-up', err)
    }
  },

  async getUserInfo({ commit }, payload) {
    try {
      const {
        data: { data },
      } = await axios.get(process.env.VUE_APP_API_URL + 'users/' + payload)

      if (!data) {
        throw new Error('Cannot get user information')
      }

      commit('setUser', data)
    } catch (err) {
      console.log('Get user', err)
    }
  },

  /* params: Object (userId, password, name, email)
   * return: call action.logout
   *       : none
   */
  async editAccount({ commit }, payload) {
    try {
      return await axios.put(process.env.VUE_APP_API_URL + 'users/' + sessionStorage.getItem('nickname'), payload)
    } catch (err) {
      console.log('Edit user', err)
    }
  },

  /* params: String (userId)
   * return: call action.logout
   *       : none
   */
  async deleteAccount({ commit }, payload) {
    try {
      return await axios.delete(process.env.VUE_APP_API_URL + 'users/' + sessionStorage.getItem('nickname'))
    } catch (err) {
      console.log(err.message)
    }
  },
}

const mutations = {
  // Add access token property in User state
  setUserToken(state, token) {
    state.user = jwt.decode(token)
    state.user.accessToken = token

    sessionStorage.setItem('accessToken', token)
  },

  /* Set new user data in state
   * @param: Object (email, nickname, ...etc)
   */
  setUser(state, data) {
    state.user = {
      email: data.email,
      nickname: data.nickname,
      roles: data.roles,
      isActive: data.isActive,
      createdAt: data.createdAt,
    }
  },

  /* Reset user state */
  unsetUser(state) {
    state.user = {}
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
