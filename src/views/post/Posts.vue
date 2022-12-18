<template>
    <Toolbar :type="type" :categories="categories" @updateType="onUpdateType" @updateCategory="onUpdateCategory" />
    <Posts v-if="type !== 'slide'" :type="type"></Posts>
    <ul v-else-if="type === 'slide'">
      <li v-for="category in categories" :key="category">
        <Posts :type="type" :category="category"></Posts>
      </li>
    </ul>
</template>

<script>
  import { onBeforeMount, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStore } from 'vuex'
  import { mapState } from '../../common/vuex-helper.js'
  import Posts from '../../components/posts/Posts.vue'
  import Toolbar from '../../components/Toolbar.vue'

  export default {
    name: 'posts',
    components: {
      Posts,
      Toolbar,
    },
    setup(props) {
      const route = useRoute()
      const { dispatch, commit } = useStore()

      const { page, limit } = mapState('post')
      const { type, category, categories, currentMenus } = mapState('menu')

      const onUpdateType = (type) => {
        commit('menu/SET_TYPE', type)
      }

      const onUpdateCategory = (ctg) => {
        commit('menu/SET_CATEGORY', ctg)
        getPosts()
      }

      const getPosts = async () => {
        await dispatch('post/getPosts', {
          payload: {
            page: page.value,
            limit: limit.value,
            menu: currentMenus.value?.map((menu) => menu._id),
            category: category.value === '전체' ? null : category.value,
          },
        })
      }

      watch(
        () => route.params,
        () => {
          window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
          commit('menu/SET_CURRENT_MENUS', { main: route.params.main, sub: route.params.sub })
          commit('menu/SET_CATEGORY', '전체')
          getPosts()
        },
        { immediate: true }
      )

      onBeforeMount(() => {
        commit('menu/SET_CURRENT_MENUS', { main: route.params.main, sub: route.params.sub })
      })

      return { type, categories, onUpdateType, onUpdateCategory }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
</style>
