import { setItem, getItem } from '../../common/sessionStorage.js'
import axios from '../../services/axios.js'

const state = () => ({
  type: 'list',
  category: '전체',
  categories: [],
  menus: getItem('menus'),
  groupMenus: getItem('groupMenus', {}),
  currentMenus: [],
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
  SET_TYPE(state, type) {
    state.type = type
  },

  SET_CATEGORY(state, category) {
    state.category = category
  },

  SET_MENUS(state, menus = []) {
    state.menus = menus
    setItem('menus', state.menus)
  },

  SET_GROUP_MENUS(state, menus = []) {
    state.groupMenus = menus.reduce((acc, menu) => {
      const { main } = menu
      if (!acc[main]) acc[main] = []
      acc[main].push(menu)
      return acc
    }, {})
    setItem('groupMenus', state.groupMenus)
  },

  SET_CURRENT_MENUS(state, { main, sub }) {
    if (!sub) {
      state.currentMenus = state.groupMenus[main]
    } else {
      state.currentMenus = state.groupMenus[main]?.filter((subMenus) => subMenus.sub === sub)
    }

    state.type = state.currentMenus.length === 1 ? [...state.currentMenus].shift()?.type : 'list'
    state.categories = [...new Set(state.currentMenus.flatMap((menu) => menu.categories))]
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
