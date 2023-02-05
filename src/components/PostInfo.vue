<template>
  <Info>
    <template #createdAt>
      <li>
        <span class="createdAt">{{ getTime(post.createdAt) }}</span>
      </li>
    </template>

    <template #category>
      <li>
        <span class="category">{{ post.category }}</span>
      </li>
    </template>
  </Info>
</template>

<script setup>
  import { getTime } from '../common/time.js'
  import Info from './slots/Info.vue'
  
  const props = defineProps({
    post: {
      type: Object,
      required: true,
    },
  })
</script>
