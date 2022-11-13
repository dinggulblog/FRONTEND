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
      commit('SET_DRAFT', data.data.draft)
      return data
    } catch (err) {
      return err.response.data
    }
  },

  // params: X
  async createDraft({ commit }) {
    try {
      const { data } = await axios.post('v1/drafts')
      commit('SET_DRAFT', data.data.draft)
      return data
    } catch (err) {
      return err.response.data
    }
  },

  // params: Object (draft)
  async updateDraft({ commit }, { draftId, payload }) {
    try {
      const { data } = await axios.put(`v1/drafts/${draftId}`, payload, {
        onUploadProgress: (progressEvent) => {
          let percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          commit('loding/SET_PERCENTAGE', percentage, { root: true })
        },
      })
      commit('SET_DRAFT', data.data.draft)
      return data
    } catch (err) {
      return err.response.data
    }
  },

  // params: String (draft ID)
  async deleteDraft({ commit }, payload) {
    try {
      const { data } = await axios.delete(`v1/drafts/${payload}`)
      return data
    } catch (err) {
      return err.response.data
    }
  },

  async deleteFile({ commit }, { draftId, imageId }) {
    try {
      console.log('draftId: ', draftId)
      console.log('imageId: ', imageId)
      const { data } = await axios.delete(`v1/drafts/${draftId}/file`, { data: { image: imageId } })
      commit('DELETE_DRAFT_FILE', imageId)
      return data
    } catch (err) {
      return err.response.data
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
