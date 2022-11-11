import { createRouter, createWebHistory } from 'vue-router'
import { getItem } from '../common/sessionStorage'
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
  { path: '/auth/profile/:nickname', name: 'profile', component: Profile, meta: { title: 'Profile', requiredAuth: false } },
  { path: '/posts/:main/:sub?', name: 'posts', component: Posts, meta: { title: 'Posts' } },
  { path: '/posts', name: 'post', component: Post, meta: { title: 'Post' } },
  { path: '/editor/:id?', name: 'editor', component: Editor, meta: { title: 'Editor', requiredAuth: true } },
  { path: '/:catchAll(.*)+', component: NotFound, meta: { title: 'NotFoundError 404!' } },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  document.title = to.meta?.title ?? 'DINGGUL'

  if (!store.state.auth.user._id && getItem('isLogin', false)) {
    await store.dispatch('auth/getAccount')
  }

  if (!store.state.menu.menus.length) {
    await store.dispatch('menu/getMenus')
  }

  if ((to.name === 'login' || to.path === '/auth/sign-up') && store.state.auth.user._id) {
    next({ name: 'home' })
  } else if (to.meta.requiredAuth && !store.state.auth.user.nickname) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
