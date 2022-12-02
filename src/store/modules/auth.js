import { getItem, setItem, removeItem } from '../../common/sessionStorage'
import axios from '../../services/axios'
import router from '../../router'

const state = () => ({
  user: getItem('user', {}),
  token: '',
  isAdmin: '',
  isLogin: getItem('isLogin', false),
})

const getters = {}

const actions = {
  // param: Object (email, password)
  async login({ commit }, payload) {
    try {
      const { data } = await axios.post('v1/auth', payload)
      const { success, data: { accessToken } } = data

      if (!success || !accessToken) throw new Error('로그인에 실패하였습니다.')

      commit('SET_TOKEN', accessToken)
      router.push({ name: 'home' })
    } catch (err) {
      alert(err?.response?.data?.message || err?.message)
    }
  },

  // params: none
  async refresh({ commit }) {
    try {
      const { data } = await axios.put('v1/auth')
      const { success, data: { accessToken } } = data

      if (!success || !accessToken) throw new Error('로그인 갱신에 실패하였습니다.')

      commit('SET_TOKEN', accessToken)
    } catch (err) {
      return err?.response?.data?.message || err?.message
    }
  },

  // params: none
  async logout({ commit }) {
    try {
      await axios.delete('v1/auth')
    } catch (err) {
      return err?.response?.data?.message || err?.message
    } finally {
      commit('UNSET_USER')
      router.currentRoute.value.meta.requiredAuth ? router.push({ name: 'login' }) : router.go(0)
    }
  },

  // params: Object
  async createAccount({ commit }, payload) {
    try {
      const { data } = await axios.post('v1/users/account', payload)
      const { success } = data

      if (!success) throw new Error('계정 생성에 실패하였습니다.')

      await actions.login({ commit }, { email: payload.email, password: payload.password })
    } catch (err) {
      alert(err?.response?.data?.message || err?.message)
    }
  },

  // params: none
  async getAccount({ commit }) {
    try {
      const { data } = await axios.get('v1/users/account')
      const { success, data: { user } } = data

      if (!success) throw new Error('계정 받아오기에 실패하였습니다.')

      commit('SET_USER', user)
    } catch (err) {
      return err?.response?.data?.message || err?.message
    }
  },

  // params: Object
  async updateAccount({ commit }, payload) {
    try {
      const { data } = await axios.put('v1/users/account', payload)
      const { success } = data

      if (!success) throw new Error('계정 업데이트에 실패하였습니다.')

      await actions.logout({ commit })
    } catch (err) {
      alert(err?.response?.data?.message || err?.message)
    }
  },

  // params: none
  async deleteAccount({ commit }) {
    try {
      const { data } = await axios.delete('v1' + '/users/account')
      const { success } = data

      if (!success) throw new Error('계정 삭제에 실패하였습니다.')

      await actions.logout({ commit })
    } catch (err) {
      alert(err?.response?.data?.message || err?.message)
    }
  },

  // params: Object
  async getProfile({ commit }, { nickname }) {
    try {
      const { data } = await axios.get(`v1/users/profile/${nickname}`)
      const { success, data: { profile } } = data
    
      if (!success || !profile) throw new Error('프로필을 받아오는데 실패하였습니다.')

      return { success, profile }
    } catch (err) {
      return err?.response?.data?.message || err?.message
    }
  },

  async updateProfile({ commit }, { nickname, payload }) {
    try {
      const { data } = await axios.put(`v1/users/profile/${nickname}`, payload)
      const { success, data: { profile } } = data
      
      if (!success) throw new Error('프로필 업데이트에 실패하였습니다.')

      return { success, profile }
    } catch (err) {
      alert(err?.response?.data?.message || err?.message) 
    }
  },

  async updateProfileAvatar({ commit }, { nickname, payload }) {
    try {
      const { data } = await axios.put(`v1/users/profile/${nickname}/avatar`, payload)
      const { success, data: { profile } } = data
      
      if (!success) throw new Error('프로필 아바타 업로드를 실패하였습니다.')

      return { success, profile }
    } catch (err) {
      alert(err?.response?.data?.message || err?.message) 
    }
  },

  async deleteProfileAvatar({ commit }, { nickname }) {
    try {
      const { data } = await axios.delete(`v1/users/profile/${nickname}/avatar`)
      const { success, data: { profile } } = data
      
      if (!success) throw new Error('프로필 아바타 업로드를 실패하였습니다.')

      return { success, profile }
    } catch (err) {
      alert(err?.response?.data?.message || err?.message) 
    }
  }
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
    setItem('user', user)
    state.isAdmin = user.roles.some((role) => role.name === 'ADMIN')
  },

  // Reset user state
  UNSET_USER(state) {
    state.user = {}
    state.token = ''
    removeItem('user')
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
