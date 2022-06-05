import axios from 'axios'

const state = () => ({
  user: {},
  status: sessionStorage.getItem('user') ? { loggedIn: true } : { loggedIn: false },
})

const getters = {}

const actions = {
  // @param: Object (userId, password)
  async login({ commit }, payload) {
    try {
      // response.data = { user: { userId, name, email, roles }, token: { accessToken, refreshToken } }
      const {
        data: { data },
      } = await axios.post(process.env.VUE_APP_API_URL + 'auth', payload)
      commit('setUserStorage', data)
      commit('setLoginStatus', true)
      return data
    } catch (err) {
      console.log(err.message)
      commit('setLoginStatus', false)
    }
  },

  // params: none
  logout({ commit }) {
    sessionStorage.clear()
    commit('unsetUser')
  },

  /* params: Object (userId, password, name, email)
   * return: call actions.login
   *         none (when failed)
   */
  async signUp({ commit }, payload) {
    try {
      const { status } = await axios.post(process.env.VUE_APP_API_URL + 'users', payload, {
        headers: { Authorization: process.env.VUE_APP_SECRET_KEY.toString().trim() },
      })
      if (status === 200) await actions.login({ commit }, { email: payload.email, password: payload.password })
    } catch (err) {
      console.error('Sign-up', err)
    }
  },

  async getUserInfo({ commit }, payload) {
    try {
      const { data } = await axios.get(process.env.VUE_APP_API_URL + 'users', { data: payload })
      commit('setUser', data)
      return data
    } catch (err) {
      console.log(err)
    }
  },

  /* params: Object (userId, password, name, email)
   * return: call action.logout
   *       : none
   */
  async editAccount({ commit }, payload) {
    try {
      const response = await axios.put(process.env.VUE_APP_API_URL, payload)
      if (response.status === 200) return actions.logout({ commit })
    } catch (err) {
      console.log(err.message)
    }
  },

  /* params: String (userId)
   * return: call action.logout
   *       : none
   */
  async deleteAccount({ commit }, payload) {
    try {
      const response = await axios.delete(process.env.VUE_APP_API_URL, { data: payload })
      if (response.status === 200) return actions.logout({ commit })
    } catch (err) {
      console.log(err.message)
    }
  },

  /* params: none
   * return: none
   *         call action.logout
   */
  async reload({ commit }) {
    try {
      const config = { headers: { 'x-refresh-token': sessionStorage.getItem('refresh_token') } }
      const response = await axios.get(process.env.VUE_APP_API_URL + 'token', config)
      commit('setToken', response.data.token)
    } catch (err) {
      console.log(err.message)
      actions.logout({ commit })
    }
  },
}

const mutations = {
  setUserStorage(state, data) {
    sessionStorage.setItem('nickname', data.nickname)
    sessionStorage.setItem('access_token', data.token)
  },

  /* Set login status true or false
   * @param: Boolean
   */
  setLoginStatus(state, value) {
    state.status.loggedIn = value
  },

  /* Set new user data in state
   * @param: Object (userId, name, email, roles)
   */
  setUser(state, data) {
    state.user = {
      userId: data.userId,
      name: data.name,
      email: data.email,
      roles: data.roles,
    }
  },

  /* Reset user state */
  unsetUser(state) {
    state.user = {}
    state.status.loggedIn = false
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
