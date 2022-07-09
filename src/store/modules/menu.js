import axios from 'axios'

const state = () => ({
  menus: [],
})

const getters = {
  getFilteredMenus(state) {
    const titles = []
    const menus = []

    state.menus.forEach((storeMenu) => {
      if (!titles.includes(storeMenu.title)) titles.push(storeMenu.title)
    })

    titles.forEach((title) => menus.push({ title }))

    for (const menu of state.menus) {
      const idx = menus.findIndex((m) => m.title === menu.title)
      if (idx >= 0 && menus[idx].subjects) {
        menus[idx].subjects.push(menu.subject)
      } else {
        menus[idx].subjects = [menu.subject]
      }
    }

    return menus
  },

  getMenuId: (state) => (filter) => {
    return state.menus.find((menu) => menu.title === filter.title && menu.subject === filter.subject)._id || ''
  },

  getTitles: (state) => {
    return [...new Set(state.menus.map((menu) => menu.title))]
  },

  getSubjects: (state) => (title) => {
    return state.menus.filter((menu) => menu.title === title).map((filtered) => filtered.subject)
  },

  getCategories: (state) => (filter) => {
    return state.menus.find((menu) => menu.title === filter.title && menu.subject === filter.subject)?.categories
  },
}

const actions = {
  async getMenus({ commit }) {
    try {
      const { data } = await axios.get(process.env.VUE_APP_API_URL + 'menus')
      commit('SET_MENUS', data.data)
    } catch (err) {
      console.error('getMenusErr', err)
    }
  },
}

const mutations = {
  SET_MENUS(state, data) {
    state.menus = data
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
