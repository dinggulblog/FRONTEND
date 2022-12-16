<template>
  <Post :user="user" :post="post" @onDeletePost="onDeletePost" />
  <Comments :comments="comments" :user="user" :post="post" @onDeleteComment="onDeleteComment" />
  <Dialog ref="Dialog"></Dialog>
</template>

<script>
  import { defineComponent, ref, computed, onBeforeMount, onUnmounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useStore } from 'vuex'
  import Post from '../../components/Post.vue'
  import Comments from '../../components/Comments.vue'
  import Dialog from '../../components/Dialog.vue'

  export default defineComponent({
    name: 'post',
    components: {
      Dialog,
      Post,
      Comments,
    },
    props: {
      quickMove: {
        type: [Boolean, String],
        default: false,
      },
    },
    setup(props) {
      const route = useRoute()
      const { push } = useRouter()
      const { state, dispatch, commit } = useStore()

      const Dialog = ref(null)

      const user = computed(() => state.auth.user)
      const post = computed(() => state.post.post)
      const comments = computed(() => state.comment.comments)

      const onDeletePost = async () => {
        const ok = await Dialog.value.show({
          title: '게시물 삭제',
          message: '게시물을 삭제하시겠습니까?\n한번 삭제된 게시물은 되돌릴 수 없습니다.',
        })
        if (ok) await dispatch('post/deletePost', post.value._id)
      }

      const onDeleteComment = async (commentId) => {
        const ok = await Dialog.value.show({
          title: '댓글 삭제',
          message: '해당 댓글을 삭제하시겠습니까?\n한번 삭제된 댓글은 되돌릴 수 없습니다.',
        })
        if (ok) await dispatch('comment/deleteComment', { postId: post.value._id, id: commentId })
      }

      onBeforeMount(async () => {
        if (route.query.id) {
          await dispatch('post/getPost', route.query.id)
          await dispatch('comment/getComments', route.query.id)
        } else {
          push({ name: 'home' })
        }

        if (Boolean(props.quickMove && comments.value)) {
          const y = document.querySelector('.comments').offsetTop - document.querySelector('#header').offsetHeight - 32
          window.scrollTo({ top: y, behavior: 'smooth' })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }

        document.title = post.value?.title ?? 'Post'
      })

      onUnmounted(() => {
        commit('post/SET_POST')
      })

      return {
        Dialog,
        user,
        post,
        comments,
        onDeletePost,
        onDeleteComment,
      }
    },
  })
</script>

<style lang="scss" rel="stylesheet/scss" scoped></style>
