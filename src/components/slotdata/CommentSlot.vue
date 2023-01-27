<template>
  <li v-if="comment.isActive" class="comment_item">
    <div class="wrap_item">
      <div class="wrap_header">
        <div class="wrap_left">
          <!-- Comment Info -->
          <CommentInfoSlot :comment="comment" />

          <div class="wrap_reply_btn">
            <Button
              v-if="!isVisible.commentEditor"
              class="btn_reply"
              :content="'답글 작성'"
              :customPadding="'0'"
              :customColor="`var(--primary)`"
              @click="onCreateEditor"
            />

            <Button
              v-else
              class="btn_reply"
              :content="'에디터 닫기'"
              :customPadding="'0'"
              :customColor="`var(--primary)`"
              @click="onCloseEditor"
            />
          </div>
        </div>
        <div class="wrap_right">
          <Button
            class="btn_dropbox"
            :size="'sm'"
            :svg="'more'"
            :customPadding="'0'"
            :customColor="`var(--text2)`"
            @click="onAction"
          />

          <ActionSlot ref="ACTION_SLOT_EL" :dropboxItems="dropboxItems" />
        </div>
      </div>
      <div class="content">
        <p>
          <span v-if="comment.parentComment" class="receiver">@ {{ parentComment?.commenter?.nickname }}</span>
          <Ico v-if="!comment.isPublic" class="lock_ico" :size="'sm'" :svg="'lock'" :customColor="'var(--text2)'" />
          <span v-if="!isAuthorized">비밀 댓글입니다. 작성자와 관리자만 볼 수 있어요</span>
          <span v-else>{{ comment.content }}</span>
        </p>
        <Button
          v-if="comment.childCommentCount"
          class="btn_childComment_toggle"
          :svg="!isVisible.childComments ? 'arrow-down' : 'arrow-up'"
          :size="'xs'"
          :content="'답글 ' + comment.childCommentCount + '개'"
          :customColor="'var(--primary)'"
          :customFontSize="'1.4rem'"
          :customPadding="'0'"
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
  <li class="not-is-acitve" v-else>
    <div class="content">
      <p>** 해당 댓글은 삭제된 댓글입니다 **</p>

      <Button
        v-if="comment.childCommentCount"
        class="btn_childComment_toggle"
        :svg="!isVisible.childComments ? 'arrow-down' : 'arrow-up'"
        :size="'xs'"
        :content="'답글 ' + comment.childCommentCount + '개'"
        :customColor="'var(--primary)'"
        :customFontSize="'1.4rem'"
        :customPadding="'0'"
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

<script>
  import { ref, reactive, computed, inject, onBeforeMount } from 'vue'
  import { useStore } from 'vuex'
  import CommentInfoSlot from './CommentInfoSlot.vue'
  import CommentEditor from '../CommentEditor.vue'
  import ActionSlot from './ActionSlot.vue'

  export default {
    name: 'CommentSlot',
    components: {
      CommentInfoSlot,
      CommentEditor,
      ActionSlot,
    },
    props: {
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
    },
    setup(props) {
      const { state, getters, dispatch } = useStore()

      const DIALOG_EL = inject('DIALOG_EL')
      const TOAST_EL = inject('TOAST_EL')
      const ACTION_SLOT_EL = ref(null)

      const isUpdate = ref(false)
      const isVisible = reactive({
        commentEditor: false,
        childComments: false,
      })
      const isAuthorized = computed(
        () => props.comment?.isPublic || props.author === props.userId || props.comment?.commenter?._id === props.userId
      )

      const profile = reactive({
        nickname: computed(() => state.auth.profile.nickname),
      })

      const parentComment = computed(() => getters['comment/getParentComment'](props.comment?.parentComment))

      const dropboxItems = reactive({})

      const setDropboxItems = () => {
        if (props.comment?.commenter.nickname === profile.nickname) {
          dropboxItems['댓글 수정'] = onUpdateEditor
          dropboxItems['댓글 삭제'] = onDeleteComment
        }
        dropboxItems['댓글 복사'] = onCopyComment
      }

      const onAction = () => {
        ACTION_SLOT_EL.value.onToggle()
      }

      const onDeleteComment = async () => {
        const ok = await DIALOG_EL.value.show({
          title: '댓글 삭제',
          message: '해당 댓글을 삭제하시겠습니까?\n한번 삭제된 댓글은 되돌릴 수 없습니다.',
        })
        if (ok) {
          const { success, error } = await dispatch('comment/deleteComment', {
            id: props.comment._id,
            postId: props.postId,
            commenterId: props.userId,
          })
          if (success) {
            TOAST_EL.value.open('success', '댓글이 삭제되었습니다.')
          } else {
            TOAST_EL.value.open('error', error)
          }
        }
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

      onBeforeMount(() => {
        setDropboxItems()
      })

      return {
        ACTION_SLOT_EL,
        isUpdate,
        isVisible,
        isAuthorized,
        parentComment,
        dropboxItems,
        onAction,
        onDeleteComment,
        onCreateEditor,
        onUpdateEditor,
        onCloseEditor,
        onDisplayChildComment,
        onHiddenChildComment,
        onCopyComment,
      }
    },
  }
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
