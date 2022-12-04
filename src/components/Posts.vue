<template>
  <div class="posts">
    <div v-if="posts?.length">
      <ul :id="type">
        <template v-for="post in posts" :key="post._id">
          <PostSlot :type="type" :post="post" :isLike="post.likes?.includes(userId)"></PostSlot>
        </template>
      </ul>
    </div>

    <div v-else class="empty">
      <span>There is no posts.</span>
    </div>

    <Pagenation :page="page" :maxPage="maxPage" @updatePage="onUpdatePage" />
  </div>
</template>

<script>
  import { computed, toRefs } from 'vue'
  import { useStore } from 'vuex'
  import PostSlot from '../components/slots/PostSlot.vue'
  import Pagenation from '../components/Pagenation.vue'

  export default {
    name: 'posts',
    components: {
      PostSlot,
      Pagenation,
    },
    props: {
      type: {
        type: String,
        default: 'List',
      },
      user: {
        type: Object,
        default: () => ({}),
      },
    },
    setup(props) {
      const { state, commit } = useStore()

      const { _id: userId } = toRefs(props.user)

      const posts = computed(() => state.post.posts)
      const page = computed(() => state.post.page)
      const maxPage = computed(() => state.post.maxPage)

      const onUpdatePage = (page) => commit('post/SET_PAGE', page)

      return { userId, posts, page, maxPage, onUpdatePage }
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
