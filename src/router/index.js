import { createRouter, createWebHistory } from 'vue-router'
import { getItemWithTTL } from '../common/localStorage'
import store from '../store/index'
import Home from '../views/Home.vue'
import Posts from '../views/post/Posts.vue'
import Post from '../views/post/Post.vue'
import NotFound from '../views/NotFound.vue'

const Profile = () => import('../views/auth/Profile.vue')
const Editor = () => import('../views/post/Editor.vue')

const routes = [
  { path: '/', redirect: 'home' },
  { path: '/home', name: 'home', component: Home, meta: { title: 'Home' } },
  { path: '/auth/profile/:nickname', name: 'profile', component: Profile, meta: { title: 'Profile', requiredAuth: false } },
  { path: '/editor', name: 'editor', component: Editor, meta: { title: 'Editor', requiredAuth: true } },
  { path: '/posts/:main/:sub?', name: 'posts', component: Posts, props: true, meta: { title: 'Posts' } },
  { path: '/posts', name: 'post', component: Post, props: true, meta: { title: 'Post' } },
  { path: '/:catchAll(.*)+', component: NotFound, meta: { title: 'NotFoundError 404!' } },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  document.title = to.name === 'post' ? store.state.post.post?.title : to.meta?.title ?? 'DINGGUL'

  if (!store.state.menu.menus?.length) {
    await store.dispatch('menu/getMenus')
  }

  if (getItemWithTTL('isLogin', false) && (!store.state.auth.user?._id || !store.state.auth.profile?._id)) {
    await store.dispatch('auth/getAccount')
  }

  if (to.meta.requiredAuth && !store.state.auth.user?._id) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
