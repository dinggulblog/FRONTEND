import { setItem, getItem, setItemWithTTL, getItemWithTTL, clearStorage } from '../../common/localStorage'
import axios from '../../services/axios'
import router from '../../router'

const state = () => ({
  id: null,
  user: getItem('user', {}),
  profile: {},
  isLogin: getItemWithTTL('isLogin', false),
  isAdmin: false,
  member: '',
  members: '',
})

const getters = {}

const actions = {
  // param: Object (email, password)
  async login({ commit }, payload) {
    try {
      const { data: { success } } = await axios.post('v1/auth', payload)

      if (!success) throw new Error('로그인에 실패하였습니다.')

      commit('SET_LOGIN')

      return await actions.getAccount({ commit })
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message }
    }
  },

  // params: none
  async refresh({ commit }) {
    try {
      const { data: { success } } = await axios.put('v1/auth')

      if (!success) throw new Error('로그인 갱신에 실패하였습니다.')

      commit('SET_LOGIN')

      return { success, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err.message }
    }
  },

  // params: none
  async logout({ commit }) {
    try {
      const { data: { success } } = await axios.delete('v1/auth')
      return { success, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    } finally {
      commit('UNSET_USER')
      router.currentRoute.value.meta.requiredAuth ? router.push({ name: 'home' }) : router.go(0)
    }
  },

  // params: Object
  async createAccount({ commit }, payload) {
    try {
      const { data: { success } } = await axios.post('v1/users/account', payload)

      if (!success) throw new Error('계정 생성에 실패하였습니다.')

      return await actions.login({ commit }, { email: payload.email, password: payload.password })
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },

  // params: none
  async getAccount({ commit }) {
    try {
      const { data } = await axios.get('v1/users/account')
      const { success, data: { user } } = data

      if (!success || !user) throw new Error('계정 정보를 받아오는 도중 에러가 발생하였습니다.\n다시 로그인 해 주세요.')

      commit('SET_USER', user)

      return { success, error: null }
    } catch (err) {
      commit('UNSET_USER')
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },

  async getMembers({ commit }) {
    try {
      const { data } = await axios.get('v1/users/accounts')
      const { success, data: { users } } = data

      if (!success || !users) throw new Error('멤버 정보를 받아오는 도중 에러가 발생하였습니다')

      return { success, users, error: null }
    } catch (err) {
      return { success: false, users: [], error: err?.response?.data?.message || err?.message }
    }
  },
  

  // params: Object
  async updateAccount({ commit }, payload) {
    try {
      const { data: { success } } = await axios.put('v1/users/account', payload)

      if (!success) throw new Error('계정 업데이트에 실패하였습니다.')

      return await actions.getAccount({ commit })
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },

  async updateMember({ commit }, payload) {
    try {
      console.log('페이로드 값은?', payload)
      const { data: { success } } = await axios.put('v1/users/account/', payload)

      if (!success) throw new Error('계정 업데이트에 실패하였습니다.')
      commit('UNSET_MEMBER')

      return { success, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },

  // params: none
  async deleteAccount({ commit }) {
    try {
      const { data: { success } } = await axios.delete('v1/users/account')

      if (!success) throw new Error('계정 삭제에 실패하였습니다.')

      alert('계정 삭제가 진행됩니다.\n계정 및 계정과 관련된 데이터는 14일 후에 완전히 사라집니다.')

      await actions.logout({ commit })
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },

  // params: Object
  async getProfile({ commit }, { nickname }) {
    try {
      const { data } = await axios.get(`v1/users/profile/${nickname}`)
      const { success, data: { profile } } = data

      if (!success || !profile) throw new Error('프로필을 받아오는 도중 에러가 발생하였습니다.')

      return { success, profile, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },

  async updateProfile({ commit }, { nickname, payload }) {
    try {
      const { data } = await axios.put(`v1/users/profile/${nickname}`, payload)
      const { success, data: { profile } } = data

      if (!success || !profile) throw new Error('프로필 업데이트에 실패하였습니다.')

      commit('SET_PROFILE_INTRO', profile)

      return { success, profile, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },

  async updateProfileAvatar({ commit }, { nickname, payload }) {
    try {
      const { data } = await axios.put(`v1/users/profile/${nickname}/avatar`, payload)
      const { success, data: { profile } } = data

      if (!success || !profile) throw new Error('프로필 아바타 업로드를 실패하였습니다.')

      commit('SET_PROFILE_AVATAR', profile)

      return { success, profile, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },

  async deleteProfileAvatar({ commit }, { nickname }) {
    try {
      const { data } = await axios.delete(`v1/users/profile/${nickname}/avatar`)
      const { success, data: { profile } } = data

      if (!success) throw new Error('프로필 아바타 삭제에 실패하였습니다.')

      commit('SET_PROFILE_AVATAR', profile)

      return { success, profile, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },

  async createResetLink({ commit }, { email }) {
    try {
      const { data } = await axios.post(`v1/users/account/reset/${email}`)
      const { success } = data

      if (!success) throw new Error('해당 이메일이 존재하지 않습니다.')

      return { success, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },

  async updatePassword({ commit }, payload) {
    try {
      const { data } = await axios.put(`v1/users/account/reset`, payload)
      const { success } = data

      if (!success) throw new Error('비밀번호 재설정 링크가 만료되었습니다.')
      
      return { success, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },
}

const mutations = {
  SET_LOGIN(state) {
    state.isLogin = true
    setItemWithTTL('isLogin', true, 1000 * 60 * 60 * 2)
  },

  SET_USER(state, user) {
    state.id = user._id
    state.user = user
    state.isAdmin = user?.roles?.includes('ADMIN') ?? false
    setItem('user', user)
  },

  SET_PROFILE(state, profile) {
    state.id = profile._id
    state.profile = profile
    setItem('profile', state.profile)
  },

  SET_PROFILE_INTRO(state, { greetings, introduce }) {
    state.profile = { greetings, introduce, ...state.profile }
    setItem('profile', state.profile)
  },

  SET_PROFILE_AVATAR(state, { avatar }) {
    state.profile = { avatar, ...state.profile }
    setItem('profile', state.profile)
  },

  UNSET_USER(state) {
    state.id = null
    state.user = {}
    clearStorage()
  },

  SET_MEMBER(state, member) {
    state.member = member
  },

  UNSET_MEMBER(state) {
    state.member = null
  },

  SET_MEMBERS(state, members) {
    state.members = members
  },

  SET_ACTIVE_MEMBER(state, idx) {
      state.members.at(idx).isActive = true
  },

  SET_BLOCK_MEMBER(state, idx) {
      state.members.at(idx).isActive = false
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
