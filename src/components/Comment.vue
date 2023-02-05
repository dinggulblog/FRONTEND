<template>
  <li v-if="comment.isActive" class="comment_item">
    <div class="wrap_item">
      <div class="wrap_header">
        <div class="wrap_left">
          <!-- Comment Info -->

          <User :profile="comment.commenter" />

          <Info>
            <template #createdAt>
              <li>
                <span class="createdAt">{{ dayjs(comment.createdAt).format('YYYY년 M월 D일') }}</span>
              </li>
            </template>
          </Info>

          <div class="wrap_reply_btn">
            <Button
              class="btn_reply"
              :content="!isVisible.commentEditor ? '답글 작성' : '에디터 닫기'"
              :theme="'primary'"
              @click="!isVisible.commentEditor ? onCreateEditor() : onCloseEditor()"
            />
          </div>
        </div>
        <div class="wrap_right">
          <Button
            class="btn_dropbox"
            :size="'sm'"
            :svg="'more'"
            @click="$refs.ACTION_SLOT_EL.onToggle()"
          />

          <Action ref="ACTION_SLOT_EL" :dropboxItems="dropboxItems" />
        </div>
      </div>
      <div class="content">
        <p>
          <span v-if="comment.parentComment" class="receiver">@ {{ parentComment?.commenter?.nickname }}</span>
          <Ico v-if="!comment.isPublic" class="lock_ico" :size="'sm'" :svg="'lock'" :color="'var(--text2)'" />
          <span v-if="!isAuthorized">비밀 댓글입니다. 작성자와 관리자만 볼 수 있어요</span>
          <span v-else>{{ comment.content }}</span>
        </p>
        <Button
          v-if="comment.childCommentCount"
          class="btn_childComment_toggle"
          :svg="!isVisible.childComments ? 'arrow-down' : 'arrow-up'"
          :size="'xs'"
          :content="'답글 ' + comment.childCommentCount + '개'"
          :theme="'primary'"
          @click="!isVisible.childComments ? onDisplayChildComment() : onHiddenChildComment()"
        />
      </div>
      <CommentEditor
        v-if="isVisible.commentEditor"
        :postId="postId"
        :comment="comment"
        :isUpdate="isUpdate"
        @closeEditor="onCloseEditor"
      />
    </div>

    <ul class="comment_childItem" v-if="comment.childComments && isVisible.childComments">
      <CommentSlot
        v-for="childComment in comment.childComments"
        :key="childComment._id"
        :comment="childComment"
        :postId="postId"
        :author="author"
        :userId="userId"
      />
    </ul>
  </li>

  <!-- Non-active Comment -->
  <li v-else class="not-is-acitve">
    <div class="content">
      <p>** 해당 댓글은 삭제된 댓글입니다 **</p>

      <Button
        v-if="comment.childCommentCount"
        class="btn_childComment_toggle"
        :svg="!isVisible.childComments ? 'arrow-down' : 'arrow-up'"
        :size="'xs'"
        :content="'답글 ' + comment.childCommentCount + '개'"
        :theme="'primary'"
        @click="!isVisible.childComments ? onDisplayChildComment() : onHiddenChildComment()"
      />
    </div>

    <ul class="comment_childItem" v-if="comment.childComments && isVisible.childComments">
      <CommentSlot
        v-for="childComment in comment.childComments"
        :key="childComment._id"
        :comment="childComment"
        :postId="postId"
        :author="author"
        :userId="userId"
      />
    </ul>
  </li>
</template>

<script setup>
  import { defineProps, ref, reactive, computed, inject, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import CommentEditor from './CommentEditor.vue'
  import Action from './Action.vue'
  import User from './User.vue'
  import dayjs from 'dayjs'
  import Info from './slots/Info.vue'

  const props = defineProps({
    comment: {
      type: Object,
      required: true,
      default: () => ({}),
    },
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
  })

  const { getters, dispatch } = useStore()

  const DIALOG_EL = inject('DIALOG_EL')
  const TOAST_EL = inject('TOAST_EL')
  const ACTION_SLOT_EL = ref(null)

  const isUpdate = ref(false)
  const dropboxItems = reactive({})
  const isVisible = reactive({
    commentEditor: false,
    childComments: false,
  })
  const isAuthorized = computed(
    () => props.comment.isPublic || props.author === props.userId || props.comment?.commenter?._id === props.userId
  )
  const parentComment = computed(() => getters['comment/getParentComment'](props.comment?.parentComment))

  const setDropboxItems = () => {
    if (props.comment?.commenter?._id === props.userId) {
      dropboxItems['댓글 수정'] = onUpdateEditor
      dropboxItems['댓글 삭제'] = onDeleteComment
    }
    dropboxItems['댓글 복사'] = onCopyComment
  }

  const onCreateEditor = () => {
    isUpdate.value = false
    isVisible.commentEditor = true
  }

  const onUpdateEditor = () => {
    isUpdate.value = true
    isVisible.commentEditor = true
  }

  const onCloseEditor = () => {
    isVisible.commentEditor = false
  }

  const onDisplayChildComment = () => {
    isVisible.childComments = true
  }

  const onHiddenChildComment = () => {
    isVisible.childComments = false
  }

  const onCopyComment = async () => {
    try {
      await navigator.clipboard.writeText(props.comment.content)
      TOAST_EL.value.open('success', '댓글 내용이 복사되었습니다')
    } catch (err) {
      TOAST_EL.value.open('error', '댓글 내용 복사에 실패하였습니다.')
    }
  }

  const onDeleteComment = async () => {
    const ok = await DIALOG_EL.value.show({
      title: '댓글 삭제',
      message: '해당 댓글을 삭제하시겠습니까?\n한번 삭제된 댓글은 되돌릴 수 없습니다.',
    })
    if (!ok) return

    const { success, error } = await dispatch('comment/deleteComment', {
      id: props.comment._id,
      postId: props.postId,
      commenterId: props.userId,
    })
    success ? TOAST_EL.value.open('success', '댓글이 삭제되었습니다.') : TOAST_EL.value.open('error', error)
  }

  onMounted(() => {
    setDropboxItems()
  })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .comment_items > li > ul {
    margin: -2.4rem 0 0 2.4rem;
  }

  .comment_item {
    .wrap_item {
      margin: 0 0 6.4rem;

      .wrap_header {
        display: flex;
        align-items: center;
        margin: 0 0 2.4rem;

        .wrap_left {
          display: flex;
          align-items: center;
          width: 90%;

          .wrap_reply_btn {
            margin: 0 0 0 3.2rem;
          }
        }

        .wrap_right {
          display: flex;
          flex-direction: column;
          flex-basis: 20%;
          align-items: flex-end;
          justify-content: center;
        }
      }

      .content {
        display: flex;
        flex-direction: column;

        &:deep(.btn) {
          justify-content: start;
        }

        p {
          display: flex;
          align-items: center;
          color: var(--text3);
          font-size: 1.4rem;

          .lock_ico {
            margin: 0 0.8rem 0 0;
          }

          .receiver {
            font-weight: 500;
            color: var(--primary);
            border-radius: 3.2rem;
            margin: 0 0.8rem 0 0;
          }
        }
      }
    }
  }

  .not-is-acitve {
    display: flex;
    flex-direction: column;
    margin: 0 0 0rem;
    font-size: 1.4rem;
    color: var(--text3);

    .content {
      margin: 0 0 6.4rem;
    }
  }

  .btn_childComment_toggle {
    margin: 2.4rem 0 0;
  }
</style>
