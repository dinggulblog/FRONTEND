<template>
  <component :is="type">
    <template #thumbnail>
      <div v-if="type !== 'list' || (type === 'list' && post.thumbnail)" class="thumbnail">
        <router-link :to="{ name: 'post', query: { id: post._id } }">
          <img :src="post.thumbnail ? `${IMAGE_URL}${post.thumbnail?.serverFileName}` : DEFAULT_THUMBNAIL" />
        </router-link>
      </div>
    </template>

    <template #num>
      <span class="number">{{ post.postNum }}</span>
    </template>

    <template #title>
      <router-link :to="{ name: 'post', query: { id: post._id } }">{{ post.title }}</router-link>
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
      <router-link :to="{ name: 'post', query: { id: post._id }, params: { quickMove: true } }">
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
  import card from '../posts/Card.vue'
  import list from '../posts/List.vue'
  import slide from '../posts/Slide.vue'
  import DEFAULT_THUMBNAIL from '../../assets/default_thumbnail.png'

  export default {
    name: 'PostsSlot',
    props: {
      type: {
        type: String,
        default: 'List',
      },
      post: {
        type: Object,
        required: true,
      }
    },
    components: {
      list,
      card,
      slide,
    },
    setup(props) {
      const LIKE_EL = ref(null)
      const IMAGE_URL = ref(process.env.VUE_APP_IMAGE_URL)

      onMounted(() => {
        if (props.post.liked) LIKE_EL.value?.classList?.add('is-like')
      })

      return {
        markdownText,
        dayjs,
        LIKE_EL,
        IMAGE_URL,
        DEFAULT_THUMBNAIL,
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss"></style>
