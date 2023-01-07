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
        <Button
          class="btn_dropbox"
          tabindex="-1"
          :size="'sm'"
          :svg="'more'"
          :customColor="`var(--list_info)`"
          :customPadding="'0'"
          @click="onAction"
        />

        <ActionSlot
          ref="DROPBOX_SLOT_EL"
          :dropboxItems="{ '글 수정': onUpdatePost, '글 삭제': onDeletePost, '링크 복사': onCopyLink }"
        />
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
          <Ico :size="'lg'" :svg="'like-fill'" :customColor="!liked ? '#ddd' : 'var(--likeActive)'" />
        </span>
        <span>{{ likeCount ? likeCount : '0' }}</span>
      </div>
    </div>

    <div class="wrap_author">
      <AuthorSlot :profile="post.author" />
      <router-link :to="{ name: 'profile', params: { nickname: post.author.nickname } }" class="a_link">
        프로필 보러가기
      </router-link>
    </div>

    <div class="wrap_link">
      <div v-for="linkedPost in post.linkedPosts" :key="linkedPost" class="link">
        <span v-if="linkedPost.rel === 'prev'">이전글</span>
        <span v-else>다음글</span>
        <Button
          class="btn_link"
          :content="linkedPost.title"
          :customFontSize="'1.4rem'"
          :customPadding="'0'"
          @click="onPushPost(linkedPost._id)"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { defineComponent, ref, computed, watch, onBeforeUpdate } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  import { debounce } from '../common/util.js'
  import dayjs from 'dayjs'
  import Markdown from 'vue3-markdown-it'
  import MarkdownEmoji from 'markdown-it-emoji'
  import ActionSlot from './slotdata/ActionSlot.vue'
  import AuthorSlot from './slotdata/AuthorSlot.vue'
  import PostInfoSlot from './slotdata/PostInfoSlot.vue'
  import DEFAULT_AVATAR_64 from '../assets/default_avatar_64.webp'

  export default defineComponent({
    components: {
      Markdown,
      ActionSlot,
      AuthorSlot,
      PostInfoSlot,
    },
    props: {
      post: {
        type: Object,
        required: true,
      },
      profile: {
        type: Object,
        required: true,
      },
    },
    setup(props, { emit }) {
      const { push } = useRouter()
      const { state, dispatch } = useStore()

      const plugins = ref([{ plugin: MarkdownEmoji }])

      const liked = ref(false)
      const likes = computed(() => state.post.likes)
      const likeCount = computed(() => state.post.likeCount)

      const prevPost = ref(null)
      const nextPost = ref(null)

      const DROPBOX_SLOT_EL = ref(null)

      const onAction = () => {
        DROPBOX_SLOT_EL.value.onToggle()
      }

      const onChangeLike = debounce(async () => {
        if (!props.profile._id) return alert('로그인 후 이용 가능합니다.')

        if (!liked.value) await dispatch('post/updateLike', { postId: props.post._id, userId: props.profile._id })
        else await dispatch('post/deleteLike', { postId: props.post._id, userId: props.profile._id })
      }, 200)

      const onUpdatePost = () => {
        if (props.post._id) push({ name: 'editor', query: { id: props.post._id } })
      }

      const onDeletePost = () => {
        if (props.post._id) emit('onDeletePost')
      }

      const onPushPost = (postId) => {
        if (postId) push({ name: 'post', query: { id: postId } })
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
        if (likes.value) liked.value = likes.value.some((likedUserId) => likedUserId === props.profile._id)
      })

      return {
        dayjs,
        plugins,
        liked,
        likes,
        likeCount,
        prevPost,
        nextPost,
        DROPBOX_SLOT_EL,
        DEFAULT_AVATAR_64,
        onAction,
        onChangeLike,
        onUpdatePost,
        onDeletePost,
        onPushPost,
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

      .markdown > p {
        box-sizing: border-box;
      }

      .markdown > p > img {
        width: 100%;
        height: 100%;
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

    .wrap_link {
      margin: 4.8rem 0 4.8rem;
      border-top: 1px solid #e5e5e5;

      .link {
        display: flex;
        padding: 1.6rem 0;

        &:first-child,
        &:last-child {
          border-bottom: 1px solid #e5e5e5;
        }
      }

      span {
        font-size: 1.4rem;
        margin: 0 1.4rem 0 0;
        color: var(--primary-dark);
        font-weight: 500;
      }
    }

    .wrap_author {
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
