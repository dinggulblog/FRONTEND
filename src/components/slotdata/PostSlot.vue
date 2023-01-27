<template>
  <component :is="type">
    <template #thumbnail>
      <div v-if="type !== 'list' || (type === 'list' && post.thumbnail)" class="thumbnail">
        <router-link :to="{ name: 'post', params: { postId: post._id } }" @click="$emit('commitPosts')">
          <img :src="post.thumbnail ? post.thumbnail : DEFAULT_THUMBNAIL" />
        </router-link>

        <div class="ico_like" v-if="post.liked">
          <Ico :size="'md'" :svg="'like-fill'" :customColor="'var(--likeActive-dark)'" />
        </div>
      </div>
    </template>

    <template #category>
      <span>{{ post.category }}</span>
    </template>

    <template #title>
      <router-link :to="{ name: 'post', params: { postId: post._id } }" @click="$emit('commitPosts')">
      {{ post.title }}
    </router-link>
    </template>

    <template #lock_ico>
      <span class="wrap_ico_lock">
        <Ico
          v-if="!post.isPublic"
          :size="'sm'"
          :svg="'lock'"
          :customColor="type === 'slide' ? '#fff' : 'var(--text2)'"
          class="ico_lock"
        />
      </span>
    </template>

    <template #summary>
      <p>{{ markdownText(post.content) }}</p>
    </template>

    <template #author>
      <span class="by">by.</span>
      <span class="nickname">{{ post.author.nickname }}</span>
    </template>

    <template #createdAt>
      <span>{{ getTime(post.createdAt) }}</span>
    </template>

    <template #comment_count>
      <router-link :to="{ name: 'post', params: { postId: post._id, quickMove: true } }" @click="$emit('commitPosts')">
        댓글 {{ post.commentCount }}
      </router-link>
    </template>

    <template #like_count>
      <span>좋아요 {{ post.likeCount }}</span>
    </template>
  </component>
</template>

<script>
  import { onMounted, ref } from 'vue'
  import markdownText from 'markdown-to-text'
  import dayjs from 'dayjs'
  import card from '../slots/Card.vue'
  import list from '../slots/List.vue'
  import slide from '../slots/Slide.vue'
  import recent from '../slots/Recent.vue'
  import DEFAULT_THUMBNAIL from '../../assets/default_thumbnail.webp'
  import { getTime } from '../../common/time.js'

  export default {
    name: 'PostsSlot',
    props: {
      type: {
        type: String,
        default: 'list',
        validator: (value) => ['list', 'card', 'slide', 'recent'].includes(value),
      },
      post: {
        type: Object,
        required: true,
      },
    },
    components: {
      list,
      card,
      slide,
      recent,
    },
    setup(props) {
      const LIKE_EL = ref(null)
      const createAt = ref(null)

      onMounted(() => {
        if (props.post.liked) LIKE_EL.value?.classList?.add('is-like')
      })

      return {
        markdownText,
        createAt,
        LIKE_EL,
        DEFAULT_THUMBNAIL,
        getTime,
      }
    },
  }
</script>
