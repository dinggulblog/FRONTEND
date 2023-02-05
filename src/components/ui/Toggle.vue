<template>
  <div class="toggle">
    <Ico
      class="ico_toggle"
      :svg="isActive ? 'toggle' : 'toggle-fill'"
      :size="'xl'"
      :color="isActive ? 'var(--disable)' : 'primary'"
      @click="emits('update', !isActive)"
    />

    <span :style="[isActive ? { color: 'var(--text3)' } : { color: 'var(--primary)' }]">
      {{ isActive ? '공개' : '비밀' }}
    </span>
  </div>
</template>

<script setup>
  const props = defineProps({
    isActive: {
      type: Boolean,
    },
  })

  const emits = defineEmits(['update'])
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
