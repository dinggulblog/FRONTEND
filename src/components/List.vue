<template>
  <div id="list">
    <div class="num">
      <slot name="num"></slot>
      <div class="num_border"></div>
    </div>
    <div class="wrap_contents">
      <div class="wrap_left">
        <div class="wrap_title_is-private">
          <div class="title">
            <slot name="title"></slot>
          </div>
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

      <div class="wrap_right">
        <div class="thumbnail">
          <slot name="thumbnail"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'List_',
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '../scss/list.scss';
</style>
