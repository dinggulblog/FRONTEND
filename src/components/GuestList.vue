<template>
  <div class="guestList">
    <CommentEditor />
    <ul>
      <li>
        <div class="comment">
          <div class="items">
            <h2>댓글 {{ comments.length }}개</h2>
            <ul v-for="comment in comments" :key="comment._id">
              <CommentItem :comment="comment" />
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </div>

  <Dialog ref="Dialog"></Dialog>
</template>

<script>
import { ref, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import Dialog from '../components/Dialog.vue'
import CommentEditor from '../views/post/CommentEditor.vue'
import CommentItem from '../components/CommentItem.vue'

export default {
  props: {
    sortedPosts: {
      type: Array,
      required: true,
    },
  },
  components: {
    CommentEditor,
    CommentItem,
    Dialog,
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const Dialog = ref(null)
    const CommentEditor = ref(null)

    onBeforeMount(() => {
      document.title = post.value.title
      router.currentRoute.value.meta.title = post.value.title
    })

    const idx = ref(router.currentRoute.value.params.idx)
    const maxIdx = ref(store.state.post.posts.length - 1)
    const post = computed({
      get: () => store.state.post.posts[idx.value] || {},
      set: (val) => store.commit('post/SET_POST', val),
    })

    const comments = computed(() => store.state.comment.comments)

    return { dayjs, Dialog, post, idx, maxIdx, CommentEditor, comments }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.guestList {
  ul {
    list-style: none;
  }
  .items {
    color: var(--primary);

    h2 {
      font-size: 1.6rem;
      margin: 4.8rem 0 0;
      padding: 0 0 4rem;
      font-weight: 500;
    }
  }
}
</style>
