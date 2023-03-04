<template>
  <div class="user-info">
    <div class="wrap_avatar">
      <slot name="avatar"></slot>
      <slot name="avatar_upload"></slot>
    </div>
    <div class="wrap_nickname_greetings">
      <slot name="nickname"></slot>
      <slot name="greetings"></slot>
      <slot name="greetings_textarea"></slot>
    </div>
  </div>
</template>

<script></script>

<style lang="scss" rel="stylesheet/scss" scoped>
.user-info {
  display: flex;
  align-items: center;
  font-size: 1.3rem;
  color: var(--text3);
  font-weight: 500;

  .wrap_avatar {
    margin: 0 1.2rem 0 0;

    &:deep(.avatar) {
      width: 3.2rem;
      height: 3.2rem;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .wrap_nickname_greetings {
    line-height: 1.5;
  }
}
</style>
