<template>
  <div class="info">
    <ul>
      <slot name="author"></slot>
      <slot name="createdAt"></slot>
      <slot name="category"></slot>
      <slot name="reply_count"></slot>
      <slot name="is-public"></slot>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Info',
}
</script>

<style lang="scss" rel="stylesheet/scss">
.info {
  ul {
    display: flex;
    align-items: center;

    li {
      margin: 0 2.4rem 0 0;
      padding: 0 0 0 2.4rem;
      display: flex;
      align-items: center;
      position: relative;

      span {
        font-size: 1.3rem;
        color: var(--list_info-dark);
      }

      &::before {
        content: '';
        position: absolute;
        left: 0;
        width: 0.01rem;
        height: 1.2rem;
        background-color: var(--border-dark);
      }

      &:first-child {
        padding: 0;

        &::before {
          display: none;
        }
      }

      &:last-child {
        margin: 0;
      }

      .author {
        display: flex;
        align-items: center;
        flex-direction: row;

        .avatar {
          margin: 0 1.2rem 0 0;
        }
      }

      .info_ico {
        i {
          font-size: 1.6rem;
          margin-top: 0.2rem;
        }
      }
    }
  }
}
</style>
