<template>
  <Teleport to="body">
    <Transition name="fade">
      <div class="popup-modal" v-if="isVisible">
        <div class="window">
          <slot></slot>
        </div>
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

<style scoped>
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .popup-modal {
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    position: fixed;
    align-items: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
  }

  .window {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 auto;
    min-width: 30.4rem;
    max-width: 37rem;
    height: auto;
    font-weight: 400;
    letter-spacing: 0.05rem;
    box-shadow: 0 0 2.4rem 0.3rem rgba(0, 0, 0, 0.05);
    background: #fff;
    border-radius: 3.2rem;
  }
</style>
