<template>
  <template v-if="type === 'list'">
    <!-- LIST TYPE -->
    <List>
      <template #thumbnail>
        <img :src="[post.thumbnail ? `https://dinggul.me/` + post.thumbnail : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnI3Ftw4ttKq1OERD38V3Z6Y65RvY9pSwkIw&usqp=CAU']" />
      </template>

      <template #num>
        <div class="number">{{ post.postNum }}</div>
      </template>

      <template #title>
        <router-link :to="{ name: 'post', params: { title, subject, id: post._id } }">{{ post.title }}</router-link>
        <span class="info_ico"><i class="material-icons">lock</i></span>
      </template>

      <template #summary>
        <p>{{ markdownText(post.content) }}</p>
      </template>

      <template #createdAt>
        <span>{{ dayjs(post.createdAt).format('YYYY. M. D') }}</span>
      </template>

      <template #comment_count>
        <div class="wrap_comment_count" @click="quickMoveComments">
          <span class="info_ico"><i class="material-icons">comment</i></span>
          <span>{{ post.commentCount }}</span>
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
        <router-link :to="{ name: 'post', params: { title, subject, id: post._id } }">{{ post.title }}</router-link>
        <span class="info_ico"><i class="material-icons">lock</i></span>
      </template>

      <template #summary>
        <p>{{ markdownText(post.content) }}</p>
      </template>

      <template #createdAt>
        <span>{{ dayjs(post.createdAt).format('YYYY. M. D') }}</span>
      </template>

      <template #comment_count>
        <div class="wrap_comment_count" @click="quickMoveComments">
          <span class="info_ico"><i class="material-icons">comment</i></span>
          <span>{{ post.commentCount }}</span>
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
import { onMounted, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
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
    const { push } = useRouter()
    const quickMoveComments = () => {
      console.log('코멘트창으로 이동')
      push({ name: 'post', params: { title: props.title, subject: props.subject, id: props.post._id, quickMoveComments } })
    }

    const isLikeEl = ref(null)
    const isLike = (like) => {
      if (like && isLikeEl.value) isLikeEl.value.classList.add('is-like')
    }

    onMounted(() => {
      isLike()
    })

    watchEffect(() => isLike(props.isLike))

    return { markdownText, dayjs, quickMoveComments, isLikeEl }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss">
@import '../scss/list.scss';
@import '../scss/card.scss';
@import '../scss/slide.scss';
</style>
