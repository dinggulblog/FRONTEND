<template>
  <div class="comment">
    <CommentEditor :post="post" />

    <div class="comments" v-if="comments.length">
      <h2>댓글 {{ comments.length }}개</h2>
      <ul class="comment_items">
        <CommentSlot
          v-for="comment in comments"
          :key="comment._id"
          :comment="comment"
          :post="post"
          :isAuthorized="onGetAuthorized(comment)"
          @onDeleteComment="onDeleteComment"
        />
      </ul>
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue'
  import CommentEditor from './CommentEditor.vue'
  import CommentSlot from '../components/slots/CommentSlot.vue'

  export default defineComponent({
    name: 'post',
    components: {
      CommentEditor,
      CommentSlot,
    },
    props: {
      comments: {
        type: Object,
      },
      post: {
        type: Object,
      },
      user: {
        type: Object,
      },
    },
    setup(props, { emit }) {
      const onGetAuthorized = (comment) => {
        if (comment.isPublic) {
          return true
        } else if (props.user && props.post.author?.nickname === props.user.nickname) {
          return true
        } else if (props.user && comment.commenter.nickname === props.user.nickname) {
          return true
        }
        return false
      }

      const onDeleteComment = (commentId) => {
        emit('onDeleteComment', commentId)
      }

      return {
        onGetAuthorized,
        onDeleteComment,
      }
    },
  })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .comment {
    .comments {
      margin: 6.4rem 0 0;

      h2 {
        color: var(--list_info-dark);
        font-weight: 400;
        font-size: 1.6rem;
        margin: 0 0 3.2rem 0;
      }
    }
  }
</style>
