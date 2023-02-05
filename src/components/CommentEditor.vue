<template>
  <div class="commentEditor" @click="!isLogin && ACCOUNT_EL.open('login')">
    <textarea
      ref="CONTENT_EL"
      rows="1"
      v-model="content"
      :disabled="!isLogin"
      @blur="handlerBlur"
      @input="resizeTextarea"
    />

    <div class="wrap_btns">
      <div class="wrap_toggle">
        <Toggle :isActive="isPublic" @update="onUpdatedIsPublic" />
      </div>
      <div class="wrap_submit">
        <div class="submit">
          <Button class="btn_submit" :shape="'fill-round'" :theme="'primary'" @click="!isUpdate ? onCreateComment() : onUpdateComment()">
            {{ !isUpdate ? '댓글 작성' : '댓글 수정' }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { inject, ref, onMounted, watch, computed } from 'vue'
  import { useStore } from 'vuex'
  import { resizeTextarea } from '../common/util.js'
  import Toggle from './ui/Toggle.vue'

  const props = defineProps({
    postId: {
      type: String,
      default: '',
    },
    comment: {
      type: Object,
    },
    isUpdate: {
      type: Boolean,
    },
    isAuthorized: {
      type: Boolean,
    },
    placeholderText: {
      type: String,
      default: '댓글을 작성해보세요.',
    },
  })

  const emit = defineEmits(['closeEditor'])

  const { state, dispatch } = useStore()
  const isLogin = computed(() => state.auth.isLogin)

  const CONTENT_EL = ref(null)
  const ACCOUNT_EL = inject('ACCOUNT_EL')

  const parentId = ref(null)
  const content = ref('')
  const isPublic = ref(true)
  const placeholderText = computed(() => (isLogin.value ? props.placeholderText : '로그인 후 댓글을 작성해보세요.'))

  const handlerBlur = () => {
    CONTENT_EL.value.placeholder = placeholderText.value
  }

  const onUpdatedIsPublic = (state) => {
    if (!isLogin.value) return
    isPublic.value = state
  }

  const onCreateComment = async () => {
    if (!isLogin.value) return
    await dispatch('comment/createComment', {
      postId: props.postId,
      parentId: props.comment ? props.comment._id : '',
      content: content.value,
      isPublic: isPublic.value,
    })
    content.value = ''
    isPublic.value = true
    emit('closeEditor')
    CONTENT_EL.value.style.height = ''
  }

  const onUpdateComment = async () => {
    if (!isLogin.value) return
    await dispatch('comment/updateComment', {
      id: props.comment._id,
      postId: props.postId,
      content: content.value,
      isPublic: isPublic.value,
    })
    content.value = ''
    isPublic.value = true
    emit('closeEditor')
    CONTENT_EL.value.style.height = ''
  }

  const remountContent = () => {
    CONTENT_EL.value.placeholder = placeholderText.value
    if (!props.comment) {
      return
    } else if (props.isUpdate) {
      content.value = props.comment.content
    } else {
      parentId.value = props.comment.parentComment
    }
    CONTENT_EL.value.focus()
  }

  onMounted(() => {
    remountContent()
  })

  watch(() => props.isUpdate, remountContent)
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .commentEditor {
    display: flex;
    flex-direction: column;
    margin: 2.4rem 0 0 0;
    border: 1px solid var(--border2);
    border-radius: 0.8rem;
    padding: 2rem;

    textarea {
      color: var(--text4);
      font-size: 1.4rem;
      margin: 0 0 1.6rem;
      resize: none;
      overflow-y: hidden;
      height: 4.8rem;

      &::placeholder {
        color: var(--text2);
      }

      &:disabled {
        background-color: transparent;
      }
    }

    .wrap_btns {
      display: flex;
      align-items: flex-end;

      .wrap_toggle {
        flex-basis: 50%;

        .toggle {
          display: flex;
          align-items: center;
          user-select: none;
          cursor: pointer;

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
      }
    }
  }
</style>
