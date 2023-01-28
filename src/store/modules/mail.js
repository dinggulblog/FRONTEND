import axios from '../../services/axios'

const state = () => ({})

const getters = {}

const actions = {
  async createMail({ commit }, payload) {
    try {
      const { data } = await axios.post(`v1/mails`, payload)
      const { success } = data

      if (!success) throw new Error('메시지 전송에 실패하였습니다.')

      return { success }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },
}

const mutations = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
