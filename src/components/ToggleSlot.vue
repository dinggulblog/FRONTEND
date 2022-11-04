<template>
  <template v-if="type === 'content'">
    <Toggle>
      <template #toggle_btn>
        <button><i class="material-icons">more_horiz</i></button>
      </template>
      <template #modify><li>글 수정</li></template>
      <template #delete><li>글 삭제</li></template>
      <template #copy><li>링크 복사</li></template>
    </Toggle>
  </template>

  <template v-if="type === 'comment'">
    <Toggle>
      <template #toggle_btn>
        <button><i class="material-icons">more_horiz</i></button>
      </template>
      <template #modify><li>댓글 수정</li></template>
      <template #delete><li>댓글 삭제</li></template>
    </Toggle>
  </template>
</template>

<script>
import Toggle from './Toggle.vue'

export default {
  name: 'ToggleSlot',
  components: {
    Toggle,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return {}
  },
}
</script>

<style lang="scss" rel="stylesheet/scss"></style>
