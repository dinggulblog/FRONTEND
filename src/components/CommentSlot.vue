<template>
  <template v-if="comment.isActive">
    <Comment>
      <template #is-active>
        <div class="wrap_header">
          <div class="wrap_left">
            <InfoSlot :type="'comment'" :comment="comment"></InfoSlot>
            <div class="wrap_reply_btn">
              <button class="btn_reply">답글 작성</button>
            </div>
          </div>
          <div class="wrap_right">
            <ToggleSlot :type="'comment'"></ToggleSlot>
          </div>
        </div>
        <div class="content">
          <p>{{ comment.content }}</p>
        </div>
      </template>
    </Comment>
  </template>

  <template v-else>
    <Comment>
      <template #not-is-active>
        <div>
          <p>해당 댓글은 삭제된 댓글입니다.</p>
        </div>
      </template>
    </Comment>
  </template>

  <template v-if="comment.childComments">
    <Comment>
      <template #child>
        <ul style="margin-left: 8rem">
          <CommentSlot v-for="child in comment.childComments" :key="child._id" :comment="child" :curRouteParams="curRouteParams" :pid="pid" />
        </ul>
      </template>
    </Comment>
  </template>
</template>

<script>
import Comment from './Comment.vue'
import ToggleSlot from './ToggleSlot.vue'
import InfoSlot from './InfoSlot.vue'

export default {
  name: 'CommentSlot',
  components: {
    Comment,
    ToggleSlot,
    InfoSlot,
  },
  props: {
    comment: {
      type: Object,
      required: true,
    },
    curRouteParams: {
      type: Object,
    },
    pid: {
      type: String,
    },
  },
  setup(props) {
    return {}
  },
}
</script>

<style lang="scss" rel="stylesheet/scss"></style>
