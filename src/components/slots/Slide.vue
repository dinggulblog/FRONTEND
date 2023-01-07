<template>
  <li class="slide_item">
    <div class="wrap_thumnail">
      <slot name="thumbnail"></slot>

      <div class="wrap_hover">
        <div class="wrap_info_is-private_createdAt">
          <div class="wrap_left">
            <div class="is-private">
              <slot name="lock_ico"></slot>
            </div>
          </div>

          <div class="wrap_right">
            <div class="createdAt">
              <slot name="createdAt"></slot>
            </div>
          </div>
        </div>

        <div class="title">
          <slot name="title"></slot>
        </div>

        <div class="wrap_info_comment_like">
          <div class="wrap_left">
            <div class="like_count">
              <slot name="like_count"></slot>
            </div>
          </div>

          <div class="wrap_right">
            <div class="comment_count">
              <slot name="comment_count"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
</script>

<style lang="scss" rel="stylesheet/scss">
  @import '../../scss/slide.scss';
</style>
