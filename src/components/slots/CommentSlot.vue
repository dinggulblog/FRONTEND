<template>
  <li v-if="comment.isActive" class="comment_item">
    <div class="wrap_item">
      <div class="wrap_header">
        <div class="wrap_left">
          <CommentInfoSlot :comment="comment" />
          <div class="wrap_reply_btn">
            <button v-if="!isVisible" class="btn_reply" @click="onCreateEditor">답글 작성</button>
            <button v-else-if="isVisible || (isVisible && !isUpdate)" class="btn_reply" @click="onCloseEditor">
              에디터 닫기
            </button>
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
        <p v-if="!isAuthorized">비밀 댓글입니다. 작성자와 관리자만 볼 수 있어요</p>
        <p v-else>{{ comment.content }}</p>
      </div>
      <CommentEditor
        v-if="isVisible"
        :post="post"
        :comment="comment"
        :isUpdate="isUpdate"
        @closeEditor="onCloseEditor"
      />
    </div>

    <ul class="comment_childItem" v-if="comment.childComments">
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
    <p>** 해당 댓글은 삭제된 댓글입니다 **</p>

    <ul class="comment_childItem" v-if="comment.childComments">
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
  import { ref } from 'vue'
  import { useStore } from 'vuex'
  import DropboxSlot from './DropboxSlot.vue'
  import CommentInfoSlot from './CommentInfoSlot.vue'
  import CommentEditor from '../CommentEditor.vue'
  import Dialog from '../../components/Dialog.vue'

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
    setup(props) {
      const { dispatch } = useStore()
      const isVisible = ref(false)
      const Dialog = ref(null)
      const isUpdate = ref(false)

      const onCreateEditor = () => {
        isUpdate.value = false
        isVisible.value = true
      }

      const onUpdateEditor = () => {
        isUpdate.value = true
        isVisible.value = true
      }

      const onCloseEditor = () => {
        isVisible.value = false
      }

      const onDeleteComment = async () => {
        const ok = await Dialog.value.show({
          title: '댓글 삭제',
          message: '해당 댓글을 삭제하시겠습니까?\n한번 삭제된 댓글은 되돌릴 수 없습니다.',
        })
        if (ok) await dispatch('comment/deleteComment', { postId: props.post._id, id: props.comment._id })
      }

      const onCopyComment = async () => {
        try {
          await navigator.clipboard.writeText(props.comment.content)
          alert('댓글 내용이 복사되었습니다')
        } catch (err) {
          alert('댓글 내용 복사에 실패하였습니다.')
        }
      }

      return {
        Dialog,
        isVisible,
        isUpdate,
        onCreateEditor,
        onUpdateEditor,
        onCloseEditor,
        onDeleteComment,
        onCopyComment,
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .comment_items > li > ul {
    margin: -3.2rem 0 0 4.8rem;
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
          width: 50%;

          .wrap_reply_btn {
            margin: 0 0 0 3.2rem;

            .btn_reply {
              font-size: 1.2rem;
              color: var(--primary-dark);
            }
          }
        }

        .wrap_right {
          width: 50%;
          display: flex;
          justify-content: flex-end;
        }
      }

      .content {
        color: #bababa;
        font-size: 1.4rem;
      }
    }
  }

  .not-is-acitve {
    margin: 0 0 6.4rem;
    font-size: 1.4rem;
    color: #bababa;
  }
</style>
