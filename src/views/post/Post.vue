<template>
  <Post :profile="profile" :post="post" @onDeletePost="onDeletePost" />
  <Comments :comments="comments" :profile="profile" :post="post" @onDeleteComment="onDeleteComment" />
  <Dialog ref="Dialog"></Dialog>
</template>

<script>
  import { defineComponent, ref, computed, onBeforeMount, onUnmounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useStore } from 'vuex'
  import Post from '../../components/posts/Post.vue'
  import Comments from '../../components/Comments.vue'

  export default defineComponent({
    name: 'post',
    components: {
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

      const profile = computed(() => state.auth.profile)
      const post = computed(() => state.post.post)
      const comments = computed(() => state.comment.comments)

      const onDeletePost = async () => {
        if (post.value.author._id !== profile.value._id) return alert('본인 소유의 게시물만 삭제가 가능합니다.')

        const ok = await Dialog.value.show({
          title: '게시물 삭제',
          message: '게시물을 삭제하시겠습니까?\n한번 삭제된 게시물은 되돌릴 수 없습니다.',
        })
        if (ok) await dispatch('post/deletePost', post.value._id)
      }

      const onDeleteComment = async (comment) => {
        if (comment.commenter._id !== profile.value._id) return alert('본인 댓글만 삭제가 가능합니다.')

        const ok = await Dialog.value.show({
          title: '댓글 삭제',
          message: '해당 댓글을 삭제하시겠습니까?\n한번 삭제된 댓글은 되돌릴 수 없습니다.',
        })
        if (ok) await dispatch('comment/deleteComment', { postId: post.value._id, id: comment._id })
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
      })

      onUnmounted(() => {
        commit('post/SET_POST', new Object())
      })

      return {
        Dialog,
        profile,
        post,
        comments,
        onDeletePost,
        onDeleteComment,
      }
    },
  })
</script>

<style lang="scss" rel="stylesheet/scss" scoped></style>
