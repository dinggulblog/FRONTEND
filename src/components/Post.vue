<template>
  <div class="post" v-if="post._id">
    <div class="wrap_header">
      <div class="wrap_left">
        <div class="wrap_title">
          <div class="title">
            <h2>{{ post.title }}</h2>
            <span v-if="!post.isPublic" class="lock_ico">
              <Ico :size="'md'" :svg="'lock'" :customColor="'var(--list_info)'" />
            </span>
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
    </div>

    <div class="wrap_author">
      <AuthorSlot :user="post.author" />
      <router-link :to="{ name: 'profile', params: { nickname: post.author.nickname } }" class="a_link">
        프로필 보러가기
      </router-link>
    </div>
  </div>
</template>

<script>
  import { defineComponent, ref, computed, onBeforeUpdate } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  import { debounce } from '../common/util'
  import dayjs from 'dayjs'
  import AuthorSlot from './slots/AuthorSlot.vue'
  import Markdown from 'vue3-markdown-it'
  import MarkdownEmoji from 'markdown-it-emoji'
  import PostInfoSlot from './slots/PostInfoSlot.vue'
  import DropboxSlot from './slots/DropboxSlot.vue'
  import DEFAULT_AVATAR_64 from '../assets/default_avatar_64.png'

  export default defineComponent({
    name: 'post',
    components: {
      Markdown,
      PostInfoSlot,
      AuthorSlot,
      DropboxSlot,
    },
    props: {
      post: {
        type: Object,
      },
      user: {
        type: Object,
      },
    },
    setup(props, { emit }) {
      const { push } = useRouter()
      const { state, dispatch } = useStore()

      const plugins = ref([{ plugin: MarkdownEmoji }])

      const isLike = ref(false)

      const likes = computed(() => state.post.likes)
      const likeCount = computed(() => state.post.likeCount)
      const IMAGE_URL = ref(process.env.VUE_APP_IMAGE_URL)

      const onChangeLike = debounce(async () => {
        if (!props.user?._id) return alert('로그인 후 이용 가능합니다.')

        if (!isLike.value) await dispatch('post/updateLike', { postId: props.post._id, user: props.user })
        else await dispatch('post/deleteLike', { postId: props.post._id, user: props.user })
      }, 200)

      const onUpdatePost = () => {
        if (props.post._id) {
          push({ name: 'editor', query: { id: props.post._id } })
        }
      }

      const onDeletePost = () => {
        emit('onDeletePost')
      }

      const onCopyLink = async () => {
        try {
          await navigator.clipboard.writeText(window.location.href)
          alert('클립보드에 복사되었습니다')
        } catch (err) {
          alert('링크 복사에 실패하였습니다.')
        }
      }

      onBeforeUpdate(() => {
        isLike.value = likes.value.some((likeuser) => likeuser._id === props.user._id)
      })

      return {
        dayjs,
        plugins,
        isLike,
        likes,
        likeCount,
        IMAGE_URL,
        DEFAULT_AVATAR_64,
        onChangeLike,
        onUpdatePost,
        onDeletePost,
        onCopyLink,
      }
    },
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
              overflow: hidden;
              white-space: normal;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
              white-space: pre-wrap;
            }

            .lock_ico {
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

            @include mobile {
              width: 6.4rem;
              height: 6.4rem;
            }
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
        color: var(--secondary);
      }
    }
  }
</style>
