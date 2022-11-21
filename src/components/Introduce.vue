<template>
  <div class="introduce">{{ introduce }}</div>
</template>

<script>
  import { defineComponent } from 'vue'

  export default defineComponent({
    props: {
      introduce: {
        type: String,
        default: '소개를 작성해 보세요.',
      },
    },
    setup(props) {},
  })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .introduce {
    font-size: 1.6rem;
    color: var(--primary);
  }
</style>
