<template>
  <Info>
    <template #createdAt>
      <li>
        <span class="createdAt">{{ dayjs(post.createdAt).format('YYYY. M. D') }}</span>
      </li>
    </template>

    <template #category>
      <li>
        <span class="category">{{ post.category }}</span>
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
      post: {
        type: Object,
        required: true,
      },
    },
    setup() {
      return { dayjs }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss"></style>
