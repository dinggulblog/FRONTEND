<template>
  <template v-if="type === 'list'">
    <List>
      <template #thumbnail>
        <img :src="[post.thumbnail ? `https://dinggul.me/` + post.thumbnail : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnI3Ftw4ttKq1OERD38V3Z6Y65RvY9pSwkIw&usqp=CAU']" />
      </template>

      <template #num>
        <div class="number">{{ post.postNum }}</div>
      </template>

      <template #title>
        <router-link :to="{ name: 'post', params: { id: post._id } }">{{ post.title }}</router-link>
        <span class="info_ico"><i class="material-icons">lock</i></span>
      </template>

      <template #summary>
        <p>{{ markdownText(post.content) }}</p>
      </template>

      <template #createdAt>
        <span>{{ dayjs(post.createdAt).format('YYYY. M. D') }}</span>
      </template>

      <template #comment_count>
        <div class="wrap_comment_count">
          <router-link :to="{ name: 'post', params: { id: post._id, quickMove: true } }">
            <span class="info_ico"><i class="material-icons">comment</i></span>
            <span>{{ post.commentCount }}</span>
          </router-link>
        </div>
      </template>

      <template #like_count>
        <span class="info_ico" ref="isLikeEl"><i class="material-icons">favorite</i></span>
        <span>{{ post.likeCount }}</span>
      </template>
    </List>
  </template>

  <template v-if="type === 'card'">
    <Card>
      <template #thumbnail>
        <img :src="[post.thumbnail ? `https://dinggul.me/` + post.thumbnail : 'https://photo.coolenjoy.co.kr/data/editor/2105/09198d36ef38aea9e4348cc363c80232f1cd5a92.jpg']" />
      </template>

      <template #num>
        <span>{{ post.postNum }}</span>
      </template>

      <template #title>
        <router-link :to="{ name: 'post', params: { id: post._id } }">{{ post.title }}</router-link>
        <span class="info_ico"><i class="material-icons">lock</i></span>
      </template>

      <template #summary>
        <p>{{ markdownText(post.content) }}</p>
      </template>

      <template #createdAt>
        <span>{{ dayjs(post.createdAt).format('YYYY. M. D') }}</span>
      </template>

      <template #comment_count>
        <div class="wrap_comment_count">
          <router-link :to="{ name: 'post', params: { id: post._id, quickMove: true } }">
            <span class="info_ico"><i class="material-icons">comment</i></span>
            <span>{{ post.commentCount }}</span>
          </router-link>
        </div>
      </template>

      <template #like_count>
        <span class="info_ico" ref="isLikeEl"><i class="material-icons">favorite</i></span>
        <span>{{ post.likeCount }}</span>
      </template>
    </Card>
  </template>

  <template v-if="type === 'slide'">
    <Slide>
      <template #thumbnail>
        <img :src="[post.thumbnail ? `https://dinggul.me/` + post.thumbnail : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnI3Ftw4ttKq1OERD38V3Z6Y65RvY9pSwkIw&usqp=CAU']" />
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
        <span class="info_ico" ref="isLikeEl"><i class="material-icons">favorite</i></span>
        <span>{{ post.likeCount }}</span>
      </template>
    </Slide>
  </template>
</template>

<script>
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import List from './List.vue'
import Card from './Card.vue'
import Slide from './Slide.vue'
import markdownText from 'markdown-to-text'
import dayjs from 'dayjs'

export default {
  name: 'PostSlot',
  components: {
    List,
    Card,
    Slide,
  },
  props: {
    type: {
      type: String,
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
    const route = useRoute()

    const isLikeEl = ref(null)
    const addLikeClass = (like) => {
      if (like && isLikeEl.value) isLikeEl.value.classList.add('is-like')
    }

    watchEffect(() => addLikeClass(props.isLike))

    return { markdownText, dayjs, route, isLikeEl }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss">
@import '../scss/list.scss';
@import '../scss/card.scss';
@import '../scss/slide.scss';
</style>
