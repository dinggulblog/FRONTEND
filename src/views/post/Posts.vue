<template>
  <div class="posts">
    <Toolbar v-show="curRouteParams.menu !== 'guest'" :type="type" @updatedToolbar="updatedToolbar" />

    <div v-if="getPosts.length">
      <GuestList v-if="curRouteParams.menu === 'guest'" :sortedPosts="getPosts" />
      <ul v-else :class="type">
        <template v-for="post in getPosts" :key="post._id">
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
import { ref, computed, watchEffect } from 'vue'
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

    const category = ref('')
    const sortedBy = ref({})
    const getPosts = ref([])
    //const newPosts = ref([])
    // const curRouteQuery = computed(() => route.query)
    const curRouteParams = computed(() => route.params)

    getPosts.value = store.state.post.posts

    const type = ref('list')

    const updatedToolbar = (updatedData) => {
      if (updatedData.type) {
        type.value = updatedData.type
        console.log(type.value)
      } else if (updatedData.category) {
        category.value = updatedData.category
        console.log(category.value)
      } else if (updatedData.sortedBy) {
        sortedBy.value = updatedData.sortedBy
        console.log(sortedBy.value)
      }
    }

    watchEffect(() => {
      if (!curRouteParams.value.sub || curRouteParams.value.sub !== 'album') {
        type.value = 'list'
      } else {
        type.value = 'album'
      }
    })

    /*
    watchEffect(() => {
      if (curRouteParams.value || curRouteQuery.value || category.value || sortedBy.value) {
        newPosts.value = await store.dispatch('post/getPosts', { pageNum : route.query.pageNum, category : category.value, sortedBy : sortedBy.value.key })
      }
    })
  */

    return { curRouteParams, getPosts, Pagenation2, type, updatedToolbar }
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
