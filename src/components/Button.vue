<template>
  <button class="btn" @click="$emit('onClick')" ref="BTN_EL">{{ content }}</button>
</template>

<script>
import { computed, ref } from 'vue'

const bgColors = ['primary', 'secondary', 'secondary-dark']

export default {
  name: 'Button',
  props: {
    className: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      default: 'button',
    },
    size: {
      type: String,
      default: 'md',
    },
    full: {
      type: Boolean,
      default: false,
    },
    fill: {
      type: Boolean,
      default: true,
    },
    stroke: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    bgColor: {
      type: String,
      default: 'primary-dark',
    },
    textColor: {
      type: String,
      default: '#fff',
    },
  },
  setup(props) {
    const BTN_EL = ref(null)
    const sizes = {
      sm: '0.8rem 1.2rem',
      md: '1.2rem 2.4rem',
      lg: '2.4rem 3.2rem',
    }

    const state = computed(() => ({
      width: props.full ? '100%' : 'auto',
      padding: sizes[props.size] ? sizes[props.size] : props.size,
    }))

    if (bgColors.includes(props.bgColor)) {
      BTN_EL.value.setProperty('--bgColor', props.bgColor)
    }

    return {
      BTN_EL,
      state,
    }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.btn {
  --bgColor: var(--primary-dark);

  width: v-bind('state.width');
  padding: v-bind('state.padding');
  color: v-bind(textColor);
  background-color: var(--bgColor);
  border: 0;
  font-weight: 500;
  font-size: 1.2rem;
}
</style>
