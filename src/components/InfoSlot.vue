<template>
  <template v-if="type === 'content'">
    <Info>
      <template #author>
        <li>
          <span class="nickname">{{ post.author.nickname }}</span>
        </li>
      </template>
      <template #data>
        <li>
          <span>{{ dayjs(post.createdAt).format('YYYY. M. D') }}</span>
        </li>
      </template>

      <template #category>
        <li>
          <span class="category">{{ post.category }}</span>
        </li>
      </template>

      <template #reply_count> </template>
    </Info>
  </template>

  <template v-if="type === 'comment'">
    <Info>
      <template #author>
        <li>
          <span class="nickname">{{ comment.commenter.nickname }}</span>
        </li>
      </template>

      <template #data>
        <li>
          <span class="createdAt">{{ dayjs(comment.createdAt).format('YYYY년 M월 D일') }}</span>
        </li>
      </template>

      <template #reply_count>
        <li>
          <span class="child_count">답글 {{ comment.childComments?.length ? comment.childComments?.length : 0 }}개</span>
        </li>
      </template>
    </Info>
  </template>
</template>

<script>
import Info from './Info.vue'
import dayjs from 'dayjs'

export default {
  name: 'InfoSlot',
  components: {
    Info,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    comment: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    return { dayjs }
  },
}
</script>
