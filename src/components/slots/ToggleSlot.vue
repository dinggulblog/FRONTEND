<template>
  <Toggle ref="ToggleEl">
    <template #toggle_btn>
      <button class="btn_toggle" tabindex="-1" @click="onToggle"><i class="material-icons toggle_ico">more_horiz</i></button>
    </template>

    <template #toggle_items>
      <li v-for="(value, key) in toggleItems" :key="key" @click="value">{{ key }}</li>
    </template>
  </Toggle>
</template>

<script>
import { ref, onMounted } from 'vue'
import Toggle from '../Toggle.vue'

export default {
  name: 'ToggleSlot',
  components: {
    Toggle,
  },
  props: {
    toggleItems: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const ToggleEl = ref(null)

    const onToggle = () => {
      ToggleEl.value.toggle()
    }

    const onClose = () => {
      ToggleEl.value.close()
    }

    const closeAll = (event) => {
      if (!event.target.classList[1]) onClose()
    }

    onMounted(() => {
      document.addEventListener('click', closeAll)
    })

    /*

    const closeAll = (event) => {
      if (!event.target.closest('.toggle')) onClose()
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
      ToggleEl,
      onToggle,
      onClose,
    }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss">
.toggle {
  position: relative;
  .btn_toggle {
    i {
      font-size: 2.4rem;
      color: var(--list_info);
    }
  }

  .wrap_toggle_items {
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
