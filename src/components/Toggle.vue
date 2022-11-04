<template>
  <div id="toggle">
    <slot name="toggle_btn"></slot>
    <div class="wrap_toggle_items">
      <ul>
        <slot name="modify"></slot>
        <slot name="delete"></slot>
        <slot name="copy"></slot>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Toggle',
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped></style>
