import { getItem, setItem, removeItem } from '../../common/sessionStorage'
import axios from '../../services/axios'
import router from '../../router'

const state = () => ({
  user: {},
  token: '',
  isLogin: getItem('isLogin', false),
  isAdmin: '',
})

const getters = {}

const actions = {
  // param: Object (email, password)
  async login({ commit }, payload) {
    try {
      const { data } = await axios.post('v1/auth', payload)
      const { accessToken } = data.data

      if (accessToken) {
        commit('SET_TOKEN', accessToken)
        router.push({ name: 'home' })
      }
    } catch (err) {
      alert(err.response.data?.message || '로그인에 실패하였습니다.')
    }
  },

  // params: none
  async refresh({ commit }) {
    try {
      const { data } = await axios.put('v1/auth')
      commit('SET_TOKEN', data.data.accessToken)
    } catch (err) {
      return err.response.data
    }
  },

  // params: none
  async logout({ commit }) {
    try {
      await axios.delete('v1/auth')
    } catch (err) {
      return err.response.data
    } finally {
      commit('UNSET_USER')
      router.currentRoute.value.meta.requiredAuth ? router.push({ name: 'login' }) : router.go(0)
    }
  },

  // params: Object
  async createAccount({ commit }, payload) {
    try {
      const { data } = await axios.post('v1/users/account', payload)

      if (data.success) {
        await actions.login({ commit }, { email: payload.email, password: payload.password })
      }
    } catch (err) {
      alert(err.response.data?.message || '계정 생성에 실패하였습니다.')
    }
  },

  // params: none
  async getAccount({ commit }) {
    try {
      const { data } = await axios.get('v1/users/account')

      if (data.success) {
        commit('SET_USER', data.data.user)
      }
    } catch (err) {
      return err.response.data
    }
  },

  // params: Object
  async updateAccount({ commit }, payload) {
    try {
      const { data } = await axios.put('v1/users/account', payload)

      if (data.success) {
        await actions.logout({ commit })
      }
    } catch (err) {
      alert(err.response.data?.message || '계정 업데이트에 실패하였습니다.')
    }
  },

  // params: none
  async deleteAccount({ commit }) {
    try {
      const { data } = await axios.delete('v1' + '/users/account')

      if (data.success) {
        await actions.logout({ commit })
      }
    } catch (err) {
      alert(err.response.data?.message || '계정 삭제에 실패하였습니다.')
    }
  },

  // params: Object
  async getProfile({ commit }, payload) {
    try {
      const { data } = await axios.get(`v1/users/profile/${payload}`)
      return data
    } catch (err) {
      return err.response.data
    }
  },

  async updateProfile({ commit }, payload) {
    try {
      const { data } = await axios.put('v1/users/profile', payload)
      return data
    } catch (err) {
      return err.response.data
    }
  },
}

const mutations = {
  // params: Access token
  SET_TOKEN(state, token) {
    state.token = token
    state.isLogin = true
    setItem('isLogin', true)
  },

  // params: User account object
  SET_USER(state, user) {
    state.user = user
    state.isAdmin = user.roles.some((role) => role.name === 'ADMIN')
  },

  // Reset user state
  UNSET_USER(state) {
    state.user = {}
    state.token = ''
    removeItem('isLogin')
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
