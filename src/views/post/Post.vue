<template>
  <div v-if="postError">
    {{ postError }}
  </div>

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
          <PostInfoSlot :post="post" />
        </div>
      </div>
      <div class="wrap_right">
        <Button
          class="btn_dropbox"
          :size="'sm'"
          :svg="'more'"
          @click="$refs.ACTION_SLOT_EL.onToggle()"
        />

        <Action
          ref="ACTION_SLOT_EL"
          :dropboxItems="!auth ? { '링크 복사': onCopyLink } : { '글 수정': onUpdatePost, '글 삭제': onDeletePost, '링크 복사': onCopyLink }"
        />
      </div>
    </div>

    <!-- Post Content -->
    <div class="content" ref="CONTENT_EL">
      <markdown
        class="markdown"
        :source="post.content"
        :plugins="plugins"
        :breaks="true"
        :xhtmlOut="true"
        :typographer="true"
      />
    </div>

    <!-- Post Likes -->
    <div class="wrap_like">
      <div class="liked_count">
        <Ico class="ico_like" :size="'lg'" :svg="'like-fill'" :color="!post.liked ? 'var(--disable)' : 'var(--likeActive)'" @click="onUpdateLike"/>
        <span>{{ post.likeCount }}</span>
      </div>
    </div>

    <!-- Author Profile -->
    <div class="wrap_author">
      <User :profile="post.author" />
      <router-link :to="{ name: 'profile', params: { nickname: post.author.nickname } }" class="a_link">
        프로필 보러가기
      </router-link>
    </div>

    <!-- Link to another Post -->
    <div class="wrap_link">
      <div v-for="linkedPost in post.linkedPosts" :key="linkedPost?._id" class="link">
        <span v-if="linkedPost.rel === 'prev'">이전글</span>
        <span v-else>다음글</span>
        <Button
          class="btn_link"
          @click="onPushPost(linkedPost._id)"
        > {{ linkedPost.title }}
        </Button>
      </div>
    </div>


   <Teleport to="#content">
      <div class="wrap_toc">
        <ul class="toc">
            <li v-for="item in toc" :key="item">
              <a :id="item.getAttribute('id')" :href="'#' + item.getAttribute('id')" class="a_toc_item" ref="toc_EL" :style="item.tagName === 'H2' ? { marginLeft: '0.8rem' } : item.tagName === 'H3' ? { marginLeft : '1.6rem' } : ''">{{ item.innerText }}</a>
            </li>
        </ul>
      </div>
    </Teleport>

  </div>

  <div class="comment">
    <CommentEditor :postId="postId" />

    <div class="comments" ref="COMMENTS_EL">
      <h2>댓글 {{ commentCount }}개</h2>
      <ul class="comment_items" v-if="comments.length">
        <Comment
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
  import { inject, ref, computed, watch, onUnmounted } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  import CommentEditor from '../../components/CommentEditor.vue'
  import Comment from '../../components/Comment.vue'
  import Markdown from 'vue3-markdown-it'
  import MarkdownEmoji from 'markdown-it-emoji'
  import Action from '../../components/Action.vue'
  import User from '../../components/User.vue'
  import PostInfoSlot from '../../components/PostInfo.vue'

  const props = defineProps({
    postId: {
      type: String,
      required: true,
      default: '',
    },
  })

  const { state, dispatch, commit } = useStore()
  const { push } = useRouter()

  const plugins = ref([{ plugin: MarkdownEmoji }])

  const DIALOG_EL = inject('DIALOG_EL')
  const TOAST_EL = inject('TOAST_EL')

  const CONTENT_EL = ref(null)
  const COMMENTS_EL = ref(null)
  const toc_EL = ref(null)
  const postError = ref(null)
  const commentsError = ref(null)

  const quickMove = computed(() => state.post.quickMove)
  const post = computed(() => state.post.post)
  const author = computed(() => state.post.post?.author?._id)
  const userId = computed(() => state.auth.id)
  const comments = computed(() => state.comment.comments)
  const commentCount = computed(() => Number(state.comment.commentCount))

  const auth = computed(() => state.auth.id && (post.value?.author?._id === state.auth.id))

  const toc = ref(null)

  const onUpdatePost = () => {
    if (post.value?._id) push({ name: 'editor', query: { id: post.value?._id } })
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

  const onUpdateLike = async () => {
    
    const { success, error } = !post.value.liked
      ? await dispatch('post/updateLike', { postId: post.value._id })
      : await dispatch('post/deleteLike', { postId: post.value._id })

    if (!success) TOAST_EL.value.open('error', error)
  }

  
  const onPushPost = (postId) => {
    if (postId) push({ name: 'post', params: { postId: postId } })
  }

  const onCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert('클립보드에 복사되었습니다')
    } catch {
      alert('링크 복사에 실패하였습니다.')
    }
  }

  const observedEl = ref(new Map())
  const intersectEl = ref([])

  const callback = (entries, observer) => {
    entries.map((entry) => {
      if (entry.isIntersecting) {
        observedEl.value.set(entry.target.id, entry)
        intersectEl.value = [...observedEl.value.values()].filter((el) => el && el.isIntersecting)
        toc_EL.value.forEach((el) => el.style.color = `var(--text3)`)
        if(intersectEl.value.length) {
          toc_EL.value.find(el => el.getAttribute('id') === intersectEl.value[0].target.id).style.color = `var(--primary)`
        }
        
      } else {
        const idx = intersectEl.value.findIndex(el => el.target.id === entry.target.id)
        if (idx !== -1) intersectEl.value.splice(idx, 1)
        observedEl.value.set(entry.target.id, entry)
        toc_EL.value.forEach((el) => el.style.color = `var(--text3)`)
        if(intersectEl.value.length) {
          toc_EL.value.find(el => el.getAttribute('id') === intersectEl.value[0].target.id).style.color = `var(--primary)`
        }        
      }
    })
  }

  const observer = new IntersectionObserver(callback, { threshold: 1, rootMargin: '-114px 0px 0px 0px' })

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

      observer.disconnect()

      observedEl.value.clear()
      intersectEl.value = []

      let tocElements = CONTENT_EL.value?.querySelectorAll('h1, h2, h3')
      
      if (tocElements && tocElements.length) {
          tocElements.forEach(el => {
          el.style.scrollMarginTop = '11.4rem'
          observer.observe(el)
          observedEl.value.set(el.getAttribute('id'), null)
          toc.value = Array.from(tocElements).map(el => el) 
        })
      }
      
    },
    { immediate: true }
  )

  onUnmounted(() => {
    commit('post/SET_POST', null)
    commit('comment/SET_COMMENTS', {})
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
      line-height: 2.2rem;

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

        span {
          color: var(--text2);
          font-size: 1.6rem;
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
          font-size:1.4rem;
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
