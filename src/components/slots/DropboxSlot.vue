<template>
  <Dropbox ref="dropboxEl">
    <template #dropbox_btn>
      <button class="btn_dropbox" tabindex="-1" @click="onDropbox">
        <i class="material-icons dropbox_ico">more_horiz</i>
      </button>
    </template>

    <template #dropbox_items>
      <li v-for="(value, key) in dropboxItems" :key="key" @click="value">{{ key }}</li>
    </template>
  </Dropbox>
</template>

<script>
  import { ref, onMounted, onUnmounted } from 'vue'
  import Dropbox from '../Dropbox.vue'

  export default {
    name: 'DropboxSlot',
    components: {
      Dropbox,
    },
    props: {
      dropboxItems: {
        type: Object,
        required: true,
      },
    },
    setup(props) {
      const dropboxEl = ref(null)

      const onDropbox = () => {
        dropboxEl.value.dropbox()
      }

      const onClose = () => {
        dropboxEl.value.close()
      }

      const closeAll = (event) => {
        if (!event.target.classList[1]) onClose()
      }

      onMounted(() => {
        document.addEventListener('click', closeAll)
      })

      onUnmounted(() => {
        document.removeEventListener('click', closeAll)
      })

      /*

    const closeAll = (event) => {
      if (!event.target.closest('.dropbox')) onClose()
    }

    /*

    onMounted(() => {
      if (document.body.getAttribute('listener') !== 'click') {
        document.body.setAttribute('listener', 'click')
        document.body.addEventListener('click', closeAll)
      }
    })

    onUnmounted(() => {
      document.body.removeAttribute('listener')
      document.body.removeEventListener('click', closeAll)
    })

    */

      return {
        dropboxEl,
        onDropbox,
        onClose,
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .dropbox {
    position: relative;
    .btn_dropbox {
      i {
        font-size: 2.4rem;
        color: var(--list_info);
      }
    }

    .wrap_dropbox_items {
      position: absolute;
      top: 3.2rem;
      right: 0;
      z-index: 30;

      ul {
        width: 9.6rem;
        border-radius: 2.4rem;
        padding: 0.8rem 1.2rem;
        box-shadow: 0 0.1rem 2rem rgb(0 0 0 / 16%);
        background: #fff;

        li {
          display: flex;
          justify-content: center;
          padding: 0.4rem 0;
          margin: 1.2rem 0;
          font-size: 1.2rem;
          color: var(--input_text);
          cursor: pointer;
        }
      }
    }
  }
</style>
