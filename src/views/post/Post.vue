<template>
  <div class="post" v-if="post">
    <div class="wrap_header">
      <div class="wrap_left">
        <!-- Post Title -->
        <div class="wrap_title">
          <div class="title">
            <h2>{{ post.title }}</h2>
            <span v-if="!post.isPublic" class="ico_lock">
              <Ico :svg="'lock'" :color="'var(--text2)'" />
            </span>
          </div>
        </div>

        <!-- Post Info -->
        <div class="wrap_info">
          <Info>
            <template #createdAt>
              <li><span class="createdAt">{{ getTime(post.createdAt) }}</span></li>
            </template>
            <template #category>
              <li><span class="category">{{ post.category }}</span></li>
            </template>
          </Info>
        </div>
      </div><!-- wrap_left end -->

      <div class="wrap_right">
        <Button class="btn_dropbox" :size="'sm'" :svg="'more'" @click="$refs.KEBAB_EL.onToggle()" />
        <Kebab ref="KEBAB_EL" :dropboxItems="!auth ? { '링크 복사': onCopyLink } : { '글 수정': onUpdatePost, '글 삭제': onDeletePost, '링크 복사': onCopyLink }" />
      </div><!-- wrap_right end -->
    </div><!-- wrap_header end -->

    <!-- Post Content -->
    <div class="content" ref="CONTENT_EL">
      <markdown class="markdown" :source="post.content" :plugins="plugins" :breaks="true" :xhtmlOut="true" :typographer="true" />
    </div>

    <!-- Post Likes -->
    <div class="wrap_like">
      <div class="liked_count">
        <Ico class="ico_like" :svg="'like-fill'" :color="!post.liked ? 'var(--disable)' : 'var(--likeActive)'" @click="onUpdateLike" />
        <span>{{ post.likeCount }}</span>
      </div>
    </div>

    <!-- Author Profile -->
    <div class="wrap_author">
      <User :profile="post.author" />
      <router-link v-if="post.author" :to="{ name: 'profile', params: { nickname: post.author.nickname } }" class="a_link"> 프로필 보러가기 </router-link>
    </div>

    <!-- Link to another Post -->
    <div class="wrap_link">
      <div v-for="linkedPost in post.linkedPosts" :key="linkedPost?._id" class="link">
        <span v-if="linkedPost.rel === 'prev'">이전글</span>
        <span v-else>다음글</span>
        <Button class="btn_link" @click="onPushPost(linkedPost._id)"> {{ linkedPost.title }} </Button>
      </div>
    </div>

    <!-- TOC -->
    <Teleport to="#content">
      <div class="wrap_toc">
        <ul class="toc">
          <li v-for="item in toc" :key="item">
            <a
              :id="item.getAttribute('id')"
              :href="'#' + item.getAttribute('id')"
              class="a_toc_item"
              ref="TOC_EL"
              :style="item.tagName === 'H2' ? { marginLeft: '0.8rem' } : item.tagName === 'H3' ? { marginLeft: '1.6rem' } : ''"
              >{{ item.innerText }}</a>
          </li>
        </ul>
      </div>
    </Teleport>
  </div><!-- Post end -->

  <div class="comment">
    <!-- Comments Editor -->
    <CommentEditor :postId="postId" />

    <!-- Comments -->
    <div class="comments" ref="COMMENTS_EL">
      <h2>댓글 {{ $store.state.comment.commentCount }}개</h2>

      <ul class="comment_items">
        <Comment 
          v-for="comment in $store.state.comment.comments"
          :key="comment._id"
          :comment="comment"
          :postId="postId"
          :author="post.author?._id"
          :userId="$store.state.auth.id"
        />
      </ul>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, computed, nextTick, watch, onErrorCaptured, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Markdown from 'vue3-markdown-it'
import MarkdownEmoji from 'markdown-it-emoji'
import CommentEditor from '../../components/CommentEditor.vue'
import Comment from '../../components/Comment.vue'
import User from '../../components/User.vue'
import Info from '../../components/slots/Info.vue'
import { getTime } from '../../common/time'

const props = defineProps({
  postId: {
    type: String,
    required: true,
  },
})

const { state, dispatch, commit } = useStore()
const { push } = useRouter()

const plugins = [{ plugin: MarkdownEmoji }]

const DIALOG_EL = inject('DIALOG_EL')
const TOAST_EL = inject('TOAST_EL')

const CONTENT_EL = ref(null)
const COMMENTS_EL = ref(null)
const TOC_EL = ref(null)

const toc = ref(null)
const observedEl = ref(new Map())
const intersectEl = ref([])

const auth = computed(() => state.auth.id && post.value.author?._id === state.auth.id)
const post = computed(() => state.post.post)

const onPushPost = (_id) => {
  if (_id) push({ name: 'post', params: { postId: _id } })
}

const onUpdatePost = () => {
  if (post.value._id) push({ name: 'editor', query: { postId: post.value._id } })
}

const onDeletePost = async () => {
  const ok = await DIALOG_EL.value.show({
    title: '게시물 삭제',
    message: '게시물을 삭제하시겠습니까?\n한번 삭제된 게시물은 되돌릴 수 없습니다.',
  })
  if (ok) {
    const { main, sub } = post.value.menu
    const { success, error } = await dispatch('post/deletePost', {
      postId: post.value._id,
      authorId: post.value?.author?._id,
    })

    if (!success) return TOAST_EL.value.open('error', error)

    push({ name: 'posts', params: { main, sub } })
  }
}

const onUpdateLike = async () => {
  const { success, error } = !post.value.liked
    ? await dispatch('post/updateLike', { postId: post.value._id })
    : await dispatch('post/deleteLike', { postId: post.value._id })

  if (!success) TOAST_EL.value.open('error', error)
}

const onCopyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    TOAST_EL.value.open('success', '클립보드에 게시물 링크가 복사되었습니다')
  } catch {
    TOAST_EL.value.open('error', '링크 복사에 실패하였습니다.')
  }
}

const callback = (entries, observer) => {
  entries.map((entry) => {
    if (entry.isIntersecting) {
      observedEl.value.set(entry.target.id, entry)
      intersectEl.value = [...observedEl.value.values()].filter((el) => el && el.isIntersecting)
      TOC_EL.value.forEach((el) => el.classList.remove('on'))
      if (intersectEl.value.length) {
        TOC_EL.value.find((el) => el.getAttribute('id') === intersectEl.value[0].target.id).classList.add('on')
      }
    } else {
      const idx = intersectEl.value.findIndex((el) => el.target.id === entry.target.id)
      if (idx !== -1) intersectEl.value.splice(idx, 1)
      observedEl.value.set(entry.target.id, entry)
      TOC_EL.value.forEach((el) => el.classList.remove('on'))
      if (intersectEl.value.length) {
        TOC_EL.value.find((el) => el.getAttribute('id') === intersectEl.value[0].target.id).classList.add('on')
      }
    }
  })
}

const observer = new IntersectionObserver(callback, { threshold: 0.7, rootMargin: '-114px 0px 0px 0px' })

watch(
  props,
  async () => {
    const { success, error } = await dispatch('post/getPost', { postId: props.postId })
    if (!success) throw new Error(error)

    const { success: success2, error: error2 } = await dispatch('comment/getComments', { postId: props.postId })
    if (!success2) throw new Error(error2)
  },
  { immediate: true },
)

watch(
  post,
  async () => {
    await nextTick()
    
    let tocElements = CONTENT_EL.value?.querySelectorAll('h1, h2, h3')
    observer.disconnect()
    observedEl.value.clear()
    intersectEl.value = []

    if (tocElements?.length) {
      tocElements.forEach((el) => {
        el.style.scrollMarginTop = '11.4rem'
        toc.value = Array.from(tocElements).map((el) => el)
        observedEl.value.set(el.getAttribute('id'), null)
        observer.observe(el)
      })
    }

    document.title = post.value?.title
  },
  { flush: 'post' }
)

onErrorCaptured((err) => {
  TOAST_EL.value.open('error', err)
  return true
})

onMounted(() => {
  if (state.post.quickMove && COMMENTS_EL.value) {
    COMMENTS_EL.value.scrollIntoView({ behavior: 'smooth' })
    commit('post/SET_QUICKMOVE', false)
  }
})

onUnmounted(() => {
  commit('post/SET_POST', {})
  commit('comment/SET_COMMENTS', [])
  observer.disconnect()
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.post {
  .wrap_header {
    display: flex;

    .wrap_left {
      display: flex;
      flex-direction: column;
      flex-basis: 80%;
      padding: 0 0 0 2.4rem;
      border-left: 1px solid var(--primary);

      .wrap_title {
        margin-bottom: 2.4rem;
        .title {
          display: flex;
          flex-direction: row;
          align-items: center;

          h2 {
            font-size: 2rem;
            color: var(--text4);
            font-weight: 400;
            overflow: hidden;
            white-space: normal;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            white-space: pre-wrap;
          }

          .ico_lock {
            margin: 0 0 0 1.6rem;
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
    color: var(--text3);
    line-height: 1.5;

    h1,
    h2,
    h3 {
      margin-top: 11.4rem;
    }

    .markdown {
      p {
        box-sizing: border-box;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .wrap_like {
    display: flex;
    flex-direction: column;
    align-items: center;

    .liked_count {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border3);
      border-radius: 3.2rem;
      padding: 0.6rem 1.2rem;

      span {
        color: var(--text2);
        font-size: 1.2rem;
      }

      .ico_like {
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
          color: var(--text3);
          margin: 0.8rem 0 0;
        }
      }
    }
  }

  .wrap_author {
    position: relative;
    margin: 6.4rem 0 0;

    &:deep(.user-info) {
      .wrap_avatar {
        .avatar {
          width: 9.6rem;
          height: 9.6rem;

          @include mobile {
            width: 6.4rem;
            height: 6.4rem;
          }
        }
      }
      .wrap_nickname_greetings {
        color: var(--text3);
        .nickname {
          font-size: 1.6rem;
          font-weight: 500;
          width: 10rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
          color: var(--text3);
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
          color: var(--text3);

          @include mobile {
            -webkit-line-clamp: 1;
          }
        }
      }
    }

    .a_link {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 1.4rem;
      text-decoration: underline;
      color: var(--primary);
      margin: 0.3rem 0 0;
    }
  }

  .wrap_link {
    margin: 4.8rem 0 4.8rem;
    border-top: 1px solid var(--border2);

    .link {
      display: flex;
      padding: 1.6rem 0;
      width: 100%;

      &:first-child,
      &:last-child {
        border-bottom: 1px solid var(--border2);
      }

      span {
        font-size: 1.4rem;
        margin: 0 1.2rem 0 0;
        color: var(--primary);
        font-weight: 500;
        min-width: 4rem;
      }

      .btn_link {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 1.4rem;
      }
    }
  }
}

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
