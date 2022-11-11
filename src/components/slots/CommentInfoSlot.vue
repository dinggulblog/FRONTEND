<template>
  <Info>
    <template #author>
      <li>
        <img class="avatar" src="../../assets/4.jpg" alt="user_avatar" />
        <span class="nickname">{{ comment.commenter.nickname }}</span>
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
import dayjs from 'dayjs'

export default {
  name: 'InfoSlot',
  components: {
    Info,
  },
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    console.log(props.comment)
    return { dayjs }
  },
}
</script>
