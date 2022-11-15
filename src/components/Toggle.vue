<template>
  <div class="toggle">
    <slot name="toggle_btn"></slot>
    <div class="wrap_toggle_items" v-if="isVisible">
      <ul>
        <slot name="toggle_items"></slot>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Toggle',
  setup() {
    const isVisible = ref(false)

    const toggle = () => {
      isVisible.value = !isVisible.value
    }

    const close = () => {
      isVisible.value = false
    }

    return { isVisible, close, toggle }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped></style>
