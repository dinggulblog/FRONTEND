import { createRouter, createWebHistory } from 'vue-router'
import { getItem } from '../common/localStorage'
import store from '../store/index'
import Home from '../views/Home.vue'
import Post from '../views/post/Post.vue'
import Posts from '../views/post/Posts.vue'
import Search from '../views/post/Search.vue'
import NotFound from '../views/NotFound.vue'

const Editor = () => import(/* webpackChunkName: "editor" */ '../views/post/Editor.vue')
const Profile = () => import(/* webpackChunkName: "profile" */ '../views/auth/Profile.vue')
const FindAccount = () => import(/* webpackChunkName: "findAccount" */ '../views/auth/FindAccount.vue')
const ResetPassword = () => import(/* webpackChunkName: "resetPassword" */ '../views/auth/ResetPassword.vue')
const Dashboard = () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard/Dashboard.vue')
const Members = () => import(/* webpackChunkName: "members" */ '../views/dashboard/Members.vue')

const routes = [
  { path: '/', redirect: 'home' },
  { path: '/home', name: 'home', component: Home, meta: { title: 'Home' } },
  { path: '/auth/profile/:nickname', name: 'profile', component: Profile, meta: { title: 'Profile' } },
  { path: '/auth/find', name: 'findAccount', component: FindAccount, meta: { title: 'FindAccount' } },
  { path: '/auth/pwd-reset', name: 'resetPassword', component: ResetPassword, meta: { title: 'ResetPassword' } },
  { path: '/posts/:main/:sub?', name: 'posts', component: Posts, props: true, meta: { title: 'Posts' } },
  { path: '/post/:main/:postId', name: 'post', component: Post, props: true, meta: { title: 'Post' } },
  { path: '/search', name: 'search', component: Search, props: true, meta: { title: 'Search' } },
  { path: '/editor', name: 'editor', component: Editor, meta: { title: 'Editor', requiredAuth: true } },
  { path: '/dashboard', name: 'dashboard', component: Dashboard, props: true, meta: { title: 'Dashboard', requiredAuth: true } },
  { path: '/members', name: 'members', component: Members, props: true, meta: { title: 'Members', requiredAuth: true } },
  { path: '/:catchAll(.*)+', name: 'notfound', component: NotFound, meta: { title: 'NotFoundError 404!' } },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    document.getElementById('app').scrollIntoView({ behavior: 'smooth' });
  }
})

router.beforeEach(async (to, from, next) => {
  try {
    if (store.state.auth.isLogin && !store.state.auth.id) {
      const user = getItem('user', null)
      user ? store.commit('auth/SET_USER', user) : await store.dispatch('auth/getAccount')
    }

    if (!store.state.menu.menus) {
      await store.dispatch('menu/getMenus')
    }

    if (to.name === 'posts') {
      store.commit('menu/SET_CATEGORY', '전체')
    }

    if (to.params.main) {
      store.commit('menu/SET_CURRENT_MENUS', { main: to.params.main, sub: to.params.sub })
    }

    if (to.meta.requiredAuth && !store.state.auth.id) {
      next({ name: 'home' })
    } else {
      next()
    }
  } catch (error) {
    next(error)
  }
})

router.afterEach((to, from, failure) => {
  if (to.name !== 'post') {
    document.title = to.params.sub
    ? to.params.main.replace(/^[a-z]/, char => char.toUpperCase()) + ' / ' + to.params.sub.replace(/^[a-z]/, char => char.toUpperCase()) + ' - DINGGUL'
    : to.params.main
    ? to.params.main.replace(/^[a-z]/, char => char.toUpperCase()) + ' - DINGGUL'
    : to.meta.title
    ? to.meta.title + ' - DINGGUL'
    : document.title
  }
})

export default router
