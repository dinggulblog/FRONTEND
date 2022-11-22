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
      },
      customFontSize: {
        type: String,
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
      },
      customBoderColor: {
        type: String,
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
        padding: props.size ? (props.customSize ? `${props.customSize}` : `var(--${props.size})`) : '0',
        fontSize: props.size
          ? props.customFontSize
            ? `${props.customFontSize}`
            : `var(--text-${props.size})`
          : '1.2rem',
        bgColor: props.fill ? (props.customBgColor ? `${props.customBgColor}` : `var(--${props.fill})`) : 'transparent',
        color: props.customColor
          ? `${props.customColor}`
          : props.fill || (props.fill && props.outline)
          ? '#fff'
          : props.outline
          ? `var(--${props.outline})`
          : `var(--text-light)`,
        border: props.outline ? (props.customBorder ? `solid +${props.customBorder}` : 'solid 0.2rem') : '0',
        borderRadius: props.rounded ? '3.2rem' : '0',
        borderColor: props.outline
          ? props.customBoderColor
            ? `${props.customBoderColor}`
            : `var(--${props.outline})`
          : 'transparent',
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
