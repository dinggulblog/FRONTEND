<template>
  <li class="slide_item">
    <slot name="thumbnail"></slot>

    <div class="wrap_title">
      <div class="title">
        <slot name="title"></slot>
      </div>
    </div>

    <div class="wrap_info">
      <div class="createdAt">
        <slot name="createdAt"></slot>
      </div>
      <div class="wrap_comment_like">
        <div class="comment_count">
          <slot name="comment_count"></slot>
        </div>
        <div class="like_count">
          <slot name="like_count"></slot>
        </div>
      </div>
    </div>
  </li>
</template>

<script></script>

<style lang="scss" rel="stylesheet/scss">
  @import '../../scss/slide.scss';
</style>
