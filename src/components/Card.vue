<template>
  <li class="card_item">
    <div class="thumbnail">
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

    <div class="summary">
      <slot name="summary"></slot>
    </div>

    <div class="wrap_info">
      <div class="wrap_left">
        <div class="createdAt">
          <slot name="createdAt"></slot>
        </div>
      </div>

      <div class="wrap_right">
        <div class="wrap_comment_like">
          <div class="wrap_comment_count">
            <slot name="comment_count"></slot>
          </div>
          <slot name="like_count"></slot>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
  import { ref, onMounted } from 'vue'

  export default {
    name: 'Card',
    components: {},
    props: {
      postLength: {
        type: Number,
      },
    },
    setup() {
      const mediaQuery = window.matchMedia('only screen and (max-width: 1023px')
      const isMobile = ref(mediaQuery.matches)

      onMounted(() => {
        mediaQuery.addEventListener('change', () => {
          isMobile.value = mediaQuery.matches
        })
      })
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import '../scss/card.scss';
</style>
