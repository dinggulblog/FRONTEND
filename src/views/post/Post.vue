<template>
  <div class="wrap_post_comment">
    <div class="post" v-if="post._id">
      <div class="wrap_header">
        <div class="wrap_left">
          <div class="wrap_title">
            <div class="title">
              <h2>{{ post.title }}</h2>
              <span v-if="!post.isPublic" class="lock_ico"><Ico :size="'md'" :svg="'lock'" /></span>
            </div>
          </div>

          <div class="wrap_info">
            <PostInfoSlot :post="post" />
          </div>
        </div>
        <div class="wrap_right">
          <DropboxSlot :dropboxItems="{ '글 수정': onUpdatePost, '글 삭제': onDeletePost, '링크 복사': onCopyLink }" />
        </div>
      </div>

      <div class="content">
        <markdown
          class="markdown"
          :source="post.content"
          :plugins="plugins"
          :breaks="true"
          :xhtmlOut="true"
          :typographer="true"
        />
      </div>

      <div class="wrap_like">
        <div class="liked_count">
          <span class="like_ico" @click="onChangeLike">
            <Ico :size="'lg'" :svg="'like-fill'" :customColor="!isLike ? '#ddd' : 'var(--likeActive)'" />
          </span>
          <span>{{ likeCount }}</span>
        </div>
        <!--
        <div class="liked_user">
          <ul>
            <li v-for="likedUser in likes" :key="likedUser._id">
              <img
                :src="likedUser.avatar === null ? DEFAULT_AVATAR_64 : `${IMAGE_URL}${likedUser.avatar.serverFileName}`"
              />
              <span>{{ likedUser.nickname }}</span>
            </li>
          </ul>
        </div>
        -->
      </div>

      <div class="wrap_author">
        <AuthorSlot :user="post.author" />
        <router-link :to="{ name: 'profile', params: { nickname: post.author.nickname } }" class="a_link">
          프로필 보러가기
        </router-link>
      </div>
    </div>

    <div class="comment">
      <CommentEditor :post="post" />

      <div class="comments" v-if="comments.length" ref="COMMENTS_EL">
        <h2>댓글 {{ comments.length }}개</h2>
        <ul class="comment_items">
          <CommentSlot
            v-for="comment in comments"
            :key="comment._id"
            :comment="comment"
            :post="post"
            :isAuthorized="onGetAuthorized(comment)"
          />
        </ul>
      </div>
    </div>
  </div>
  <Dialog ref="Dialog"></Dialog>
</template>

<script>
  import { defineComponent, ref, computed, onBeforeMount, onBeforeUpdate, onUnmounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useStore } from 'vuex'
  import { debounce } from '../../common/util'
  import dayjs from 'dayjs'
  import CommentEditor from '../../components/CommentEditor.vue'
  import CommentSlot from '../../components/slots/CommentSlot.vue'
  import AuthorSlot from '../../components/slots/AuthorSlot.vue'
  import Dialog from '../../components/Dialog.vue'
  import Markdown from 'vue3-markdown-it'
  import MarkdownEmoji from 'markdown-it-emoji'
  import PostInfoSlot from '../../components/slots/PostInfoSlot.vue'
  import DropboxSlot from '../../components/slots/DropboxSlot.vue'
  import DEFAULT_AVATAR_64 from '../../assets/defalut_avatar_64.png'

  export default defineComponent({
    name: 'post',
    components: {
      Dialog,
      Markdown,
      CommentEditor,
      CommentSlot,
      PostInfoSlot,
      AuthorSlot,
      DropboxSlot,
    },
    setup() {
      const route = useRoute()
      const { push } = useRouter()
      const { state, dispatch, commit } = useStore()

      const Dialog = ref(null)
      const COMMENTS_EL = ref(null)
      const plugins = ref([{ plugin: MarkdownEmoji }])

      const isLike = ref(false)

      const user = computed(() => state.auth.user)
      const post = computed(() => state.post.post)
      const likes = computed(() => state.post.likes)
      const likeCount = computed(() => state.post.likeCount)
      const comments = computed(() => state.comment.comments)
      const IMAGE_URL = ref(process.env.VUE_APP_IMAGE_URL)

      const onChangeLike = debounce(async () => {
        if (!user.value?._id) return alert('로그인 후 이용 가능합니다.')

        if (!isLike.value) await dispatch('post/updateLike', { postId: post.value._id, user: user.value })
        else await dispatch('post/deleteLike', { postId: post.value._id, user: user.value })
      }, 200)

      const onUpdatePost = () => {
        if (post.value._id) {
          push({ name: 'editor', query: { id: post.value._id } })
        }
      }

      const onDeletePost = async () => {
        const ok = await Dialog.value.show({
          title: '게시물 삭제',
          message: '게시물을 삭제하시겠습니까?\n한번 삭제된 게시물은 되돌릴 수 없습니다.',
        })
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

      const onGetAuthorized = (comment) => {
        if (comment.isPublic) {
          return true
        } else if (user.value && post.value.author?.nickname === user.value.nickname) {
          return true
        } else if (user.value && comment.commenter.nickname === user.value.nickname) {
          return true
        }
        return false
      }

      onBeforeMount(async () => {
        if (route.query.id) {
          await dispatch('post/getPost', route.query.id)
          await dispatch('comment/getComments', route.query.id)
        } else {
          push({ name: 'home' })
        }

        if (route.query.quickMove && comments.value.length) {
          const y = COMMENTS_EL.value.offsetTop - document.querySelector('#header').offsetHeight - 32
          window.scrollTo({ top: y, behavior: 'smooth' })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }

        document.title = post.value?.title ?? 'Post'
      })

      onBeforeUpdate(() => {
        isLike.value = likes.value.some((likeuser) => likeuser._id === user.value._id)
      })

      onUnmounted(() => {
        commit('post/SET_POST')
      })

      return {
        dayjs,
        Dialog,
        COMMENTS_EL,
        plugins,
        isLike,
        user,
        post,
        likes,
        likeCount,
        comments,
        IMAGE_URL,
        DEFAULT_AVATAR_64,
        onChangeLike,
        onUpdatePost,
        onDeletePost,
        onCopyLink,
        onGetAuthorized,
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
