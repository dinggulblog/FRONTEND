<template>
  <Toolbar :main="main" :sub="sub" :type="type" :categories="categories" @updateType="onUpdateType" @updateCategory="onUpdateCategory" />

  <Suspense>
    <template #default>
      <Posts v-if="type !== 'slide'" :type="type" :category="category" />
      <ul v-else>
        <li v-for="category in categories" :key="category">
          <Posts :type="type" :category="category" />
        </li>
      </ul>
    </template>

    <template #fallback>
      <span>게시물 로딩 중...</span>
    </template>
  </Suspense>
</template>

<script>
import { onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { mapState } from '../../common/vuex-helper.js'
import Posts from '../../components/posts/Posts.vue'
import Toolbar from '../../components/posts/Toolbar.vue'

export default {
  name: 'posts',
  components: {
    Posts,
    Toolbar
  },
  props: {
    main: {
      type: String,
      required: true
    },
    sub: {
      type: String
    }
  },
  setup() {
    const { commit } = useStore()
    const { type, category, categories } = mapState('menu')

    const onUpdateType = (updateType) => {
      commit('menu/SET_TYPE', updateType)
    }

    const onUpdateCategory = (updateCategory) => {
      commit('menu/SET_CATEGORY', updateCategory)
    }

    return { type, category, categories, onUpdateType, onUpdateCategory }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
</style>
