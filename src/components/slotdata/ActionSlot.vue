<template>
  <component :is="isMobile ? 'BottomSheet' : 'Dropbox'" ref="DROPBOX_EL">
    <li v-for="(value, key) in dropboxItems" :key="key">
      <span @click="value">{{ key }}</span>
    </li>
  </component>
</template>

<script>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useMedia } from '../../common/mediaQuery'
  import Dropbox from '../ui/Dropbox.vue'
  import BottomSheet from '../ui/BottomSheet.vue'

  export default {
    name: 'DropboxSlot',
    components: {
      Dropbox,
      BottomSheet,
    },
    props: {
      dropboxItems: {
        type: Object,
        required: true,
      },
    },
    setup() {
      const isMobile = useMedia('only screen and (max-width: 1023px)')
      const DROPBOX_EL = ref(null)

      const onToggle = () => {
        DROPBOX_EL.value.toggle()
      }

      const onClose = (event) => {
        if (
          isMobile &&
          DROPBOX_EL.value.isVisible &&
          !event.target.matches('.btn_dropbox > svg') &&
          !event.target.matches('.btn_dropbox > svg > path') &&
          !event.target.matches('.window') &&
          !event.target.matches('.window > ul') &&
          !event.target.matches('.window > ul > li')
        ) {
          DROPBOX_EL.value.close()
        }
      }

      onMounted(() => {
        document.body.addEventListener('click', onClose)
      })

      onUnmounted(() => {
        document.body.removeEventListener('click', onClose)
      })

      return {
        isMobile,
        DROPBOX_EL,
        onToggle,
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
      display: none;
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

          span {
            cursor: pointer;
          }
        }
      }
    }

    .wrap_dropbox_items.show {
      display: block;
    }
  }
</style>
