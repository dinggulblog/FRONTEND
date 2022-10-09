<template>
  <div class="editor">
    <textarea v-model="content" ref="contentEl" :placeholder="[curRouteParams.title === 'guest' ? '방명록을 작성해보세요' : placeholderText]" @focus="placeholder = ''" @blur="placeholder = [curRouteParams.title === 'guest' ? '방명록을 작성해보세요' : placeholderText]" :style="[curRouteParams.title === 'guest' ? { minHeight: '18rem' } : { minHeight: '10.6rem' }]"></textarea>

    <div class="btns">
      <div class="toggle">
        <button class="material-icons" v-text="isPublic ? 'toggle_off' : 'toggle_on'" :style="[isPublic ? { color: '#E5E5E5' } : { color: 'var(--point)' }]" @click="onIsPublic()"></button>
        <span v-text="isPublic ? 'Public' : 'Secret'" :style="[isPublic ? { color: '#B5B5B5' } : { color: 'var(--point)' }]"></span>
      </div>
      <button class="submit" @click="onSubmit()">Comment</button>
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
.editor {
  display: grid;
  grid-template-rows: repeat(2, auto);

  textarea {
    background: var(--formBg);
    color: var(--primary);
    font-size: 1.4rem;
    border: 0;
    border-radius: 1.8rem;
    padding: 2.4rem;
    resize: vertical;
    margin: 0 0 2.4rem;

    &::placeholder {
      color: var(--primary);
    }
  }

  .btns {
    display: grid;
    grid-template-columns: auto 1fr auto;

    .toggle {
      grid-column: 1 / 2;
      display: grid;
      grid-template-columns: repeat(2, auto);
      align-items: center;

      button {
        grid-column: 1 / 2;
        font-size: 4.8rem;
        transition: all 300ms linear;
      }

      span {
        grid-column: 2 / 3;
        font-size: 1.2rem;
        font-weight: 500;
        margin-left: 0.8rem;
      }
    }

    button.submit {
      grid-column: 3 / 4;
      width: 10.8rem;
      height: 4rem;
      place-content: center;
      background: var(--point);
      color: #fff;
      font-weight: 500;
      font-size: 1.2rem;
      border-radius: 2rem;
    }
  }
}
</style>
