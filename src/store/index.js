import { createStore } from 'vuex'
import authModule from './modules/auth'
import menuModule from './modules/menu'
import postModule from './modules/post'
import draftModule from './modules/draft'
import commentModule from './modules/comment'

export default createStore({
  modules: {
    auth: authModule,
    menu: menuModule,
    post: postModule,
    draft: draftModule,
    comment: commentModule,
  },
})
