<template>
  <div class="wrap_post_comment">
    <Post :user="user" :post="post" @onDeletePost="onDeletePost" />
    <Comments :comments="comments" :user="user" :post="post" @onDeleteComment="onDeleteComment" />
  </div>
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

        if (Boolean(props.quickMove)) {
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

<style lang="scss" rel="stylesheet/scss" scoped>
  .wrap_post_comment {
    .post {
      .wrap_header {
        display: flex;
        .wrap_left {
          display: flex;
          flex-direction: column;
          flex-basis: 80%;
          padding: 0 0 0 2.4rem;
          border-left: 1px solid var(--primary-dark);

          .wrap_title {
            margin-bottom: 2.4rem;
            .title {
              display: flex;
              flex-direction: row;
              align-items: center;
              h2 {
                font-size: 2rem;
                color: var(--list_title);
                font-weight: 400;
              }

              .lock_ico {
                margin: 0 0 0 1.6rem;
                color: var(--list_info);
              }
            }
          }
        }

        .wrap_right {
          display: flex;
          flex-direction: column;
          flex-basis: 20%;
          align-items: flex-end;
          justify-content: center;
        }
      }

      .content {
        margin: 6.4rem 0;
        font-size: 1.4rem;
        color: var(--input_text);
        line-height: 2.2rem;
      }

      .wrap_like {
        display: flex;
        flex-direction: column;
        align-items: center;

        .liked_count {
          display: flex;
          align-items: center;
          justify-content: center;

          span {
            color: var(--list_info);
            font-size: 1.6rem;
          }

          .like_ico {
            margin-right: 0.8rem;
            cursor: pointer;
          }
        }

        .liked_user {
          ul > li {
            display: flex;
            flex-direction: column;
            align-items: center;

            img {
              border-radius: 50%;
              width: 3.6rem;
              height: 3.6rem;
              object-fit: cover;
            }

            span {
              font-size: 1.2rem;
              color: var(--input_text);
              margin: 0.8rem 0 0;
            }
          }
        }
      }

      .wrap_author {
        margin: 4.8rem 0 6.4rem;
        position: relative;

        &::v-deep .author {
          .wrap_avatar {
            .avatar {
              width: 9.6rem;
              height: 9.6rem;
            }
          }
          .wrap_nickname_greetings {
            color: var(--btn_text);
            .nickname {
              font-size: 1.6rem;
              font-weight: 500;
            }

            .greetings {
              margin: 1.6rem 0 0;
              font-size: 1.4rem;
              overflow: hidden;
              white-space: normal;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              word-break: keep-all;
            }
          }
        }

        .a_link {
          position: absolute;
          top: 0;
          right: 0;
          font-size: 1.4rem;
          text-decoration: underline;
          color: var(--secondary);
        }
      }
    }

    .comment {
      .comments {
        margin: 6.4rem 0 0;

        h2 {
          color: var(--list_info-dark);
          font-weight: 400;
          font-size: 1.6rem;
          margin: 0 0 3.2rem 0;
        }
      }
    }
  }
</style>
