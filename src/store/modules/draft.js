import axios from '../../services/axios'

const state = () => ({
  draft: {},
})

const getters = {}

const actions = {
  async getDraft({ commit }) {
    try {
      const { data } = await axios.get('v1/drafts')
      const { success, data: { draft } } = data

      commit('SET_DRAFT', draft)
      
      return { success, draft, error: null }
    } catch (err) {
      return { success: false, draft: null, error: err?.response?.data?.message ?? err.message }
    }
  },

  async createDraft({ commit }, payload) {
    try {
      const { data } = await axios.post('v1/drafts', payload)
      const { success, data: { draft, images } } = data

      commit('SET_DRAFT', draft)

      return { success, draft, images, error: null }
    } catch (err) {
      return { success: false, draft: null, images: null, error: err?.response?.data?.message ?? err.message }
    }
  },

  // params: Object (draft)
  async updateDraft({ commit }, { draftId, payload }) {
    try {
      const { data } = await axios.put(`v1/drafts/${draftId}`, payload)
      const { success, data: { draft, images } } = data

      commit('SET_DRAFT', draft)

      return { success, draft, images, error: null }
    } catch (err) {
      return { success: false, draft: null, images: null, error: err?.response?.data?.message ?? err.message }
    }
  },

  // params: String (draft ID)
  async deleteDraft({ commit }, payload) {
    try {
      const { data: { success } } = await axios.delete(`v1/drafts/${payload}`)
      
      return { success, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message ?? err.message }
    }
  },

  async deleteFile({ commit }, { draftId, imageId }) {
    try {
      const { data: { success } } = await axios.delete(`v1/drafts/${draftId}/file`, { data: { image: imageId } })

      return { success, error: null }
    } catch (err) {
      return { success: false, error: '파일 삭제를 실패하였습니다.' }
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
