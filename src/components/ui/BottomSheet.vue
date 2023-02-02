<template>
  <transition name="fade_up">
    <div class="bottom-sheet" v-if="isVisible">
      <div class="wrap_items">
        <ul>
          <slot></slot>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script setup>
  import { ref, defineExpose } from 'vue'

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

  defineExpose({ toggle })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .bottom-sheet {
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

  .wrap_items {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 auto;
    width: 100%;
    font-weight: 400;
    letter-spacing: 0.05rem;
    box-shadow: var(--shadow1);
    background: var(--bg1);
    border-radius: 3.2rem 3.2rem 0 0;
    padding: 2.4rem 3.2rem;

    &:deep(ul) {
      li {
        padding: 1.6rem 0;

        span {
          font-size: 1.6rem;
          color: var(--text3);
          cursor: pointer;
        }
      }
    }
  }
</style>
