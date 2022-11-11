<template>
  <div class="toggle" ref="toggleDiv">
    <slot name="toggle_btn"></slot>
    <div class="wrap_toggle_items" v-if="isVisible">
      <ul>
        <slot name="toggle_items"></slot>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'Toggle',
  setup() {
    const toggleDiv = ref(null)
    const isVisible = ref(false)

    const toggleVisible = () => {
      isVisible.value = !isVisible.value
    }

    const clickOutsideToClose = (event) => {
      if (toggleDiv.value && !toggleDiv.value.firstElementChild.contains(event.target)) {
        isVisible.value = false
      }
    }

    onMounted(() => {
      const root = document.querySelector('#root')
      if (root.getAttribute('listener') !== 'click') {
        root.addEventListener('click', clickOutsideToClose)
        root.setAttribute('listener', 'click')
      }
    })

    return { toggleDiv, isVisible, toggleVisible }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped></style>
