<template>
  <div class="post-container">
    <!-- Post body -->
    <div class="post">
      <!-- Post contents -->
      <div class="contents">
        <h2>{{ post.title }} - {{ post.postNum }}</h2>
        <markdown class="markdown" :source="post.content" :plugins="plugins" :breaks="true" :xhtmlOut="true" :typographer="true" />
      </div>

      <!-- Post infomations -->
      <div class="info">
        <span v-if="post.author">
          <div class="profile"></div>
          <router-link :to="{ name: 'profile', params: { nickname: post.author.nickname } }">{{ post.author.nickname }}</router-link>
        </span>
        <span></span>
        <span v-text="dayjs(post.createdAt).format('YYYY년 M월 D일')"></span>
        <span></span>
        <span>
          <i class="material-icons" :style="[isLike ? { color: 'var(--likeActive)' } : { color: 'var(--like)' }]" @click="onUpdateDebounce">favorite</i>
          {{ post.likeCount }}
        </span>
        <span v-if="!post.isPublic"></span>
        <span v-if="!post.isPublic"><i class="material-icons"> lock </i></span>
        <div class="option">
          <button @click="toggleOptionBtn"><i class="material-icons">more_horiz</i></button>
          <ul v-if="!isHide">
            <li v-if="post.author.nickname === user.nickname"><router-link :to="{ name: 'editor', params: { id: post._id } }">수정</router-link></li>
            <li v-if="post.author.nickname === user.nickname" @click="onDelete">삭제</li>
            <li @click="onCopyLink">링크 복사</li>
          </ul>
        </div>
      </div>

      <!-- Pagenation
      <div class="page">
        <Pagenation />
      </div>
       -->
    </div>

    <!-- Comments body -->
    <div class="comment">
      <CommentEditor :curRouteParams="params" :pid="post._id" />

      <!-- Comment contents -->
      <div class="comments" v-if="comments.length" ref="commentsEl">
        <h2>댓글 {{ comments.length }}개</h2>
        <ul v-for="comment in comments" :key="comment._id">
          <CommentItem :comment="comment" :curRouteParams="params" :pid="post._id" :postAuthor="post.author.nickname" />
        </ul>
      </div>
    </div>
  </div>
  <Dialog ref="Dialog"></Dialog>
</template>

<script>
import { defineComponent, ref, computed, onBeforeMount, onBeforeUpdate } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { debounce } from '../../common/util'
import dayjs from 'dayjs'
import CommentEditor from '../../components/CommentEditor.vue'
import CommentItem from '../../components/CommentItem.vue'
import Dialog from '../../components/Dialog.vue'
import Markdown from 'vue3-markdown-it'
import MarkdownEmoji from 'markdown-it-emoji'

export default defineComponent({
  name: 'post',
  components: {
    Dialog,
    Markdown,
    CommentEditor,
    CommentItem,
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
      document.title = post.value.title
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
.post-container {
  display: grid;
  grid-template-rows: repeat(2, auto);

  .post {
    display: grid;
    grid-template-rows: repeat(5, auto);
    color: var(--primary);

    .contents {
      grid-row: 1 / 2;

      h2 {
        font-size: 2.4rem;
        letter-spacing: normal;
      }

      .markdown {
        margin: 4.8rem 0;
        line-height: 2.8rem;
        color: var(--secondary);
        letter-spacing: normal;
      }
    }

    .info {
      grid-row: 2 / 3;
      display: grid;
      grid-template-columns: auto auto auto auto auto auto auto 1fr;
      align-items: center;
      gap: 0 1.6rem;
      color: var(--sub);
      margin-bottom: 4.8rem;

      span:nth-child(1) {
        grid-column: 1 / 2;
        font-size: 1.4rem;
        display: flex;
        align-items: center;
        font-weight: 700;

        a {
          color: var(--sub);
        }

        .profile {
          background: #fff;
          border-radius: 50%;
          width: 3.2rem;
          height: 3.2rem;
          margin-right: 1.4rem;
          background: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnI3Ftw4ttKq1OERD38V3Z6Y65RvY9pSwkIw&usqp=CAU');
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
        }
      }

      span:nth-child(2) {
        grid-column: 2 / 3;
        border-left: 0.1rem solid var(--line);
        height: 1.2rem;
      }

      span:nth-child(3) {
        grid-column: 3 / 4;
        font-size: 1.4rem;
      }

      span:nth-child(4) {
        grid-column: 4 / 5;
        border-left: 0.1rem solid var(--line);
        height: 1.2rem;
      }

      span:nth-child(5) {
        grid-column: 5 / 6;
        display: grid;
        grid-template-columns: repeat(2, auto);
        align-items: center;
        font-size: 1.4rem;

        i {
          margin-right: 0.8rem !important;
          cursor: pointer;
          transition: color 0.5s linear;
          color: var(--like);
          font-size: 1.8rem;
        }
      }

      span:nth-child(6) {
        grid-column: 6 / 7;
        border-left: 0.1rem solid var(--line);
        height: 1.2rem;
      }

      span:nth-child(7) {
        grid-column: 7 / 8;
        display: grid;
        align-items: center;

        i {
          font-size: 1.8rem;
          color: var(--sub);
        }
      }

      div.option {
        grid-column: 8 / 9;
        justify-self: end;
        position: relative;

        button {
          display: grid;
          place-content: center;
          color: var(--primary);

          i {
            margin: 0;
          }
        }

        ul {
          position: absolute;
          right: 0;
          top: 3.2rem;
          z-index: 10;
          padding: 2.4rem;
          background: #fff;
          border: 0;
          box-shadow: 0 0 2.4rem 0.3rem rgba(0, 0, 0, 0.15);
          width: 10rem;

          li {
            border: 0;
            margin: 0;
            color: var(--primary);
            font-size: 1.2rem;
            font-weight: 500;
            display: grid;
            justify-content: center;
            cursor: pointer;

            a {
              color: var(--primary);
            }
          }

          li:nth-child(2) {
            margin: 1.6rem 0;
          }
        }
      }
    }

    .tags {
      grid-row: 3 / 4;
      margin-top: 2.4rem;

      ul {
        display: inline-grid;
        margin-right: 0.8rem;
        padding: 0.3rem 1.2rem 0.5rem;
        border: 1px solid #dadada;
        color: var(--point);
        font-size: 1.2rem;
        border-radius: 2.8rem;
        list-style: none;
      }
    }

    .page {
      grid-row: 4 / 5;
      display: grid;
      grid-template-columns: auto 1fr auto;
      border-top: 1px solid var(--line);
      margin: 4.8rem 0;
      padding: 4.8rem 0 0;
      color: var(--primary);
      font-size: 1.4rem;
      font-weight: 500;

      button {
        display: grid;
        grid-template-columns: repeat(2, auto);
        align-items: center;
      }

      button:nth-child(1) {
        grid-column: 1 / 2;
      }

      button:nth-child(2) {
        grid-column: 2 / 3;
        justify-self: end;

        i {
          margin: 0 0 0 1.6rem;
        }
      }
    }
  }

  .comment {
    display: grid;
    grid-template-rows: repeat(2, auto);
    margin-bottom: 8rem;

    .comments {
      color: var(--primary);
      margin: 6.4rem 0 0;

      h2 {
        font-size: 1.6rem;
        padding: 0 0 4rem;
        font-weight: 500;
      }
    }
  }
}
</style>
