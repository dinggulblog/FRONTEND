<template>
  <Teleport to="body">
    <Transition name="fade_up">
      <div class="popup-modal" v-if="isVisible">
        <slot></slot>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
  import { ref } from 'vue'

  export default {
    setup() {
      const isVisible = ref(false)

      const open = () => {
        isVisible.value = true
      }

      const close = () => {
        isVisible.value = false
      }

      return { isVisible, open, close }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .popup-modal {
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    position: fixed;
    align-items: center;
    justify-content: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 998;
  }
</style>
