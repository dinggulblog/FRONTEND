import { setItem, getItem } from '../../common/sessionStorage.js'
import axios from '../../services/axios.js'

const state = () => ({
  type: 'list',
  category: '전체',
  categories: [],
  menus: getItem('menus', null),
  currentMenus: [],
})

const getters = {}

const actions = {
  async getMenus({ commit }) {
    try {
      const { data } = await axios.get('v1/menus')
      const {
        data: { menus },
      } = data

      commit('SET_MENUS', menus)
    } catch (err) {
      return err.response.data
    }
  },
}

const mutations = {
  SET_TYPE(state, type) {
    state.type = type
  },

  SET_CATEGORY(state, category) {
    state.category = category
  },

  SET_MENUS(state, menus = []) {
    state.menus = menus.reduce((acc, menu) => {
      const { main } = menu
      if (!acc[main]) acc[main] = []
      acc[main].push(menu)
      return acc
    }, {})
    setItem('menus', state.menus)
  },

  SET_CURRENT_MENUS(state, { main, sub }) {
    if (!state.menus || typeof state.menus !== 'object') return

    const subMenus = state.menus[main]

    if (Array.isArray(subMenus)) {
      state.currentMenus = sub ? subMenus.filter((menu) => menu.sub === sub) : subMenus

      state.type = state.currentMenus.length === 1 ? state.currentMenus[0]?.type : 'list'
      state.categories = [...new Set(state.currentMenus.flatMap(({ categories }) => categories))]
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
