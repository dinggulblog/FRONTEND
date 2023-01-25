<template>
  <Toolbar
    :main="main"
    :sub="sub"
    :type="type"
    :categories="categories"
    @updateType="onUpdateType"
    @updateCategory="onUpdateCategory"
  />

  <div v-if="error">
    {{ error }}
  </div>

  <Suspense v-else>
    <template #default>
      <Posts v-if="type !== 'slide'" :menu="currentMenus" :type="type" :category="category" />
      <ul v-else class="ul_slide">
        <li v-for="category in categories" :key="category">
          <Posts :menu="currentMenus" :type="type" :category="category" />
        </li>
      </ul>
    </template>

    <template #fallback>
      <span>게시물 로딩 중...</span>
    </template>
  </Suspense>
</template>

<script>
  import { defineComponent, ref, onErrorCaptured } from 'vue'
  import { useStore } from 'vuex'
  import { mapState } from '../../common/vuex-helper.js'
  import Posts from '../../components/Posts.vue'
  import Toolbar from '../../components/Toolbar.vue'

  export default defineComponent({
    name: 'posts',
    components: {
      Posts,
      Toolbar,
    },
    props: {
      main: {
        type: String,
        required: true,
      },
      sub: {
        type: String,
      },
    },
    setup() {
      const { commit } = useStore()
      const { type, category, categories, currentMenus } = mapState('menu')

      const error = ref(null)

      const onUpdateType = (updateType) => {
        commit('menu/SET_TYPE', updateType)
      }

      const onUpdateCategory = (updateCategory) => {
        commit('menu/SET_CATEGORY', updateCategory)
      }

      onErrorCaptured((err) => {
        error.value = err.message
        return true
      })

      return { type, category, categories, currentMenus, error, onUpdateType, onUpdateCategory }
    },
  })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .ul_slide > li:first-child > .wrap_slide_toolbar {
    margin-top: 0;
  }
</style>
