<template>
  <Transition name="fade">
    <div class="toast-message" v-if="isVisible">
      <Ico :size="'md'" :svg="state.type" :customColor="state.color" class="ico_system" />
      {{ state.message }}
    </div>
  </Transition>
</template>

<script setup>
import { defineExpose, ref, computed } from 'vue'

const isVisible = ref(false)
const state = computed(() => ({
  type: null,
  message: null,
  bgColor: null,
  color: null,
}))

const open = (type, message) => {
  if (isVisible.value) close()

  state.value.type = type
  state.value.message = message
  state.value.bgColor = type === 'success' ? `var(--success-light)` : type === 'warn' ? `var(--warning-light)` : `var(--error-light)`
  state.value.color = type === 'success' ? `var(--success)` : type === 'warn' ? `var(--warning)` : `var(--error)`
  isVisible.value = true
  setTimeout(close, 1000 * 3)
}

const close = () => {
  isVisible.value = false
}

defineExpose({ open })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .fade-enter-active {
    animation: fadeIn 0.3s;
  }

  @keyframes fadeIn {
    from {
      transform: translateY(4rem);
    }
    to {
      transform: translateY(0);
    }
  }

  .toast-message {
    display: flex;
    position: fixed;
    align-items: center;
    bottom: 2.4rem;
    right: 2.4rem;
    z-index: 999;
    width: 32rem;
    height: 6.4rem;
    border-radius: 0.8rem;
    background: v-bind('state.bgColor');
    color: v-bind('state.color');
    border-color: v-bind('state.color');
    box-shadow: 0 0.1rem 2rem rgb(0 0 0 / 16%);
    border: 1px solid;
    font-size: 1.4rem;
    padding: 2.4rem;

    .ico_system {
      margin: 0 0.8rem 0 0;
    }
  }
</style>
