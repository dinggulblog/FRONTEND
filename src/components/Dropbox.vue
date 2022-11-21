<template>
  <div class="dropbox">
    <slot name="dropbox_btn"></slot>
    <div class="wrap_dropbox_items" v-if="isVisible">
      <ul>
        <slot name="dropbox_items"></slot>
      </ul>
    </div>
  </div>
</template>

<script>
  import { ref } from 'vue'

  export default {
    name: 'Dropbox',
    setup() {
      const isVisible = ref(false)

      const dropbox = () => {
        isVisible.value = !isVisible.value
      }

      const close = () => {
        isVisible.value = false
      }

      return { isVisible, close, dropbox }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped></style>
