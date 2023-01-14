import { createRouter, createWebHistory } from 'vue-router'
import { getItem, getItemWithTTL } from '../common/localStorage'
import store from '../store/index'
import Home from '../views/Home.vue'
import NotFound from '../views/NotFound.vue'

const Profile = () => import(/* webpackChunkName: "profile" */ '../views/auth/Profile.vue')
const Editor = () => import(/* webpackChunkName: "editor" */ '../views/post/Editor.vue')
const Posts = () => import(/* webpackChunkName: "posts" */ '../views/post/Posts.vue')
const Post = () => import(/* webpackChunkName: "post" */ '../views/post/Post.vue')

const routes = [
  { path: '/', redirect: 'home' },
  { path: '/home', name: 'home', component: Home, meta: { title: 'Home' } },
  { path: '/auth/profile/:nickname', name: 'profile', component: Profile, meta: { title: 'Profile', requiredAuth: false } },
  { path: '/editor', name: 'editor', component: Editor, meta: { title: 'Editor', requiredAuth: true } },
  { path: '/posts/:main/:sub?', name: 'posts', component: Posts, props: true, meta: { title: 'Posts' } },
  { path: '/post/:postId', name: 'post', component: Post, props: true, meta: { title: 'Post' } },
  { path: '/:catchAll(.*)+', name:'notfound', component: NotFound, meta: { title: 'NotFoundError 404!' } },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  document.title = to.meta?.title ?? 'DINGGUL'

  const isLogin = getItemWithTTL('isLogin', false)

  if (to.name === 'posts') {
    store.commit('menu/SET_CURRENT_MENUS', { main: to.params.main, sub: to.params.sub })
    store.commit('menu/SET_CATEGORY', '전체')
  }
  
  if (!store.state.menu.menus) {
    await store.dispatch('menu/getMenus')
  }

  if (isLogin && !store.state.auth.id) {
    const profile = getItem('profile', null)
    profile ? store.commit('auth/SET_PROFILE', profile) : await store.dispatch('auth/getAccount')
  }

  if (to.meta.requiredAuth && !store.state.auth.user?._id) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
