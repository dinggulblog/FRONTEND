<template>
  <div class="post" v-if="post">
    <div class="wrap_header">
      <div class="wrap_left">
        <!-- Post Title -->
        <div class="wrap_title">
          <div class="title">
            <h2>{{ post.title }}</h2>
            <span v-if="!post.isPublic" class="lock_ico">
              <Ico :size="'md'" :svg="'lock'" :customColor="'var(--text2)'" />
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
          size="sm"
          svg="more"
          :customColor="`var(--text2)`"
          :customPadding="'0'"
          @click="$refs.ACTION_SLOT_EL.onToggle()"
        />

        <ActionSlot 
          ref="ACTION_SLOT_EL"
          :dropboxItems="!auth ? { '링크 복사': onCopyLink } : { '글 수정': onUpdatePost, '글 삭제': onDeletePost, '링크 복사': onCopyLink }"
        />
      </div>
    </div>

    <!-- Post Content -->
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

    <!-- Post Likes -->
    <div class="wrap_like">
      <div class="liked_count">
        <span class="like_ico" @click="onUpdateLike">
          <Ico :size="'lg'" :svg="'like-fill'" :customColor="!post.liked ? 'var(--disable)' : 'var(--likeActive)'" />
        </span>
        <span>{{ post.likeCount }}</span>
      </div>
    </div>

    <!-- Author Profile -->
    <div class="wrap_author">
      <AuthorSlot :profile="post.author" />
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
          :content="linkedPost.title"
          :customFontSize="'1.4rem'"
          :customColor="'var(--text3)'"
          :customPadding="'0'"
          @click="onPushPost(linkedPost._id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { defineEmits, ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  import { throttle } from '../common/util.js'
  import Markdown from 'vue3-markdown-it'
  import MarkdownEmoji from 'markdown-it-emoji'
  import ActionSlot from './slotdata/ActionSlot.vue'
  import AuthorSlot from './slotdata/AuthorSlot.vue'
  import PostInfoSlot from './slotdata/PostInfoSlot.vue'

  const emits = defineEmits(['updateLike', 'deletePost'])

  const { push } = useRouter()
  const { state } = useStore()

  const plugins = ref([{ plugin: MarkdownEmoji }])

  const post = computed(() => state.post.post)
  const auth = computed(() => state.auth.id && (post.value?.author?._id === state.auth.id))

  const onUpdateLike = throttle(() => {
    emits('updateLike')
  }, 500)

  const onUpdatePost = () => {
    if (post.value?._id) push({ name: 'editor', query: { id: post.value?._id } })
  }

  const onDeletePost = () => {
    emits('deletePost')
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
      color: var(--text3);
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
          color: var(--text2);
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
            color: var(--text3);
            margin: 0.8rem 0 0;
          }
        }
      }
    }

    .wrap_author {
      position: relative;
      margin: 6.4rem 0 0;

      &:deep(.author) {
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
        }
      }
    }
  }
</style>
