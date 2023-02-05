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
  import { defineProps } from 'vue'
  import Info from './slots/Info.vue'
  import { getTime } from '../common/time.js'

  const props = defineProps({
    post: {
      type: Object,
      required: true,
    },
  })
</script>
