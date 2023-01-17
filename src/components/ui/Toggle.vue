<template>
  <div class="toggle">
    <Ico
      class="ico_toggle"
      :svg="isPublic ? 'toggle' : 'toggle-fill'"
      :size="'xl'"
      :customColor="isPublic ? '#E6E6E6' : 'var(--secondary)'"
      @click="onToggle()"
    />

    <span :style="[isPublic ? { color: '#BABABA' } : { color: 'var(--secondary)' }]">
      {{ isPublic ? '공개' : '비밀' }}
    </span>
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
