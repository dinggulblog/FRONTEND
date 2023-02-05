<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" v-if="svg">
    <path />
  </svg>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    svg: {
      type: String,
    },
    size: {
      type: String,
      default:'md',
    },
    color: {
      type: String,
    },
  })

  const state = computed(() => ({
    svgPath: props.svg ? `path(var(--Ico-${props.svg}))` : '',
    svgSize: props.svg ? `var(--Ico-${props.size})` : 'var(--Ico-md)',
    fill: props.color ? (props.color?.includes('primary') ? `var(--primary)` : props.color) : 'currentColor',
  }))
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
