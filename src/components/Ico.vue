<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" v-if="svg">
    <path />
  </svg>
</template>

<script>
  import { computed } from 'vue'

  export default {
    name: 'Ico',
    props: {
      svg: {
        type: String,
      },
      size: {
        type: String,
      },
      customColor: {
        type: String,
      },
    },
    setup(props) {
      const state = computed(() => ({
        svgPath: props.svg ? `path(var(--Ico-${props.svg}))` : '',
        svgSize: props.svg ? `var(--Ico-${props.size})` : 'var(--Ico-md)',
        fill: props.customColor ? props.customColor : 'currentColor',
      }))

      return { state }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  svg {
    width: v-bind('state.svgSize');
    height: v-bind('state.svgSize');
    fill: v-bind('state.fill');

    path {
      d: v-bind('state.svgPath');
    }
  }
</style>
