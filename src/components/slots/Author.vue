<template>
  <div class="author">
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

<script>
</script>

<style lang="scss" rel="stylesheet/scss"></style>
