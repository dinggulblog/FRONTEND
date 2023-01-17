<template>
  <li class="recent_item">
    <div class="wrap_contents">
      <slot name="thumbnail"></slot>

      <div class="contents">
        <div class="category">
          <slot name="category"></slot>
        </div>

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
        </div>
      </div>
    </div>
  </li>
</template>

<script></script>

<style lang="scss" rel="stylesheet/scss">
  @import '../../scss/recent.scss';
</style>
