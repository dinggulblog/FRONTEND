import axios from '../../services/axios.js'

const state = () => ({
  menus: [],
  groupedMenus: {},
  currentMenus: [],
  currentCategories: [],
  currentType: '',
})

const getters = {}

const actions = {
  async getMenus({ commit }) {
    try {
      const { data } = await axios.get('v1/menus')
      const { menus } = data.data

      if (menus) {
        commit('SET_MENUS', menus)
        commit('SET_GROUP_MENUS', menus)
      }
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

  SET_TYPE(state, type) {
    state.currentType = type
  },

  SET_CURRENT_MENUS(state, { main, sub }) {
    if (!sub && main) {
      state.currentMenus = state.groupedMenus[main]
    } else if (sub && main) {
      state.currentMenus = state.groupedMenus[main]?.filter((subMenus) => subMenus.sub === sub)
    } else {
      state.currentMenus = state.menus ?? []
    }
  },

  SET_CURRENT_CATEGORIES(state, menus = []) {
    state.currentCategories = [...new Set(menus.flatMap((menu) => menu.categories))]
  },

  SET_CURRENT_TYPE(state, menus = []) {
    if (menus.length === 1) {
      state.currentType = [...menus].shift()?.type
    } else {
      state.currentType = 'list'
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
