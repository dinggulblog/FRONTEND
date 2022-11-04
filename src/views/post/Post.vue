<template>
  <div class="wrap_post_comment">
    <div class="post">
      <div class="wrap_header">
        <div class="wrap_left">
          <div class="wrap_title">
            <div class="title">
              <h2>{{ post.title }}</h2>
              <span class="lock_ico"><i class="material-icons"> lock </i></span>
            </div>
          </div>

          <div class="wrap_info">
            <span class="nickname">{{ post.author?.nickname }}</span>
            <span class="createdAt" v-text="dayjs(post.createdAt).format('YYYY년 M월 D일')"></span>
            <span class="category">{{ post.category }}</span>
          </div>
        </div>
        <div class="wrap_right">
          <div class="toggle">
            <button class="btn_toggle"><i class="material-icons">more_horiz</i></button>
            <ul class="toggle_items">
              <li v-if="post.author?.nickname === user.nickname"><router-link :to="{ name: 'editor', params: { id: post._id } }">수정</router-link></li>
              <li v-if="post.author?.nickname === user.nickname" @click="onDelete">삭제</li>
              <li @click="onCopyLink">링크 복사</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="content">
        <markdown class="markdown" :source="post.content" :plugins="plugins" :breaks="true" :xhtmlOut="true" :typographer="true" />
      </div>

      <div class="wrap_like">
        <div class="liked_count">
          <span class="like_ico"><i class="material-icons">favorite</i></span>
          <span>{{ post.likeCount }}</span>
        </div>
        <div class="liked_user">
          <ul>
            <li v-for="like in post.likes" :key="like">{{ like }}</li>
          </ul>
        </div>
      </div>

      <div class="wrap_profile"></div>
    </div>

    <div class="comment">
      <CommentEditor :curRouteParams="params" :pid="post._id" />

      <div class="comments" v-if="comments.length" ref="commentsEl">
        <h2>댓글 {{ comments.length }}개</h2>
        <ul>
          <CommentSlot v-for="comment in comments" :key="comment._id" :comment="comment" :curRouteParams="params" :pid="post._id" />
        </ul>
      </div>
    </div>
  </div>
  <Dialog ref="Dialog"></Dialog>
</template>

<script>
import { defineComponent, ref, computed, onBeforeMount, onBeforeUpdate, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { debounce } from '../../common/util'
import dayjs from 'dayjs'
import CommentEditor from '../../components/CommentEditor.vue'
import CommentSlot from '../../components/CommentSlot.vue'
import Dialog from '../../components/Dialog.vue'
import Markdown from 'vue3-markdown-it'
import MarkdownEmoji from 'markdown-it-emoji'

export default defineComponent({
  name: 'post',
  components: {
    Dialog,
    Markdown,
    CommentEditor,
    CommentSlot,
  },
  setup() {
    const { state, getters, dispatch } = useStore()
    const { currentRoute, push, go } = useRouter()
    const {
      value: { params },
    } = currentRoute

    const Dialog = ref(null)
    const plugins = ref([{ plugin: MarkdownEmoji }])

    const isHide = ref(true) // Toggle display the options when clicking
    const isLike = ref(false)

    const user = computed(() => state.auth.user)
    const post = computed(() => state.post.post)
    const comments = computed(() => state.comment.comments)

    const commentsEl = ref(null)

    const toggleOptionBtn = () => {
      isHide.value = !isHide.value
    }

    const closeOptionBtn = () => {
      isHide.value = true
    }

    const onUpdateLike = async () => {
      if (!user.value.id) return alert('로그인 후 이용 가능합니다.')
      isLike.value = !isLike.value
      isLike.value ? await dispatch('post/updateLike', post.value._id) : await dispatch('post/deleteLike', post.value._id)
    }

    const onUpdateDebounce = debounce(onUpdateLike, 200)

    const onDelete = async () => {
      const ok = await Dialog.value.show({ title: '게시물 삭제', message: '게시물을 삭제하시겠습니까?\n한번 삭제된 게시물은 되돌릴 수 없습니다.' })
      if (ok) {
        const response = await dispatch('post/deletePost', post.value._id)
        response.success ? push({ name: 'posts', params: { title: params.title, subject: params.subject ? params.subject : undefined } }) : alert(`Cannot delete post (Server error ${response.message})`)
      }
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
      const response = await dispatch('post/getPost', params.id)

      if (response.success) {
        if (params.quickMoveComments) {
          //let y = commentsEl.value.offsetTop - document.querySelector('.headerWrap').offsetHeight - 33
          //window.scrollTo({ top: y, behavior: 'smooth' })
        } else {
          //window.scrollTo({ top: 0, behavior: 'smooth' })
        }
        isLike.value = [...post.value.likes].includes(user.value.id)
      } else {
        go(-1)
      }
    })

    onBeforeUpdate(() => {
      document.title = post.value.title ?? 'Post'
    })

    onMounted(() => {
      console.log(comments.value)
    })

    return {
      dayjs,
      params,
      Dialog,
      plugins,
      isHide,
      isLike,
      user,
      post,
      comments,
      commentsEl,
      toggleOptionBtn,
      closeOptionBtn,
      onUpdateDebounce,
      onDelete,
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
