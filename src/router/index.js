import { createRouter, createWebHistory } from 'vue-router'
import { getItem, getItemWithTTL } from '../common/localStorage'
import store from '../store/index'
import Home from '../views/Home.vue'
import NotFound from '../views/NotFound.vue'

const Profile = () => import(/* webpackChunkName: "profile" */ '../views/auth/Profile.vue')
const FindAccount = () => import(/* webpackChunkName: "findAccount" */ '../views/auth/FindAccount.vue')
const ResetPassword = () => import(/* webpackChunkName: "resetPassword" */ '../views/auth/ResetPassword.vue')
const Editor = () => import(/* webpackChunkName: "editor" */ '../views/post/Editor.vue')
const Posts = () => import(/* webpackChunkName: "posts" */ '../views/post/Posts.vue')
const Post = () => import(/* webpackChunkName: "post" */ '../views/post/Post.vue')
const Search = () => import(/* webpackChunkName: "post" */ '../views/Search.vue')

const routes = [
  { path: '/', redirect: 'home' },
  { path: '/home', name: 'home', component: Home, meta: { title: 'Home' } },
  {
    path: '/auth/profile/:nickname',
    name: 'profile',
    component: Profile,
    meta: { title: 'Profile', requiredAuth: false },
  },
  { path: '/auth/find', name: 'findAccount', component: FindAccount, meta: { title: 'FindAccount' } },
  { path: '/auth/pwd-reset', name: 'resetPassword', component: ResetPassword, meta: { title: 'ResetPassword' } },
  { path: '/editor', name: 'editor', component: Editor, meta: { title: 'Editor', requiredAuth: true } },
  { path: '/posts/:main/:sub?', name: 'posts', component: Posts, props: true, meta: { title: 'Posts' } },
  { path: '/post/:postId', name: 'post', component: Post, props: true, meta: { title: 'Post' } },
  { path: '/search', name: 'search', component: Search, props: true, meta: { title: 'Search' } },
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
    document.title = to.meta?.title ?? document.title

    const isLogin = getItemWithTTL('isLogin', false)

    if (to.name === 'posts') {
      store.commit('menu/SET_CURRENT_MENUS', { main: to.params.main, sub: to.params.sub })
      store.commit('menu/SET_CATEGORY', '전체')
    }

    if (!store.state.menu.menus) {
      await store.dispatch('menu/getMenus')
    }

    if (isLogin && !store.state.auth.id) {
      const user = getItem('user', null)
      user ? store.commit('auth/SET_USER', user) : await store.dispatch('auth/getAccount')
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

export default router
