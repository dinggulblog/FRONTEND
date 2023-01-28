import { createStore } from 'vuex'
import authModule from './modules/auth'
import menuModule from './modules/menu'
import postModule from './modules/post'
import draftModule from './modules/draft'
import loadingModule from './modules/loading'
import commentModule from './modules/comment'
import mailModule from './modules/mail'

export default createStore({
  modules: {
    auth: authModule,
    menu: menuModule,
    post: postModule,
    draft: draftModule,
    comment: commentModule,
    mail: mailModule,
    loading: loadingModule,
  },
})
