<template>
  <button class="btn" type="button" :style="customState" @click="$emit('onClick')" ref="BTN_EL">
    <Ico :svg="svg" :size="size" :customColor="customColor"></Ico>
    {{ content }}
  </button>
</template>

<script>
  import { computed, ref } from 'vue'
  import Ico from './Ico.vue'

  export default {
    name: 'Button',
    components: {
      Ico,
    },
    props: {
      content: {
        type: String,
      },
      size: {
        type: String,
        validator: (value) => ['xs', 'sm', 'md', 'lg'].includes(value),
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
        svgMargin: props.svg && props.content ? '0.8rem' : '',
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
      margin-right: v-bind('state.svgMargin');
    }
  }
</style>
