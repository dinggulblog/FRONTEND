<template>
  <transition name="fade">
    <div class="popup-modal" v-if="isVisible">
      <div class="window">
        <ul>
          <slot></slot>
        </ul>
      </div>
    </div>
  </transition>
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

      const toggle = () => {
        isVisible.value ? close() : open()
      }

      return { isVisible, open, close, toggle }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .popup-modal {
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    position: fixed;
    align-items: flex-end;
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
    width: 100%;
    height: 24rem;
    font-weight: 400;
    letter-spacing: 0.05rem;
    box-shadow: 0 0 2.4rem 0.3rem rgba(0, 0, 0, 0.05);
    background: #fff;
    border-radius: 3.2rem 3.2rem 0 0;
    padding: 2.4rem 3.2rem;

    ul {
      li {
        padding: 1.6rem 0;

        span {
          font-size: 1.6rem;
          color: #aaa;
          cursor: pointer;
        }
      }
    }
  }
</style>
