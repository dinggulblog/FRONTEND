<template>
  <div class="observer" ref="TRIGGER_EL"></div>
</template>

<script setup>
  import { defineProps, defineEmits, onMounted, onUnmounted, ref } from 'vue'

  const props = defineProps({
    page: {
      type: Number,
    },
  })

  const emit = defineEmits(['updatePage'])

  const TRIGGER_EL = ref(null)

  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      // TRIGGER_EL.value가 보이지 않는다면 retrun
      if (!entry.isIntersecting) return

      onUpdatePage(props.page + 1)
    })
  }

  const observer = new IntersectionObserver(callback, { threshold: 1.0 })

  const onUpdatePage = (page) => {
    emit('updatePage', page)
  }

  onMounted(() => {
    observer.observe(TRIGGER_EL.value)
  })

  onUnmounted(() => {
    observer.disconnect()
  })
</script>

<style>
  .observer {
    width: 100%;
    height: 0;
  }
</style>
