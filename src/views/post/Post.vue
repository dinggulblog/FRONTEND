<template>
  <div v-if="postError">
    {{ postError }}
  </div>

  <Post @deletePost="onDeletePost" @updateLike="onUpdateLike" />

  <div class="comment">
    <CommentEditor :postId="postId" />

    <div class="comments" ref="COMMENTS_EL">
      <h2>댓글 {{ commentCount }}개</h2>
      <ul class="comment_items" v-if="comments.length">
        <CommentSlot
          v-for="comment in comments"
          :key="comment._id"
          :comment="comment"
          :postId="postId"
          :author="author"
          :userId="userId"
        />
      </ul>
    </div>
  </div>
</template>

<script setup>
  import { defineProps, inject, ref, computed, watch, onUnmounted } from 'vue'
  import { useStore } from 'vuex'
  import Post from '../../components/Post.vue'
  import CommentEditor from '../../components/CommentEditor.vue'
  import CommentSlot from '../../components/slotdata/CommentSlot.vue'

  const props = defineProps({
    postId: {
      type: String,
      required: true,
      default: '',
    },
  })

  const { state, dispatch, commit } = useStore()

  const DIALOG_EL = inject('DIALOG_EL')
  const TOAST_EL = inject('TOAST_EL')

  const COMMENTS_EL = ref(null)
  const postError = ref(null)
  const commentsError = ref(null)

  const quickMove = computed(() => state.post.quickMove)
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
      const { success, error } = await dispatch('post/deletePost', {
        postId: post.value._id,
        authorId: post.value?.author?._id,
      })
      if (!success) TOAST_EL.value.open('error', error)
    }
  }

  watch(
    () => props.postId,
    async () => {
      const { success, error } = await dispatch('post/getPost', { postId: props.postId })
      if (!success) postError.value = error

      const { success: success2, error: error2 } = await dispatch('comment/getComments', props.postId)
      if (!success2) commentsError.value = error2

      if (quickMove.value && COMMENTS_EL.value) {
        COMMENTS_EL.value.scrollIntoView({ behavior: 'smooth' })
        commit('post/SET_QUICKMOVE', false)
      }
    },
    { immediate: true }
  )

  onUnmounted(() => {
    commit('post/SET_POST', null)
    commit('comment/SET_COMMENTS', {})
  })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .comment {
    .comments {
      margin: 6.4rem 0 0;
    }

    h2 {
      color: var(--primary);
      font-weight: 400;
      font-size: 1.6rem;
      margin: 0 0 3.2rem 0;
    }
  }
</style>
