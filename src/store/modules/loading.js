const state = () => ({
  isLoading: false,
  loadingMessage: '',
})

const mutations = {
  SET_LOADING(state, loading, message) {
    state.isLoading = loading
    state.isLoading = message
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}
