import axios from '../../services/axios'

const state = () => ({
  draft: {},
})

const getters = {}

const actions = {
  // params: X
  async getDraft({ commit }) {
    try {
      const { data } = await axios.get('v1/drafts')
      const { success, data: { draft } } = data

      commit('SET_DRAFT', draft)
      
      return { success, draft }
    } catch (err) {
      return { success: false, error: '임시 저장 게시물을 불러오는데 실패하였습니다.' }
    }
  },

  async createDraft({ commit }, payload) {
    try {
      const { data } = await axios.post('v1/drafts', payload)
      const { success, data: { draft, images } } = data

      commit('SET_DRAFT', draft)

      return { success, draft, images }
    } catch (err) {
      return { success: false, draft: null, images: null, error: '임시 저장에 실패하였습니다.' }
    }
  },

  // params: Object (draft)
  async updateDraft({ commit }, { draftId, payload }) {
    try {
      const { data } = await axios.put(`v1/drafts/${draftId}`, payload)
      const { success, data: { draft, images } } = data

      commit('SET_DRAFT', draft)

      return { success, draft, images }
    } catch (err) {
      return { success: false, draft: null, images: null, error: '임시 저장에 실패하였습니다.' }
    }
  },

  // params: String (draft ID)
  async deleteDraft({ commit }, payload) {
    try {
      const { data } = await axios.delete(`v1/drafts/${payload}`)
      
      return data
    } catch (err) {
      console.log(err.response?.data)
      return { success: false }
    }
  },

  async deleteFile({ commit }, { draftId, imageId }) {
    try {
      const { data } = await axios.delete(`v1/drafts/${draftId}/file`, { data: { image: imageId } })
      const { success } = data

      if (!success) throw new Error('Draft file이 정상적으로 삭제되지 않았습니다.')

      return { success }
    } catch (err) {
      console.log(err.response?.data)
      return { success: false }
    }
  },
}

const mutations = {
  SET_DRAFT(state, draft) {
    state.draft = draft
  },

  DELETE_DRAFT_FILE(state, imageId) {
    const index = [...state.draft.images].findIndex((image) => image._id === imageId)
    if (index !== -1) {
      state.draft.images.splice(index, 1)
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
