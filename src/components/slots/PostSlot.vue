<template>
  <template v-if="type === 'list'">
    <List>
      <template #thumbnail v-if="post?.thumbnail">
        <div class="thumbnail">
          <img
            :src="
              post.thumbnail
                ? `${IMAGE_URL}${post.thumbnail?.serverFileName}`
                : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnI3Ftw4ttKq1OERD38V3Z6Y65RvY9pSwkIw&usqp=CAU'
            "
          />
        </div>
      </template>

      <template #num>
        <div class="number">{{ post.postNum }}</div>
      </template>

      <template #title>
        <router-link :to="{ name: 'post', query: { id: post._id } }">{{ post.title }}</router-link>
        <span class="info_ico" v-if="!post.isPublic"><Ico :size="'sm'" :svg="'lock'" /></span>
      </template>

      <template #summary>
        <p>{{ markdownText(post.content) }}</p>
      </template>

      <template #createdAt>
        <span>{{ dayjs(post.createdAt).format('YYYY. M. D') }}</span>
      </template>

      <template #comment_count>
        <router-link :to="{ name: 'post', query: { id: post._id, quickMove: true } }">
          <span class="info_ico"><Ico :size="'sm'" :svg="'comment'" /></span>
          <span>{{ post.commentCount }}</span>
        </router-link>
      </template>

      <template #like_count>
        <span class="info_ico" ref="LIKE_EL">
          <Ico :size="'sm'" :svg="'like'" :customColor="isLike ? 'var(--likeActive)' : ''" />
        </span>
        <span>{{ post.likeCount }}</span>
      </template>
    </List>
  </template>

  <template v-if="type === 'card'">
    <Card>
      <template #thumbnail>
        <img
          :src="
            post.thumbnail
              ? `${IMAGE_URL}${post.thumbnail?.serverFileName}`
              : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnI3Ftw4ttKq1OERD38V3Z6Y65RvY9pSwkIw&usqp=CAU'
          "
        />
      </template>

      <template #num>
        <span>{{ post.postNum }}</span>
      </template>

      <template #title>
        <router-link :to="{ name: 'post', query: { id: post._id } }">{{ post.title }}</router-link>
        <span class="info_ico"><Ico :size="'sm'" :svg="'lock'" /></span>
      </template>

      <template #summary>
        <p>{{ markdownText(post.content) }}</p>
      </template>

      <template #createdAt>
        <span>{{ dayjs(post.createdAt).format('YYYY. M. D') }}</span>
      </template>

      <template #comment_count>
        <div class="wrap_comment_count">
          <router-link :to="{ name: 'post', query: { id: post._id, quickMove: true } }">
            <span class="info_ico"><Ico :size="'sm'" :svg="'comment'" /></span>
            <span>{{ post.commentCount }}</span>
          </router-link>
        </div>
      </template>

      <template #like_count>
        <span class="info_ico" ref="LIKE_EL">
          <Ico :size="'sm'" :svg="'like'" :customColor="isLike ? 'var(--likeActive)' : ''"/>
        </span>
        <span>{{ post.likeCount }}</span>
      </template>
    </Card>
  </template>

  <template v-if="type === 'slide'">
    <Slide>
      <template #thumbnail>
        <img
          :src="
            post.thumbnail
              ? `${IMAGE_URL}${post.thumbnail?.serverFileName}`
              : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnI3Ftw4ttKq1OERD38V3Z6Y65RvY9pSwkIw&usqp=CAU'
          "
        />
      </template>

      <template #lock_ico>
        <Ico :size="'sm'" :svg="'lock'" />
      </template>

      <template #createdAt>
        <span>{{ dayjs(post.createdAt).format('YYYY. M. D') }}</span>
      </template>

      <template #title>
        <strong>{{ post.title }}</strong>
      </template>

      <template #comment_count>
        <span class="info_ico"><Ico :size="'sm'" :svg="'comment'" /></span>
        <span>{{ post.commentCount }}</span>
      </template>

      <template #like_count>
        <span class="info_ico" ref="LIKE_EL">
          <Ico :size="'sm'" :svg="'like'" :customColor="isLike ? 'var(--likeActive)' : ''"/>
        </span>
        <span>{{ post.likeCount }}</span>
      </template>
    </Slide>
  </template>
</template>

<script>
  import { onMounted, ref } from 'vue'
  import List from '../List.vue'
  import Card from '../Card.vue'
  import Slide from '../Slide.vue'
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
        default: 'list',
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
      const LIKE_EL = ref(null)
      const IMAGE_URL = ref(process.env.VUE_APP_IMAGE_URL)

      onMounted(() => {
        if (props.isLike && LIKE_EL.value) {
          LIKE_EL.value.classList.add('is-like')
        }
      })

      return { markdownText, dayjs, LIKE_EL, IMAGE_URL }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import '../../scss/list.scss';
  @import '../../scss/card.scss';
  @import '../../scss/slide.scss';
</style>
