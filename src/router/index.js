import { createRouter, createWebHistory } from 'vue-router'
import store from '../store/index'
import Home from '../views/Home.vue'
import Login from '../views/auth/Login.vue'
import Account from '../views/auth/Account.vue'
import Profile from '../views/auth/Profile.vue'
import Posts from '../views/post/Posts.vue'
import Post from '../views/post/Post.vue'
import Editor from '../views/post/Editor.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  { path: '/', redirect: 'home' },
  { path: '/home', name: 'home', component: Home, meta: { title: 'Home' } },
  { path: '/auth/login', name: 'login', component: Login, meta: { title: 'Login' } },
  { path: '/auth/sign-up', name: 'signUp', component: Account, meta: { title: 'Sign-up', requiredAuth: false } },
  { path: '/auth/account', name: 'account', component: Account, meta: { title: 'Account', requiredAuth: true } },
  { path: '/auth/profile/:nickname', name: 'profile', component: Profile, meta: { title: 'Profile', requiredAuth: true } },
  { path: '/posts/:title/:subject?', name: 'posts', component: Posts, meta: { title: 'Posts' } },
  { path: '/posts/:title/:subject?/:postNum(\\d+)', name: 'post', component: Post, meta: { title: 'Post' } },
  { path: '/posts/editor/:postNum?', name: 'editor', component: Editor, meta: { title: 'Editor', requiredAuth: true } },
  { path: '/:catchAll(.*)+', component: NotFound, meta: { title: 'NotFoundError 404!' } },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title

  if (!store.state.auth.user.nickname && localStorage.getItem('user')) {
    store.commit('auth/SET_USER_INFO', JSON.parse(localStorage.getItem('user')))
  }

  if (!store.state.menu.menus.length) {
    await store.dispatch('menu/getMenus')
  }

  // console.log('auth: ', store.state.auth.user, '\ntoken: ', store.state.auth.token, '\nmenu: ', store.state.menu.menus)

  if (store.state.auth.user.nickname && (to.name === 'login' || to.path === '/auth/sign-up')) {
    next({ name: 'home' })
  } else if (!store.state.auth.user.nickname && to.meta.requiredAuth) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
