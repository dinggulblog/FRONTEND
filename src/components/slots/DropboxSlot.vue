<template>
  <Dropbox ref="DROPBOX_EL">
    <template #dropbox_btn>
      <Button
        class="btn_dropbox"
        tabindex="-1"
        :size="'sm'"
        :svg="'more'"
        :customColor="`var(--list_info)`"
        :customPadding="'0'"
        @onClick="onToggle"
      >
      </Button>
    </template>

    <template #dropbox_items>
      <li v-for="(value, key) in dropboxItems" :key="key" @click="value">{{ key }}</li>
    </template>
  </Dropbox>
</template>

<script>
  import { ref } from 'vue'
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
      const DROPBOX_EL = ref(null)

      const onToggle = () => {
        DROPBOX_EL.value.toggle()
      }

      return {
        DROPBOX_EL,
        onToggle
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
          cursor: pointer;
        }
      }
    }

    .wrap_dropbox_items.show {
      display: block;
    }
  }
</style>
