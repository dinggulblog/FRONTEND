<template>
  <li class="list_item">
    <div class="num">
      <slot name="num"></slot>
      <div class="num_border"></div>
    </div>
    <div class="wrap_contents">
      <div class="contents">
        <div class="title">
          <slot name="title"></slot>
          <slot name="lock_ico"></slot>
        </div>
        <div class="summary">
          <slot name="summary"></slot>
        </div>
        <div class="wrap_info">
          <div class="createdAt">
            <slot name="createdAt"></slot>
          </div>
          <div class="comment_count">
            <slot name="comment_count"></slot>
          </div>
          <div class="like_count">
            <slot name="like_count"></slot>
          </div>
        </div>
      </div>

      <slot name="thumbnail"></slot>
    </div>
  </li>
</template>

<script>
  export default {
    name: 'List',
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import '../scss/list.scss';
</style>
