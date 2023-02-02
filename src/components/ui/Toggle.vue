<template>
  <div class="toggle">
    <Ico
      class="ico_toggle"
      :svg="isPublic ? 'toggle' : 'toggle-fill'"
      :size="'xl'"
      :customColor="isPublic ? 'var(--disable)' : 'var(--primary)'"
      @click="onToggle()"
    />

    <span :style="[isPublic ? { color: 'var(--text3)' } : { color: 'var(--primary)' }]">
      {{ isPublic ? '공개' : '비밀' }}
    </span>
  </div>
</template>

<script setup>
  import { defineProps, defineEmits } from 'vue'

  const props = defineProps({
    isPublic: {
      type: Boolean,
    },
  })

  const emit = defineEmits(['updateIsPublic'])

  const onToggle = () => {
    emit('updateIsPublic', !props.isPublic)
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .toggle {
    display: flex;
    cursor: pointer;
    align-items: center;
    user-select: none;
    line-height: 1.5;

    .ico_toggle {
      transition: all 0.3s;
    }

    span {
      font-size: 1.2rem;
      margin: 0 0 0 0.4rem;
      letter-spacing: 0.1rem;
    }
  }
</style>
