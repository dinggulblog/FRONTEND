<template>
  <button class="btn" :class="className" @click="$emit('onClick')" ref="BTN_EL">
    {{ content }}
  </button>
</template>

<script>
  import { computed, onMounted, ref } from 'vue'

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
        validator: (value) => ['sm', 'md', 'lg'].includes(value),
      },
      customSize: {
        type: String,
        default: '0',
      },
      customFontSize: {
        type: String,
        default: '1.2rem',
      },
      fill: {
        type: String,
        validator: (value) => ['primary', 'primary-dark', 'secondary', 'secondary-dark'].includes(value),
      },
      outline: {
        type: String,
        validator: (value) => ['primary', 'primary-dark', 'secondary', 'secondary-dark'].includes(value),
      },
      color: {
        type: String,
      },
      customBgColor: {
        type: String,
        default: 'transparent',
      },
      customBoderColor: {
        type: String,
        default: 'transparent',
      },
      customColor: {
        type: String,
      },
      customBorder: {
        type: String,
      },
      full: {
        type: Boolean,
        default: false,
      },
      rounded: {
        type: Boolean,
        default: false,
      },
    },
    setup(props) {
      const state = computed(() => ({
        width: props.full ? '100%' : 'auto',
        padding: props.size ? `var(--${props.size})` : `${props.customSize}`,
        fontSize: props.size ? `var(--text-${props.size})` : `${props.customFontSize}`,
        bgColor: props.fill ? `var(--${props.fill})` : `${props.customBgColor}`,
        color: props.customColor
          ? `${props.customColor}`
          : props.fill || (props.fill && props.outline)
          ? '#fff'
          : props.outline
          ? `var(--${props.outline})`
          : `var(--text-light)`,
        border: props.outline ? (props.customBorder ? `solid +${props.customBorder}` : 'solid 0.2rem') : '0',
        borderRadius: props.rounded ? '3.2rem' : '0',
        borderColor: props.outline ? `var(--${props.outline})` : `${props.customBoderColor}`,
      }))

      return {
        state,
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .btn {
    width: v-bind('state.width');
    padding: v-bind('state.padding');
    color: v-bind('state.color');
    background-color: v-bind('state.bgColor');
    border: v-bind('state.border');
    border-color: v-bind('state.borderColor');
    border-radius: v-bind('state.borderRadius');
    font-size: v-bind('state.fontSize');
    font-weight: 500;
  }
</style>
