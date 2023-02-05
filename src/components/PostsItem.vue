<template>
  <component :is="layouts[type]">
    <template #thumbnail>
      <div v-if="type !== 'list' || (type === 'list' && post.thumbnail)" class="thumbnail">
        <router-link :to="{ name: 'post', params: { postId: post._id } }" @click="$emit('commitPosts')">
          <img :src="post.thumbnail ? post.thumbnail : DEFAULT_THUMBNAIL" />
        </router-link>

        <div class="ico_like" v-if="post.liked">
          <Ico :svg="'like-fill'" :color="'var(--likeActive-dark)'" />
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
        <Ico v-if="!post.isPublic" class="ico_lock" :size="'sm'" :svg="'lock'" :color="type === 'slide' ? '#fff' : 'var(--text2)'"/>
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
      <router-link :to="{ name: 'post', params: { postId: post._id } }" @click="onQuickMove(), $emit('commitPosts')">
        댓글 {{ post.commentCount }}
      </router-link>
    </template>

    <template #like_count>
      <span>좋아요 {{ post.likeCount }}</span>
    </template>
  </component>
</template>

<script setup>
  import { ref } from 'vue'
  import { useStore } from 'vuex'
  import markdownText from 'markdown-to-text'
  import DEFAULT_THUMBNAIL from '../assets/default_thumbnail.webp'
  import card from './slots/Card.vue'
  import list from './slots/List.vue'
  import slide from './slots/Slide.vue'
  import recent from './slots/Recent.vue'
  import { getTime } from '../common/time.js'

  const props = defineProps({
    type: {
      type: String,
      default: 'list',
      validator: (value) => ['list', 'card', 'slide', 'recent'].includes(value),
    },
    post: {
      type: Object,
      required: true,
    },
  })

  const { commit } = useStore()

  const type = ref(props.type)

  const layouts = {
    card: card,
    list: list,
    slide: slide,
    recent: recent,
  }

  const onQuickMove = () => {
    commit('post/SET_QUICKMOVE', true)
  }
</script>
