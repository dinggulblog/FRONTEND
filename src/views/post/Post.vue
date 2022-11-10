<template>
  <div class="wrap_post_comment">
    <div class="post" v-if="post._id">
      <div class="wrap_header">
        <div class="wrap_left">
          <div class="wrap_title">
            <div class="title">
              <h2>{{ post.title }}</h2>
              <span class="lock_ico"><i class="material-icons"> lock </i></span>
            </div>
          </div>

          <div class="wrap_info">
            <PostInfoSlot :post="post" />
          </div>
        </div>
        <div class="wrap_right">
          <ToggleSlot :type="'post'" @updatePost="onUpdatePost" />
        </div>
      </div>

      <div class="content">
        <markdown class="markdown" :source="post.content" :plugins="plugins" :breaks="true" :xhtmlOut="true" :typographer="true" />
      </div>

      <div class="wrap_like">
        <div class="liked_count">
          <span class="like_ico"><i class="material-icons" @click="!isLike ? onUpdateLike : onDeleteLike">favorite</i></span>
          <span>{{ likeCount }}</span>
        </div>
        <div class="liked_user">
          <ul>
            <li v-for="likedUser in likes" :key="likedUser._id">{{ likedUser.nickname }}</li>
          </ul>
        </div>
      </div>

      <div class="wrap_profile"></div>
    </div>

    <div class="comment">
      <CommentEditor :post="post" />

      <div class="comments" v-if="comments.length" ref="commentsEl">
        <h2>댓글 {{ comments.length }}개</h2>
        <ul>
          <CommentSlot v-for="comment in comments" :key="comment._id" :comment="comment" :post="post" />
        </ul>
      </div>
    </div>
  </div>
  <Dialog ref="Dialog"></Dialog>
</template>

<script>
import { defineComponent, ref, computed, onBeforeMount, onBeforeUpdate, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { debounce } from '../../common/util'
import dayjs from 'dayjs'
import CommentEditor from '../../components/CommentEditor.vue'
import CommentSlot from '../../components/slots/CommentSlot.vue'
import Dialog from '../../components/Dialog.vue'
import Markdown from 'vue3-markdown-it'
import MarkdownEmoji from 'markdown-it-emoji'
import PostInfoSlot from '../../components/slots/PostInfoSlot.vue'
import ToggleSlot from '../../components/slots/ToggleSlot.vue'

export default defineComponent({
  name: 'post',
  components: {
    Dialog,
    Markdown,
    CommentEditor,
    CommentSlot,
    PostInfoSlot,
    ToggleSlot,
  },
  setup() {
    const route = useRoute()
    const { push } = useRouter()
    const { state, dispatch } = useStore()
    
    const Dialog = ref(null)
    const plugins = ref([{ plugin: MarkdownEmoji }])

    const isOpen = ref(true) // Toggle display of the options when clicking
    const isLike = ref(false)

    const user = computed(() => state.auth.user)
    const post = computed(() => state.post.post)
    const likes = computed(() => state.post.likes)
    const likeCount = computed(() => state.post.likeCount)
    const comments = computed(() => state.comment.comments)

    const commentsEl = ref(null)

    const openOptionBtn = () => {
      isOpen.value = false
    }

    const closeOptionBtn = () => {
      isOpen.value = true
    }

    const updateLike = async () => {
      if (!user.value?._id) return alert('로그인 후 이용 가능합니다.')
      else {
        isLike.value = true
        await dispatch('post/updateLike', post.value._id)
      }
    }

    const deleteLike = async () => {
      if (!user.value?._id) return alert('로그인 후 이용 가능합니다.')
      else {
        isLike.value = false
        await dispatch('post/deleteLike', post.value._id)
      }
    }

    const onUpdateLike = debounce(updateLike, 200)
    const onDeleteLike = debounce(deleteLike, 200)

    const onUpdatePost = async () => {
      if (post.value._id) {
        push({ name: 'editor', params: post.value._id })
      }
    }

    const onDeletePost = async () => {
      const ok = await Dialog.value.show({ title: '게시물 삭제', message: '게시물을 삭제하시겠습니까?\n한번 삭제된 게시물은 되돌릴 수 없습니다.' })
      if (ok) await dispatch('post/deletePost', post.value._id)
    }

    const onCopyLink = async () => {
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert('클립보드에 복사되었습니다')
      } catch (err) {
        alert('링크 복사에 실패하였습니다.')
      }
    }

    onBeforeMount(async () => {
      if (route.query.id) {
        await dispatch('post/getPost', route.query.id)
        await dispatch('comment/getComments', route.query.id)
      } else {
        push({ name: 'home' })
      }
    })

    onMounted(() => {
      if (route.query.quickMove) {
        const y = commentsEl.value.offsetTop - document.querySelector('.headerWrap').offsetHeight - 33
        window.scrollTo({ top: y, behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    })

    onBeforeUpdate(() => {
      isLike.value = likes.value.includes(user.value._id)
      document.title = post.value?.title ?? 'Post'
    })

    return {
      dayjs,
      route,
      Dialog,
      plugins,
      isOpen,
      isLike,
      user,
      post,
      likes,
      likeCount,
      comments,
      commentsEl,
      openOptionBtn,
      closeOptionBtn,
      onUpdateLike,
      onDeleteLike,
      onUpdatePost,
      onDeletePost,
      onCopyLink,
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
            }

            .lock_ico {
              margin: 0 0 0 1.6rem;

              i {
                font-size: 2.4rem;
                color: var(--list_info);
              }
            }
          }
        }

        .wrap_info {
          display: flex;

          span {
            display: flex;
            align-items: center;
            position: relative;
            font-size: 1.3rem;
            color: var(--list_info-dark);
            margin: 0 2.4rem 0 0;
            padding: 0 0 0 2.4rem;

            &::before {
              content: '';
              position: absolute;
              left: 0;
              width: 0.01rem;
              height: 1.2rem;
              background-color: var(--border-dark);
            }

            &:first-child {
              padding: 0;

              &::before {
                display: none;
              }
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
        .toggle {
          .btn_toggle > i {
            font-size: 2.4rem;
            color: var(--list_info);
          }

          ul {
            display: none;
          }
        }
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
        margin: 0 0 2.4rem 0;

        span {
          color: var(--list_info);
          font-size: 1.6rem;
        }

        .like_ico {
          margin-right: 0.8rem;
          cursor: pointer;

          i {
            font-size: 2.8rem;
            color: var(--list_info-light);
          }
        }
      }
    }
  }

  .comment {
    .comments {
      margin: 8.6rem 0 0;

      h2 {
        color: var(--list_info-dark);
        font-weight: 400;
        font-size: 1.6rem;
      }
    }
  }
}
</style>
