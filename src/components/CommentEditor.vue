<template>
  <div class="commentEditor">
    <textarea v-model="content" ref="contentEl" :placeholder="[curRouteParams.title === 'guest' ? '방명록을 작성해보세요' : placeholderText]" @focus="placeholder = ''" @blur="placeholder = [curRouteParams.title === 'guest' ? '방명록을 작성해보세요' : placeholderText]"></textarea>

    <div class="wrap_btns">
      <div class="wrap_toggle">
        <div class="toggle">
          <i class="material-icons" v-text="isPublic ? 'toggle_off' : 'toggle_on'" :style="[isPublic ? { color: 'var(--list_info-light)' } : { color: 'var(--secondary)' }]" @click="onIsPublic()"></i>
          <span v-text="isPublic ? 'Public' : 'Secret'" :style="[isPublic ? { color: 'var(--list_info-dark)' } : { color: 'var(--secondary)' }]"></span>
        </div>
      </div>
      <div class="wrap_submit">
        <div class="submit">
          <button class="btn_submit" @click="onSubmit()">Comment</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onBeforeMount, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'app',
  props: {
    curRouteParams: {
      type: Object,
    },
    pid: {
      type: String,
    },
    comment: {
      type: Object,
    },
    commentState: {
      type: String,
    },
  },
  emits: ['updatedComment'],
  setup(props, { emit }) {
    const { dispatch } = useStore()
    const content = ref('')
    const contentEl = ref()
    const isPublic = ref(true)
    const placeholderText = ref('코멘트를 작성해보세요')

    const onIsPublic = () => {
      isPublic.value = !isPublic.value
      console.log(isPublic.value)
    }

    const onSubmit = async () => {
      const response = await dispatch(props.comment && props.commentState == 'edit' ? 'comment/updateComment' : 'comment/createComment', {
        id: props.comment && props.commentState == 'edit' ? props.comment._id : undefined,
        postId: props.pid,
        parentId: props.comment && props.commentState == 'reply' ? props.comment._id : undefined,
        content: content.value,
        isPublic: isPublic.value,
      })
      content.value = ''
      isPublic.value = true
      emit('updatedComment', 'view')
      if (!response.success) alert(response.message)
    }

    onBeforeMount(async () => {
      if (props.comment && props.commentState == 'edit') {
        content.value = props.comment.content
      } else if (props.comment && props.commentState == 'reply') {
        placeholderText.value = ''
      }
    })

    onMounted(async () => {
      props.comment ? contentEl.value.focus() : undefined
    })

    return { content, contentEl, isPublic, placeholderText, onIsPublic, onSubmit }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.commentEditor {
  display: flex;
  flex-direction: column;
  margin: 4.8rem 0 0 0;

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
