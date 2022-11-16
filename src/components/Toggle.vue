<template>
  <div class="toggle">
    <span :style="[isPublic ? { color: '#BABABA' } : { color: 'var(--secondary)' }]">{{ isPublic ? '공개' : '비밀' }}</span>
    <i class="material-icons" :style="isPublic ? { color: '#E6E6E6' } : { color: 'var(--secondary)' }" @click="onToggle()">{{ isPublic ? 'toggle_off' : 'toggle_on' }}</i>
  </div>
</template>

<script>
export default {
  name: 'Toggle',
  props: {
    isPublic: {
      type: Boolean,
    },
  },
  setup(props, { emit }) {
    const onToggle = () => {
      emit('updateIsPublic', !props.isPublic)
    }
    return { onToggle }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.toggle {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;

  i {
    font-size: 4.8rem;
  }

  span {
    font-size: 1.2rem;
    margin: 0 0.4rem 0 0;
    letter-spacing: 0.1rem;
  }
}
</style>
