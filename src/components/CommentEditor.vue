<template>
  <div class="commentEditor">
    <textarea v-model="content" ref="contentEl" :placeholder="[curRouteParams.title === 'guest' ? '방명록을 작성해보세요' : placeholderText]" @focus="placeholder = ''" @blur="placeholder = [curRouteParams.title === 'guest' ? '방명록을 작성해보세요' : placeholderText]"></textarea>

    <div class="wrap_btns">
      <div class="toggle">
        <i class="material-icons" v-text="isPublic ? 'toggle_off' : 'toggle_on'" @click="onIsPublic()"></i>
        <span v-text="isPublic ? 'Public' : 'Secret'" :style="[isPublic ? { color: '#B5B5B5' } : { color: 'var(--point)' }]"></span>
      </div>
      <div class="submit_btn">
        <button class="btn_submit" @click="onSubmit()">Comment</button>
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
    background: #ededed;
    color: var(--input_text);
    font-size: 1.4rem;
    border: 0;
    border-radius: 1.8rem;
    padding: 2.4rem;
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

    .toggle {
      flex-basis: 50%;
      display: flex;
      align-items: center;

      i {
        font-size: 4.8rem;
        margin: 0 0.8rem 0 0;
      }

      span {
        font-size: 1.2rem;
        font-weight: 500;
        letter-spacing: 0.1rem;
      }
    }

    .submit_btn {
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
