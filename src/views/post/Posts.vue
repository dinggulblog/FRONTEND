<template>
  <div class="posts">
    <Toolbar :type="type" :categories="categories" @updateType="onUpdateType" @updateCategory="onUpdateCategory" />
    <div v-if="posts.length">
      <ul :id="type">
        <template v-for="post in posts" :key="post._id">
          <PostSlot :type="type" :post="post" :isLike="post.likes?.includes(user._id) ?? false"> </PostSlot>
        </template>
      </ul>
    </div>
    <div v-else class="empty"><span>There is no posts.</span></div>

    <Pagenation :page="page" :maxPage="maxPage" @updatePage="onUpdatePage" />
  </div>
</template>

<script>
import { computed, onBeforeMount, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { mapState } from '../../common/vuex-helper.js'
import Toolbar from '../../components/Toolbar.vue'
import PostSlot from '../../components/slots/PostSlot.vue'
import Pagenation from '../../components/Pagenation.vue'

export default {
  name: 'posts',
  components: {
    Toolbar,
    PostSlot,
    Pagenation,
  },
  setup(props) {
    const route = useRoute()

    const { state, dispatch, commit } = useStore()
    const { posts, category, page, limit, maxPage } = mapState('post')
    const user = computed(() => state.auth.user)
    const menus = computed(() => state.menu.currentMenus)
    const categories = computed(() => state.menu.currentCategories)
    const type = computed(() => state.menu.currentType)

    const onUpdateType = (type) => commit('menu/SET_TYPE', type)
    const onUpdatePage = (page) => commit('post/SET_PAGE', page)
    const onUpdateCategory = (ctg) => commit('post/SET_CATEGORY', ctg)

    onBeforeMount(() => {
      commit('menu/SET_CURRENT_MENUS', { main: route.params.main, sub: route.params.sub })
      commit('menu/SET_CURRENT_CATEGORIES', menus.value)
      commit('menu/SET_CURRENT_TYPE', menus.value)
    })

    watchEffect(async () => {
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
      commit('menu/SET_CURRENT_MENUS', { main: route.params.main, sub: route.params.sub })
      commit('menu/SET_CURRENT_CATEGORIES', menus.value)
      commit('menu/SET_CURRENT_TYPE', menus.value)

      const query = {
        page: page.value,
        limit: limit.value,
        menu: menus.value?.map((menu) => menu._id),
        category: category.value === '전체' ? null : category.value,
      }

      await dispatch('post/getPosts', query)
    })

    return { menus, posts, page, maxPage, user, categories, type, onUpdateType, onUpdatePage, onUpdateCategory }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss">
#list {
  display: flex;
  flex-direction: column;
}

#card {
  display: flex;
  width: 100%;
  flex-wrap: wrap;

  @include tablet_landscape {
    & .card_item:nth-child(3n + 0) {
      margin-right: 0;
    }
  }

  @include desktop {
    & .card_item:nth-child(3n + 0) {
      margin-right: 0;
    }
  }

  @include mobile_tablet {
    & .card_item:nth-child(2n + 0) {
      margin-right: 0;
    }
  }
}
</style>
