<template>
  <Info>
    <template #author>
      <li>
        <AuthorSlot :comment="comment" :type="'comment'" />
      </li>
    </template>

    <template #createdAt>
      <li>
        <span class="createdAt">{{ dayjs(comment.createdAt).format('YYYY년 M월 D일') }}</span>
      </li>
    </template>

    <template #comment_count>
      <li>
        <span class="child_count">답글 {{ comment?.childComments?.length ?? 0 }}개</span>
      </li>
    </template>

    <template #is-public v-if="!comment?.isPublic">
      <li>
        <span class="info_ico"><i class="material-icons">lock</i></span>
      </li>
    </template>
  </Info>
</template>

<script>
import Info from '../Info.vue'
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
    },
  },
  setup(props) {
    return { dayjs }
  },
}
</script>
