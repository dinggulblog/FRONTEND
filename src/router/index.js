import { createRouter, createWebHistory } from 'vue-router'
import store from '../store/index'
import Home from '../views/Home.vue'
import Login from '../views/auth/Login.vue'
import Account from '../views/auth/Account.vue'
import Posts from '../views/post/Posts.vue'
import Post from '../views/post/Post.vue'
import Editor from '../views/post/Editor.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  { path: '/', redirect: 'home' },
  { path: '/home', name: 'home', component: Home, meta: { title: 'Home' } },
  {
    path: '/auth/login',
    name: 'login',
    component: Login,
    meta: { title: 'Login' },
  },
  {
    path: '/auth/sign-up',
    name: 'signUp',
    component: Account,
    meta: { title: 'Sign-up', requiredAuth: false },
  },
  {
    path: '/auth/account',
    name: 'account',
    component: Account,
    meta: { title: 'Account', requiredAuth: true },
  },
  {
    path: '/posts/:menu/:sub?',
    name: 'posts',
    component: Posts,
    meta: { title: 'Posts' },
  },
  { path: '/posts/:menu/:sub?/:postNum', name: 'post', component: Post },
  {
    path: '/posts/editor/:postNum?',
    name: 'editor',
    component: Editor,
    meta: { title: 'Editor', requiredAuth: true },
  },
  {
    path: '/:catchAll(.*)+',
    component: NotFound,
    meta: { title: 'NotFoundError' },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title

  if (!store.state.menu.menus.length) {
    await store.dispatch('menu/getMenus')
  }

  if (store.state.auth.user.accessToken && (to.name === 'login' || to.path === '/account/sign-up')) {
    next({ name: 'home' })
  } else if (!store.state.auth.user.accessToken && to.meta.requiredAuth) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
