<template>
  <div class="dropbox">
    <div class="wrap_dropbox_items" ref="DROPBOX_ITEMS_EL">
      <ul>
        <slot></slot>
      </ul>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue'

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

  defineExpose({ toggle })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .dropbox {
    position: relative;

    .wrap_dropbox_items {
      display: none;
      position: absolute;
      top: 1.2rem;
      right: 0;
      z-index: 30;

      ul {
        width: 9.6rem;
        border-radius: 1.2rem;
        padding: 0.1rem 1.2rem;
        border:1px solid var(--border2);
        background: var(--bg1);

        &:deep(li) {
          display: flex;
          justify-content: center;
          margin: 2rem 0;
          font-size: 1.2rem;
          color: var(--text3);

          span {
            cursor: pointer;
          }
        }
      }

      &.show {
        display: block;
      }
    }
  }
</style>
