<template>
    <component :is="type">
      <template #thumbnail>
        <div v-if="type !== 'list' || (type === 'list' && post.thumbnail)" class="thumbnail">
          <router-link :to="{ name: 'post', query: { id: post._id } }" @click="$emit('commitPosts')">
            <img :src="post.thumbnail ? post.thumbnail : DEFAULT_THUMBNAIL" />
          </router-link>
        </div>
      </template>

      <template #num>
        <span class="number">{{ post.postNum }}</span>
      </template>

      <template #title>
        <router-link :to="{ name: 'post', query: { id: post._id } }" @click="$emit('commitPosts')">{{
          post.title
        }}</router-link>
      </template>

      <template #lock_ico>
        <span class="info_ico" v-if="!post.isPublic">
          <Ico :size="'sm'" :svg="'lock'" :customColor="type === 'slide' ? '#fff' : 'var(--list_info)'" />
        </span>
      </template>

      <template #summary>
        <p>{{ markdownText(post.content) }}</p>
      </template>

      <template #createdAt>
        <span>{{ dayjs(post.createdAt).format('YYYY. M. D') }}</span>
      </template>

      <template #comment_count>
        <router-link
          :to="{ name: 'post', query: { id: post._id }, params: { quickMove: true } }"
          @click="$emit('commitPosts')"
        >
          <span class="info_ico"><Ico :size="'sm'" :svg="'comment'" /></span>
          <span>{{ post.commentCount }}</span>
        </router-link>
      </template>

      <template #like_count>
        <span class="info_ico" ref="LIKE_EL">
          <Ico
            :size="'sm'"
            :svg="post.liked ? 'like-fill' : 'like'"
            :customColor="post.liked ? (type === 'slide' ? 'var(--likeActive-dark)' : 'var(--likeActive)') : ''"
          />
        </span>
        <span>{{ post.likeCount }}</span>
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
  import DEFAULT_THUMBNAIL from '../../assets/default_thumbnail.webp'

  export default {
    name: 'PostsSlot',
    props: {
      type: {
        type: String,
        default: 'list',
        validator: (value) => ['list', 'card', 'slide'].includes(value),
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
    },
    setup(props) {
      const LIKE_EL = ref(null)

      onMounted(() => {
        if (props.post.liked) LIKE_EL.value?.classList?.add('is-like')
      })

      return {
        markdownText,
        dayjs,
        LIKE_EL,
        DEFAULT_THUMBNAIL,
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
