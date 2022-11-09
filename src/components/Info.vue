<template>
  <div id="info">
    <ul>
      <slot name="author"></slot>
      <slot name="data"></slot>
      <slot name="category"></slot>
      <slot name="reply_count"></slot>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Info',
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped></style>
