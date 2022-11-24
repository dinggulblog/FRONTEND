<template>
  <button class="btn" :style="customState" @click="$emit('onClick')" ref="BTN_EL">
    <svg xmlns="http://www.w3.org/2000/svg" :viewBox="'0 0 24 24'" v-if="svg">
      <path />
    </svg>
    {{ content }}
  </button>
</template>

<script>
  import { computed, ref } from 'vue'

  const viewBox = {
    sm: '0 0 12 12',
    md: '0 0 24 24',
    lg: '0 0 32 32',
  }

  export default {
    name: 'Button',
    props: {
      content: {
        type: String,
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
      bgColor: {
        type: String,
        validator: (value) => ['primary', 'primary-dark', 'secondary', 'secondary-dark'].includes(value),
      },
      borderColor: {
        type: String,
        validator: (value) => ['primary', 'primary-dark', 'secondary', 'secondary-dark'].includes(value),
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
      customPadding: {
        type: String,
      },
      svg: {
        type: String,
        validator: (value) => ['home', 'search', 'create', 'row', 'grid'].includes(value),
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
      const svgPath = ref(null)

      const state = computed(() => ({
        width: props.full ? '100%' : 'auto',
        padding: props.size ? `var(--padding-${props.size})` : '0',
        fontSize: props.size ? `var(--text-${props.size})` : '1.2rem',
        bgColor: props.bgColor ? `var(--${props.bgColor})` : 'transparent',
        color: props.bgColor ? '#fff' : props.borderColor ? `var(--${props.borderColor})` : 'var(--text-light)',
        border: props.borderColor ? 'solid 0.2rem' : '0',
        borderRadius: props.rounded ? '3.2rem' : '0',
        borderColor: props.borderColor ? `var(--${props.borderColor})` : 'transparent',
        svgPath: props.svg ? `path(var(--Ico-${props.svg}))` : '',
        svgSize: props.svg ? `var(--Ico-${props.size})` : '',
        svgMargin: props.svg && props.content ? '0.8rem' : '',
        viewBox: props.size ? viewBox[props.size] : '0 0 24 24',
      }))

      const customState = computed(() => ({
        padding: props.customPadding ?? '',
        color: props.customColor ?? '',
        background: props.customBgColor ?? '',
        border: props.customBorder ?? '',
        borderColor: props.customBoderColor ?? '',
        fontSize: props.customFontSize ?? '',
      }))

      return {
        svgPath,
        state,
        customState,
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .btn {
    display: flex;
    align-items: center;
    justify-content: space-between;

    width: v-bind('state.width');
    padding: v-bind('state.padding');
    color: v-bind('state.color');
    background-color: v-bind('state.bgColor');
    border: v-bind('state.border');
    border-color: v-bind('state.borderColor');
    border-radius: v-bind('state.borderRadius');
    font-size: v-bind('state.fontSize');
    font-weight: 500;

    svg {
      width: 2.4rem;
      height: 2.4rem;
      margin: v-bind('state.svgMargin');
      fill: v-bind('state.color');

      path {
        d: v-bind('state.svgPath');
      }
    }
  }
</style>
