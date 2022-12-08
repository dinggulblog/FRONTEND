<template>
  <li v-if="comment.isActive" class="comment_item">
    <div class="wrap_item">
      <div class="wrap_header">
        <div class="wrap_left">
          <CommentInfoSlot :comment="comment" />
          <div class="wrap_reply_btn">
            <Button
              v-if="!isVisible.commentEditor"
              class="btn_reply"
              :content="'답글 작성'"
              :customColor="'var(--primary-dark)'"
              :customPadding="'0'"
              @click="onCreateEditor"
            />

            <Button
              v-else-if="isVisible.commentEditor || (isVisible.commentEditor && !isUpdate)"
              class="btn_reply"
              :content="'답글 작성'"
              :customColor="'var(--primary-dark)'"
              :customPadding="'0'"
              @click="onCloseEditor"
            />
          </div>
        </div>
        <div class="wrap_right">
          <DropboxSlot
            :dropboxItems="{
              '댓글 수정': onUpdateEditor,
              '댓글 삭제': onDeleteComment,
              '댓글 복사': onCopyComment,
            }"
          />
        </div>
      </div>
      <div class="content">
        <p>
          <span class="receiver" v-if="comment.parentComment">@ {{ MyParentComment?.commenter?.nickname }}</span>
          <span v-if="!isAuthorized">비밀 댓글입니다. 작성자와 관리자만 볼 수 있어요</span>
          <span v-else>{{ comment.content }}</span>
        </p>
        <Button
          v-if="comment?.childComments?.length"
          class="btn_childComment_toggle"
          :svg="!isVisible.childComments ? 'arrow-down' : 'arrow-up'"
          :size="'xs'"
          :content="'답글 ' + String(comment?.childComments?.length) + '개'"
          :customColor="'var(--primary-dark)'"
          :customFontSize="'1.4rem'"
          :customPadding="'0'"
          @click="!isVisible.childComments ? onDisplayChildComment() : onHiddenChildComment()"
        />
      </div>
      <CommentEditor
        v-if="isVisible.commentEditor"
        :post="post"
        :comment="comment"
        :isUpdate="isUpdate"
        @closeEditor="onCloseEditor"
      />
    </div>

    <ul class="comment_childItem" v-if="comment.childComments && isVisible.childComments">
      <CommentSlot
        v-for="child in comment.childComments"
        :key="child._id"
        :comment="child"
        :post="post"
        :isAuthorized="isAuthorized"
      />
    </ul>
  </li>

  <li class="not-is-acitve" v-else>
    <div class="content">
      <p>** 해당 댓글은 삭제된 댓글입니다 **</p>

      <Button
        v-if="comment?.childComments?.length"
        class="btn_childComment_toggle"
        :svg="!isVisible.childComments ? 'arrow-down' : 'arrow-up'"
        :size="'xs'"
        :content="'답글 ' + String(comment?.childComments?.length) + '개'"
        :customColor="'var(--primary-dark)'"
        :customFontSize="'1.4rem'"
        :customPadding="'0'"
        @click="!isVisible.childComments ? onDisplayChildComment() : onHiddenChildComment()"
      />
    </div>

    <ul class="comment_childItem" v-if="comment.childComments && isVisible.childComments">
      <CommentSlot
        v-for="child in comment.childComments"
        :key="child._id"
        :comment="child"
        :post="post"
        :isAuthorized="isAuthorized"
      />
    </ul>
  </li>
  <Dialog ref="Dialog"></Dialog>
</template>

<script>
  import { onBeforeMount, ref, computed, reactive } from 'vue'
  import { useStore } from 'vuex'
  import DropboxSlot from './DropboxSlot.vue'
  import CommentInfoSlot from './CommentInfoSlot.vue'
  import CommentEditor from '../CommentEditor.vue'
  import Dialog from '../../components/Dialog.vue'
  import comment from '../../store/modules/comment'

  export default {
    name: 'CommentSlot',
    components: {
      CommentInfoSlot,
      CommentEditor,
      Dialog,
      DropboxSlot,
    },
    props: {
      comment: {
        type: Object,
        required: true,
      },
      post: {
        type: Object,
        required: true,
      },
      isAuthorized: {
        type: Boolean,
        required: true,
      },
    },
    emits: ['onDeleteComment'],
    setup(props, { emit }) {
      const { state } = useStore()
      const comments = computed(() => state.comment.comments)
      const Dialog = ref(null)
      const isUpdate = ref(false)
      const MyParentComment = ref(null)

      const isVisible = reactive({
        commentEditor: false,
        childComments: false,
      })

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

      const onDeleteComment = () => {
        emit('onDeleteComment', props.comment._id)
      }

      const onCopyComment = async () => {
        try {
          await navigator.clipboard.writeText(props.comment.content)
          alert('댓글 내용이 복사되었습니다')
        } catch (err) {
          alert('댓글 내용 복사에 실패하였습니다.')
        }
      }

      // comment => 원본 트리 배열
      // id => props comment의 parentComment
      const searchParentComment = (comment, id = null) => {
        if (comment._id === id) {
          return comment
        } else if (Array.isArray(comment.childComments)) {
          let result = null
          for (const childComment of comment.childComments) {
            result = searchParentComment(childComment, id)
          }
          return result
        }
        return null
      }

      onBeforeMount(() => {
        MyParentComment.value = comments.value
          ?.filter((comment) => searchParentComment(comment, props.comment.parentComment))
          ?.pop()
      })

      return {
        Dialog,
        isVisible,
        isUpdate,
        MyParentComment,
        onCreateEditor,
        onUpdateEditor,
        onCloseEditor,
        onDisplayChildComment,
        onHiddenChildComment,
        onDeleteComment,
        onCopyComment,
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .comment_items > li > ul {
    margin: -2.4rem 0 0 4.8rem;
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
          width: 10%;
          display: flex;
          justify-content: flex-end;
        }
      }

      .content {
        display: flex;
        flex-direction: column;

        p {
          display: flex;
          align-items: center;
          color: #bababa;
          font-size: 1.4rem;

          .receiver {
            font-weight: 500;
            color: var(--secondary-dark);
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
    color: #bababa;

    .content {
      margin: 0 0 6.4rem;
    }
  }

  .btn_childComment_toggle {
    margin: 2.4rem 0 0;
  }
</style>
