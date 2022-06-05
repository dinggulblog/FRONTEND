<template>
  <transition name="fade">
    <div class="popup-modal" v-if="isVisible">
      <div class="window">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'PopupModal',
  data() {
    return {
      isVisible: false,
    }
  },
  methods: {
    open() {
      this.isVisible = true
    },
    close() {
      this.isVisible = false
    },
  },
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.popup-modal {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  z-index: 50;
}

.window {
  width: 40rem;
  height: 24rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-weight: 400;
  letter-spacing: 0.05rem;
  box-shadow: 0 0 2.4rem 0.3rem rgba(0, 0, 0, 0.05);
  background: #fff;
  margin: 0 auto;
  color: var(--primary);
}
</style>
