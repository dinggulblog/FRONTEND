<template>
  <component :is="isMobile ? 'ModalBottom' : 'Dropbox'" ref="DROPBOX_EL">
    <li v-for="(value, key) in dropboxItems" :key="key">
      <span @click="value">{{ key }}</span>
    </li>
  </component>
</template>

<script>
  import { ref } from 'vue'
  import Dropbox from '../Dropbox.vue'
  import ModalBottom from '../global/ModalBottom.vue'

  export default {
    name: 'DropboxSlot',
    components: {
      Dropbox,
      ModalBottom,
    },
    props: {
      dropboxItems: {
        type: Object,
        required: true,
      },
    },
    setup() {
      const mediaQuery = window.matchMedia('only screen and (max-width: 767px')
      const isMobile = ref(mediaQuery.matches)

      const DROPBOX_EL = ref(null)

      const onToggle = () => {
        if (!isMobile.value) DROPBOX_EL.value.toggle()
        else {
          DROPBOX_EL.value.open()
        }
      }

      window.onclick = (event) => {
        if (
          !event.target.matches('.window') &&
          !event.target.matches('.window > ul') &&
          !event.target.matches('.window > ul > li')
        ) {
          DROPBOX_EL.value.close()
          console.log(DROPBOX_EL.value.isVisible)
        }
      }

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
