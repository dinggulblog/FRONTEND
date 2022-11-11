<template>
  <li v-if="comment.isActive" class="comment_item">
    <div class="wrap_header">
      <div class="wrap_left">
        <CommentInfoSlot :comment="comment" />
        <div class="wrap_reply_btn">
          <button v-if="!isVisible" class="btn_reply" @click="onCommentEditor">답글 작성</button>
          <button v-else class="btn_reply" @click="onCommentEditor">답글 작성 취소</button>
        </div>
      </div>
      <div class="wrap_right"></div>
    </div>
    <div class="content">
      <p v-if="!isAuthorized">비밀 댓글입니다. 작성자와 관리자만 볼 수 있어요</p>
      <p v-else>{{ comment.content }}</p>
    </div>
    <CommentEditor v-if="isVisible" :post="post" :comment="comment" />
  </li>

  <li v-else>
    <p>해당 댓글은 삭제된 댓글입니다.</p>
  </li>

  <ul style="margin-left: 8rem" v-if="comment.childComments">
    <CommentSlot v-for="child in comment.childComments" :key="child._id" :comment="child" :post="post" :isAuthorized="isAuthorized" />
  </ul>
</template>

<script>
import ToggleSlot from './ToggleSlot.vue'
import CommentInfoSlot from './CommentInfoSlot.vue'
import CommentEditor from '../CommentEditor.vue'
import { ref } from 'vue'

export default {
  name: 'CommentSlot',
  components: {
    CommentInfoSlot,
    CommentEditor,
  },
  props: {
    comment: {
      type: Object,
      required: true,
    },
    post: {
      type: Object,
      required: true,
    },
    isAuthorized: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const isVisible = ref(false)

    const onCommentEditor = () => {
      !isVisible.value ? (isVisible.value = true) : (isVisible.value = false)
    }
    return {
      isVisible,
      onCommentEditor,
    }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss">
.comment_item {
  margin: 0 0 6.4rem;

  .wrap_header {
    display: flex;
    align-items: center;
    margin: 0 0 3.2rem;

    .wrap_left {
      display: flex;
      align-items: center;

      .wrap_reply_btn {
        margin: 0 0 0 3.2rem;

        .btn_reply {
          font-size: 1.2rem;
          color: var(--primary-dark);
        }
      }
    }
  }

  .content {
    color: #bababa;
    font-size: 1.4rem;
  }
}
</style>
