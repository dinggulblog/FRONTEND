<template>
  <!-- LIST TYPE -->
  <div v-if="type === 'list'">
    <List>
      <template #thumbnail>
        <img :src="[post.thumbnail ? `https://dinggul.me/` + post.thumbnail : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnI3Ftw4ttKq1OERD38V3Z6Y65RvY9pSwkIw&usqp=CAU']" :style="{ objectFit: 'cover' }" />
      </template>

      <template #num>
        <span>{{ post.postNum }}</span>
      </template>

      <template #title>
        <strong>{{ post.title }}</strong>
        <span class="info_ico"><i class="material-icons">lock</i></span>
      </template>

      <template #summury>
        <p>{{ markdownText(post.content) }}</p>
      </template>

      <template #createdAt>
        <span>{{ dayjs(post.createdAt).format('YYYY. M. D') }}</span>
      </template>

      <template #comment_count>
        <span class="info_ico"><i class="material-icons">comment</i></span>
        <span>{{ post.commentCount }}</span>
      </template>

      <template #like_count>
        <span class="info_ico"><i class="material-icons">favorite</i></span>
        <span>{{ post.likeCount }}</span>
      </template>
    </List>
  </div>

  <div v-if="type === 'album'">
    <Card>
      <template #thumbnail>
        <img :src="[post.thumbnail ? `https://dinggul.me/` + post.thumbnail : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnI3Ftw4ttKq1OERD38V3Z6Y65RvY9pSwkIw&usqp=CAU']" :style="{ objectFit: 'cover' }" />
      </template>

      <template #num>
        <span>{{ post.postNum }}</span>
      </template>

      <template #title>
        <strong>{{ post.title }}</strong>
        <span class="info_ico"><i class="material-icons">lock</i></span>
      </template>

      <template #summury>
        <p>{{ markdownText(post.content) }}</p>
      </template>

      <template #createdAt>
        <span>{{ dayjs(post.createdAt).format('YYYY. M. D') }}</span>
      </template>

      <template #comment_count>
        <span class="info_ico"><i class="material-icons">comment</i></span>
        <span>{{ post.commentCount }}</span>
      </template>

      <template #like_count>
        <span class="info_ico"><i class="material-icons">favorite</i></span>
        <span>{{ post.likeCount }}</span>
      </template>
    </Card>
  </div>

  <div v-if="type === 'slide'">
    <Slide>
      <template #thumbnail>
        <img :src="[post.thumbnail ? `https://dinggul.me/` + post.thumbnail : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnI3Ftw4ttKq1OERD38V3Z6Y65RvY9pSwkIw&usqp=CAU']" :style="{ objectFit: 'cover' }" />
      </template>

      <template #lock_ico>
        <span class="info_ico"><i class="material-icons">lock</i></span>
      </template>

      <template #createdAt>
        <span>{{ dayjs(post.createdAt).format('YYYY. M. D') }}</span>
      </template>

      <template #title>
        <strong>{{ post.title }}</strong>
      </template>

      <template #comment_count>
        <span class="info_ico"><i class="material-icons">comment</i></span>
        <span>{{ post.commentCount }}</span>
      </template>

      <template #like_count>
        <span class="info_ico"><i class="material-icons">favorite</i></span>
        <span>{{ post.likeCount }}</span>
      </template>
    </Slide>
  </div>
</template>

<script>
import List from './List.vue'
import Card from './Card.vue'
import Slide from './Slide.vue'
import markdownText from 'markdown-to-text'
import dayjs from 'dayjs'

export default {
  name: 'Slot',
  components: {
    List,
    Card,
    Slide,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      default: undefined,
    },
    post: {
      type: Object,
      required: true,
    },
    isLike: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    console.log('포스트트', props.post)
    return { markdownText, dayjs }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '../scss/list.scss';
</style>
