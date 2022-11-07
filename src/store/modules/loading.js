const state = () => ({
  isLoading: false,
  message: '',
})

const mutations = {
  SET_LOADING(state, { isLoading, message }) {
    state.isLoading = isLoading
    state.message = message
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}
