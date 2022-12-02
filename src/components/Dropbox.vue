<template>
  <div class="dropbox">
    <slot name="dropbox_btn"></slot>
    <div class="wrap_dropbox_items" ref="DROPBOX_ITEMS_EL">
      <ul>
        <slot name="dropbox_items"></slot>
      </ul>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'

export default {
  name: 'Dropbox',
  setup() {
    const DROPBOX_ITEMS_EL = ref(null)

    const open = () => {
      closeAll()
      DROPBOX_ITEMS_EL.value.classList.add('show')
    }

    const close = () => {
      DROPBOX_ITEMS_EL.value.classList.remove('show')
    }

    const toggle = () => {
      DROPBOX_ITEMS_EL.value.classList.contains('show') ? close() : open()
    }

    const closeAll = () => {
      const dropdowns = document.body.getElementsByClassName('wrap_dropbox_items')

      for (let i = 0; i < dropdowns.length; i++) {
        if (dropdowns[i].classList.contains('show')) {
          dropdowns[i].classList.remove('show')
        }
      }
    }

    window.onclick = (event) => {
      if (!event.target.matches('.btn_dropbox > svg') && !event.target.matches('.btn_dropbox > svg > path')) {
        closeAll()
      }
    }

    onMounted(() => {
      DROPBOX_ITEMS_EL.value.addEventListener('click', (event) => {
        event.stopPropagation()
      })
    })
      
    return { DROPBOX_ITEMS_EL, open, close, toggle }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss">
</style>
