<template>
  <Info>
    <template #author>
      <li>
        <AuthorSlot :profile="comment.commenter" />
      </li>
    </template>

    <template #createdAt>
      <li>
        <span class="createdAt">{{ dayjs(comment.createdAt).format('YYYY년 M월 D일') }}</span>
      </li>
    </template>
  </Info>
</template>

<script>
  import Info from '../slots/Info.vue'
  import AuthorSlot from './AuthorSlot.vue'
  import dayjs from 'dayjs'

  export default {
    name: 'CommentInfoSlot',
    components: {
      Info,
      AuthorSlot,
    },
    props: {
      comment: {
        type: Object,
        required: true,
        default: () => ({}),
      },
    },
    setup(props) {
      return { dayjs }
    },
  }
</script>
