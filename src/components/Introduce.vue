<template>
  <div class="introduce">{{ introduce }}</div>
</template>

<script setup>
  import { defineProps } from 'vue'

  const props = defineProps({
    introduce: {
      type: String,
      default: '소개를 작성해 보세요.',
    },
  })
</script>
