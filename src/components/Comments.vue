<template>
  <div class="comment">
    <CommentEditor :postId="postId" />

    <div class="comments" ref="COMMENTS_EL">
      <h2>댓글 {{ commentCount }}개</h2>
      <ul class="comment_items">
        <CommentSlot
          v-for="comment in comments"
          :key="comment._id"
          :comment="comment"
          :postId="postId"
          :author="author"
          :userId="userId"
        />
      </ul>
    </div>
  </div>
</template>

<script setup>
  import { defineProps, ref, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import CommentEditor from './CommentEditor.vue'
  import CommentSlot from './slotdata/CommentSlot.vue'

  const props = defineProps({
    postId: {
      type: String,
      required: true,
      default: '',
    },
    author: {
      type: String,
      required: true,
      default: '',
    },
    userId: {
      type: String,
      required: false,
      default: '',
    },
    comments: {
      type: Array,
      default: () => [],
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    quickMove: {
      type: Boolean,
      default: false,
    },
  })

  const { dispatch } = useStore()

  const COMMENTS_EL = ref(null)

  await dispatch('comment/getComments', props.postId)

  onMounted(() => {
    if (props.quickMove && COMMENTS_EL.value) {
      COMMENTS_EL.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .comment {
    .comments {
      margin: 6.4rem 0 0;
    }

    h2 {
      color: var(--primary);
      font-weight: 400;
      font-size: 1.6rem;
      margin: 0 0 3.2rem 0;
    }
  }
</style>
