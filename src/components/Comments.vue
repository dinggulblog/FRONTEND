<template>
  <div class="comment">
    <CommentEditor :post="post" />

    <div class="comments" v-if="commentCount">
      <h2>댓글 {{ commentCount }}개</h2>
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
  import CommentSlot from './slotdata/CommentSlot.vue'

  export default defineComponent({
    components: {
      CommentEditor,
      CommentSlot,
    },
    props: {
      comments: {
        type: Object,
      },
      commentCount: {
        type: Number,
        default: 0
      },
      post: {
        type: Object,
      },
      profile: {
        type: Object,
      },
    },
    setup(props, { emit }) {
      const onGetAuthorized = (comment) => {
        if (comment.isPublic) {
          return true
        } else if (props.profile && props.post.author?.nickname === props.profile.nickname) {
          return true
        } else if (props.profile && comment.commenter.nickname === props.profile.nickname) {
          return true
        }
        return false
      }

      const onDeleteComment = (comment) => {
        emit('onDeleteComment', comment)
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
