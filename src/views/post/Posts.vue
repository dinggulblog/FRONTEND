<template>
  <Toolbar :main="main" :sub="sub" :type="type" :categories="categories" @updateType="onUpdateType" @updateCategory="onUpdateCategory" />

  <Suspense>
    <template #default>
      <Posts v-if="type !== 'slide'" :main="main" :sub="sub" :type="type" :category="category"></Posts>
      <ul v-else>
        <li v-for="category in categories" :key="category">
          <Posts :main="main" :sub="sub" :type="type" :category="category"></Posts>
        </li>
      </ul>
    </template>

    <template #fallback>
      <span>게시물 로딩 중...</span>
    </template>
  </Suspense>
</template>

<script>
  import { watchEffect } from 'vue'
  import { useStore } from 'vuex'
  import { mapState } from '../../common/vuex-helper.js'
  import Posts from '../../components/posts/Posts.vue'
  import Toolbar from '../../components/posts/Toolbar.vue'

  export default {
    name: 'posts',
    props: {
      main: {
        type: String,
        required: true
      },
      sub: {
        type: String
      }
    },
    components: {
      Posts,
      Toolbar,
    },
    setup(props) {
      const { commit } = useStore()

      const { type, category, categories } = mapState('menu')

      const onUpdateType = (type) => {
        commit('menu/SET_TYPE', type)
      }

      const onUpdateCategory = (ctg) => {
        commit('menu/SET_CATEGORY', ctg)
      }

      watchEffect(
        () => {
          window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
          commit('menu/SET_CURRENT_MENUS', { main: props.main, sub: props.sub })
          commit('menu/SET_CATEGORY', '전체')
        }
      )

      return { type, category, categories, onUpdateType, onUpdateCategory }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
</style>
