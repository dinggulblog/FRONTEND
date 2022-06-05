import axios from 'axios'

const state = () => ({
  menus: [
    {
      owner: 'sol',
      subject: 'daily',
      categories: ['일상'],
    },
    {
      owner: 'sol',
      subject: 'album',
      categories: ['음식', '여행', '게임', '루비'],
    },
    {
      owner: 'sol',
      subject: 'dev',
      categories: ['개발', '정보', '기타'],
    },
    {
      owner: 'ming',
      subject: 'daily',
      categories: ['일상', '게임', '치즈'],
    },
    {
      owner: 'ming',
      subject: 'album',
      categories: ['일상', '게임', '래미'],
    },
    {
      owner: 'ming',
      subject: 'dev',
      categories: ['일상', '게임', '망고'],
    },
    {
      owner: 'guest',
      subject: 'guestBook',
      categories: [],
    },
  ],
})

const getters = {}

const actions = {}

const mutations = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
