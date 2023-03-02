import { setItem, getItem } from '../../common/sessionStorage.js'
import axios from '../../services/axios.js'

const state = () => ({
  type: 'list',
  category: '전체',
  categories: [],
  menus: getItem('menus', null),
  subMenus: [],
  curMenus: [],
})

const getters = {}

const actions = {
  async getMenus({ commit }) {
    try {
      const { data } = await axios.get('v1/menus')
      const { success, data: { menus } } = data

      commit('SET_MENUS', menus)

      return { success, error: null }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message ?? err.message }
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
    state.subMenus = state.menus[main]
    state.curMenus = state.subMenus

    if (sub) {
      state.curMenus = state.subMenus.filter((menu) => menu.sub === sub)
      state.type = state.curMenus[0].type
      state.categories = state.curMenus[0].categories
    }
    else {
      state.type = 'list'
      state.categories = [...new Set(state.subMenus.flatMap(({ categories }) => categories))]
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
