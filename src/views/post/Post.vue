<template>
  <Post 
    v-if="post" 
    :post="post" 
    @deletePost="onDeletePost" 
    @updateLike="onUpdateLike"
  />

  <Suspense>
    <template #default>
      <Comments
        v-if="post"
        :postId="postId"
        :author="author"
        :userId="userId"
        :comments="comments"
        :commentCount="commentCount"
        :quickMove="Boolean(quickMove)"
      />
    </template>
    <template #fallback>
      댓글 로딩 중...
    </template>
  </Suspense>
</template>

<script>
  import { defineComponent, inject, computed, watch, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  import Post from '../../components/Post.vue'
  import Comments from '../../components/Comments.vue'

  export default defineComponent({
    name: 'post',
    components: {
      Post,
      Comments,
    },
    props: {
      postId: {
        type: String,
        required: true,
        default: ''
      },
      quickMove: {
        type: [Boolean, String],
        required: false,
        default: false,
      },
    },
    setup(props) {
      const { go } = useRouter()
      const { state, dispatch, commit } = useStore()

      const DIALOG_EL = inject('DIALOG_EL')
      const TOAST_EL = inject('TOAST_EL')

      const post = computed(() => state.post.post)
      const author = computed(() => state.post.post?.author?._id)
      const userId = computed(() => state.auth.id)
      const comments = computed(() => state.comment.comments)
      const commentCount = computed(() => Number(state.comment.commentCount))

      const onUpdateLike = async () => {
        const { success, error } = !post.value.liked
          ? await dispatch('post/updateLike', { postId: post.value._id })
          : await dispatch('post/deleteLike', { postId: post.value._id })
        
        if (!success) TOAST_EL.value.open('error', error)
      }

      const onDeletePost = async () => {
        const ok = await DIALOG_EL.value.show({
          title: '게시물 삭제',
          message: '게시물을 삭제하시겠습니까?\n한번 삭제된 게시물은 되돌릴 수 없습니다.',
        })
        if (ok) {
          const { success, error } = await dispatch('post/deletePost', { postId: post.value._id, authorId: post.value?.author?._id })
          if (!success) TOAST_EL.value.open('error', error)
        }
      }

      watch(
        () => props.postId,
        async () => {
          const { success, error } = await dispatch('post/getPost', { postId: props.postId })
          if (success) return

          alert(error)
          go(-1)
        },
        { immediate: true, flush: 'post' }
      )

      onUnmounted(() => {
        commit('post/SET_POST', null)
      })

      return {
        post,
        author,
        userId,
        comments,
        commentCount,
        onUpdateLike,
        onDeletePost
      }
    },
  })
</script>