<template>
  <div class="posts">
    <Toolbar v-show="curRouteParams.menu !== 'guest'" :type="type" @updatedToolbar="updatedToolbar" />

    <div v-if="posts.length">
      <GuestList v-if="curRouteParams.menu === 'guest'" :sortedPosts="getPosts" />
      <ul v-else :class="type">
        <template v-for="post in posts" :key="post._id">
          <List :post="post" :type="type" />
        </template>
      </ul>
    </div>
    <div v-else>
      <span>There is no posts.</span>
    </div>

    <Pagenation2 />
  </div>
</template>

<script>
import { ref, computed, watchEffect, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import Toolbar from '../../components/Toolbar.vue'
import List from '../../components/List.vue'
import GuestList from '../../components/GuestList.vue'
import Pagenation2 from '../../components/Pagenation2.vue'

export default {
  name: 'posts',
  components: {
    Toolbar,
    List,
    GuestList,
    Pagenation2,
  },
  setup() {
    const route = useRoute()
    const store = useStore()
    const curRouteQueries = computed(() => route.query)
    const curRouteParams = computed(() => route.params)
    const posts = computed(() => store.state.post.posts)
    const type = ref('list')
    const category = ref('')
    const sortedBy = ref('')

    const updatedToolbar = (updatedData) => {
      if (updatedData.type) {
        type.value = updatedData.type
      } else if (updatedData.category) {
        category.value = updatedData.category
      } else if (updatedData.sortedBy) {
        sortedBy.value = updatedData.sortedBy
      }
    }

    watchEffect(async () => {
      try {
        const filter = { title: curRouteParams.value.menu, subject: curRouteParams.value.sub }
        await store.dispatch('post/getPosts', {
          subject: store.getters['menu/getMenuId'](filter),
          page: curRouteQueries.value.pageNum,
          limit: 10,
        })
      } catch (error) {
        console.log(error)
      }
    })

    watchEffect(() => {
      if (!curRouteParams.value.sub || curRouteParams.value.sub !== 'album') {
        type.value = 'list'
      } else {
        type.value = 'album'
      }
    })

    return { curRouteParams, posts, Pagenation2, type, updatedToolbar }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.posts {
  display: grid;
  grid-template-rows: repeat(2, auto);
}

.list {
  li:last-child {
    margin-bottom: 0;
  }
}

.album {
  display: grid;
  justify-content: start;
  grid-template-columns: repeat(auto-fit, minmax(auto, 30.3rem));
  gap: 5.6rem 3.2rem;
}
</style>
