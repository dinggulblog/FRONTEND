import axios from '../../services/axios.js'

const state = () => ({
  menus: [],
  groupedMenus: {},
  currentMenus: [],
  currentCategories: []
})

const getters = {

}

const actions = {
  async getMenus({ commit }) {
    try {
      const { data } = await axios.get('v1/menus')
      const { menus } = data.data
      commit('SET_MENUS', menus)
      commit('SET_GROUP_MENUS', menus)
    } catch (err) {
      return err.response.data
    }
  },
}

const mutations = {
  SET_MENUS(state, menus = []) {
    state.menus = menus
  },

  SET_GROUP_MENUS(state, menus = []) {
    state.groupedMenus = menus.reduce((acc, menu) => {
      const { main } = menu
      if (!acc[main]) acc[main] = []
      acc[main].push(menu)
      return acc
    }, {})
  },

  SET_CURRENT_MENUS(state, { main, sub }) {
    state.currentMenus = !main
      ? state.menus
      : sub
      ? state.groupedMenus[main].filter(subMenus => subMenus.sub === sub)
      : state.groupedMenus[main]
  },
  
  SET_CURRENT_CATEGORIES(state) {
    state.currentCategories = [...new Set(state.currentMenus.map((menu) => menu?.categories).flat())]
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
