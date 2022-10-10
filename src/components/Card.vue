<template>
  <div id="card">
    <div class="thumnail">
      <slot name="thumbnail"></slot>
    </div>

    <div class="wrap_num_title">
      <div class="num">
        <slot name="num"></slot>
      </div>
      <div class="title">
        <slot name="title"></slot>
      </div>
    </div>

    <div class="summury">
      <slot name="summury"></slot>
    </div>

    <div class="wrap_info">
      <div class="wrap_left">
        <div class="createdAt">
          <slot name="createdAt"></slot>
        </div>
      </div>

      <div class="wrap_right">
        <div class="wrap_comment_like">
          <slot name="comment_ico"></slot>
          <slot name="comment_count"></slot>
          <slot name="like_ico"></slot>
          <slot name="like_count"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  components: {},
  setup() {},
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '../scss/card.scss';
</style>
