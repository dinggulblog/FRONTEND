<template>
  <Toggle ref="toggle">
    <template #toggle_btn>
      <button class="btn_toggle" @click.stop="onToggleVisible"><i class="material-icons toggle_ico">more_horiz</i></button>
    </template>
    <template #toggle_items>
      <li v-for="(value, key) in toggleItems" :key="key" @click.stop="value">{{ key }}</li>
    </template>
  </Toggle>
</template>

<script>
import { ref } from 'vue'
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
    const toggle = ref(null)

    const onToggleVisible = () => {
      toggle.value.toggleVisible()
    }

    return {
      toggle,
      onToggleVisible,
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
    ul {
      width: 9.6rem;
      border-radius: 2.4rem;
      padding: 0.8rem 1.2rem;
      box-shadow: 0 0.1rem 2rem rgb(0 0 0 / 16%);

      li {
        display: flex;
        justify-content: center;
        padding: 0.4rem 0;
        margin: 0.8rem 0;
        font-size: 1.2rem;
        color: var(--input_text);
      }
    }
  }
}
</style>
