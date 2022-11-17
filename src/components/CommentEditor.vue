<template>
  <div class="commentEditor">
    <textarea v-model="content" ref="contentEl" onfocus="this.placeholder = ''" @blur="handlerBlur"> </textarea>

    <div class="wrap_btns">
      <div class="wrap_toggle">
        <Toggle :isPublic="isPublic" @updateIsPublic="onUpdatedIsPublic" />
      </div>
      <div class="wrap_submit">
        <div class="submit">
          <button class="btn_submit" @click="!isUpdate ? onCreateComment() : onUpdateComment()">{{ !isUpdate ? '댓글 작성' : '댓글 수정' }}</button>
          <Button :className="'btn-submit'" :content="!isUpdate ? '댓글 작성' : '댓글 수정'" :rounded="true"></Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import Toggle from '../components/Toggle.vue'
import Button from '../components/Button.vue'

export default {
  components: {
    Toggle,
    Button,
  },
  props: {
    post: {
      type: Object,
      required: true,
    },
    comment: {
      type: Object,
    },
    isAuthorized: {
      type: Boolean,
    },
    placeholderText: {
      type: String,
      default: '코멘트를 작성해보세요',
    },
    isUpdate: {
      type: Boolean,
    },
  },
  setup(props, { emit }) {
    const route = useRoute()
    const { dispatch } = useStore()
    const contentEl = ref(null)
    const parentId = ref(null)

    const content = ref('')
    const isPublic = ref(true)

    const handlerBlur = () => {
      contentEl.value.placeholder = props.placeholderText
    }

    const onUpdatedIsPublic = (state) => {
      isPublic.value = state
    }

    const onCreateComment = async () => {
      await dispatch('comment/createComment', {
        postId: props.post._id,
        parentId: props.comment ? props.comment._id : '',
        content: content.value,
        isPublic: isPublic.value,
      })
      content.value = ''
      emit('closeEditor')
    }

    const onUpdateComment = async () => {
      await dispatch('comment/updateComment', {
        id: props.comment._id,
        postId: props.post._id,
        content: content.value,
        isPublic: isPublic.value,
      })
      content.value = ''
      emit('closeEditor')
    }

    onMounted(() => {
      contentEl.value.placeholder = props.placeholderText
      if (!props.comment) {
        return
      } else if (props.isUpdate) {
        content.value = props.comment.content
        contentEl.value.focus()
      } else {
        parentId.value = props.comment.parentComment
        contentEl.value.focus()
      }
    })

    return { route, content, contentEl, isPublic, handlerBlur, onUpdatedIsPublic, onCreateComment, onUpdateComment }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.commentEditor {
  display: flex;
  flex-direction: column;
  margin: 2.4rem 0 0 0;

  textarea {
    color: var(--input_text);
    font-size: 1.4rem;
    border: 1px solid #e5e5e5;
    border-radius: 0.8rem;
    padding: 2rem;
    resize: vertical;
    margin: 0 0 2.4rem;
    min-height: 12.8rem;

    &::placeholder {
      color: var(--input_text);
    }
  }

  .wrap_btns {
    display: flex;
    align-items: center;

    .wrap_toggle {
      flex-basis: 50%;

      .toggle {
        display: flex;
        align-items: center;
        user-select: none;
        cursor: pointer;

        i {
          font-size: 4.8rem;
        }

        span {
          margin: 0 0 0 0.8rem;
          font-size: 1.2rem;
          font-weight: 500;
          letter-spacing: 0.1rem;
        }
      }
    }

    .wrap_submit {
      display: flex;
      flex-basis: 50%;
      justify-content: flex-end;

      .btn_submit {
        width: 10.8rem;
        height: 4rem;
        background: var(--primary-dark);
        border-radius: 2rem;
        color: #fff;
        font-weight: 500;
        font-size: 1.2rem;
      }
    }
  }
}
</style>
