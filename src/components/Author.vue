<template>
  <div class="author">
    <slot name="avatar"></slot>
    <slot name="nickname"></slot>
  </div>
</template>

<script>
export default {
  name: 'Author',
}
</script>

<style lang="scss" rel="stylesheet/scss">
.author {
  display: flex;
  align-items: center;
  flex-direction: row-reverse;

  .nickname {
    font-family: 'Noto Sans KR';
  }
  .avatar {
    width: 3.2rem;
    height: 3.2rem;
    border-radius: 50%;
    margin: 0 0 0 1.2rem;
  }
}
</style>
