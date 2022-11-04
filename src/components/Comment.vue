<template>
  <li class="comment_item">
    <slot name="is-active"></slot>

    <slot name="not-is-active"></slot>

    <slot name="child"></slot>
  </li>
</template>

<script>
export default {
  name: 'Comment',
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.comment_item {
  margin-top: 4rem;
}
</style>
