<template></template>

<script>
  import { ref } from 'vue'

  export default {
    setup() {
      let options = {
        root: document.querySelector('#root'),
        rootMargin: '0px',
        threshold: 1.0,
      }

      let observer = new IntersectionObserver(callback, options)

      return {}
    },
  }
</script>

<style scoped></style>
