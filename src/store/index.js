import { createStore } from 'vuex'
import authModule from './modules/auth'
import menuModule from './modules/menu'
import postModule from './modules/post'
import commentModule from './modules/comment'

export default createStore({
  modules: {
    auth: authModule,
    menu: menuModule,
    post: postModule,
    comment: commentModule,
  },
})
