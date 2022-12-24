<template>
  <div ref="trigger"></div>
</template>

<script>
  import { onMounted, ref } from 'vue'

  export default {
    setup() {
      const trigger = ref(null)

      let options = {
        root: null,
        threshold: 1.0,
      }

      let observer = new IntersectionObserver(callback, options)

      let callback = (entries, observer) => {
        entries.forEach((entry) => {
          console.log('하잉')
        })
      }

      onMounted(() => {
        observer.observe(trigger.value)
      })

      return { trigger }
    },
  }
</script>

<style scoped></style>
