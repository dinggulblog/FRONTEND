import axios from 'axios'

const state = () => ({
  menus: [],
})

const getters = {
  getMenu: (state) => (id) => {
    return Array.from(state.menus)
      .find((menu) => String(menu._id) === String(id))
  },

  getMenuIds: (state) => ({ title, subject }) => {
    return Array.from(state.menus)
      .filter((menu) => subject ? (menu.title === title && menu.subject === subject) : (menu.title === title))
      .map((filtered) => filtered._id)
  },

  getTitle: (state) => (id) => {
    return Array.from(state.menus)
      .find(menu => menu._id === id)
      ?.title
  },

  getTitles: (state) => {
    return Array.from(new Set(state.menus.map((menu) => menu.title)))
      .sort((a, b) => a.toLowerCase() < b.toLowerCase() ? 1 : -1)
  },

  getSubject: (state) => (id) => {
    return Array.from(state.menus)
      .find(menu => menu._id === id)
      ?.subject 
  },

  getSubjects: (state) => (title) => {
    return Array.from(state.menus)
      .filter((menu) => menu.title === title)
      .map((filtered) => filtered.subject)
      .sort()
  },

  getCategories: (state) => ({ title, subject }) => {
    return Array.from(state.menus)
      .filter((menu) => subject ? (menu.title === title && menu.subject === subject) : (menu.title === title))
      .map((filtered) => filtered.categories)
      .flat()
  },
}

const actions = {
  async getMenus({ commit }) {
    try {
      const { data } = await axios.get(process.env.VUE_APP_API_URL + 'menus')
      commit('SET_MENUS', data.data.menus)
      return data
    } catch (err) {
      return err.response.data
    }
  },
}

const mutations = {
  SET_MENUS(state, menus) {
    state.menus = [...menus]
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
