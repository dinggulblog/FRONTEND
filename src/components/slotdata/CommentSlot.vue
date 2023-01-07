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
              content="답글 작성"
              customPadding="0"
              :customColor="`var(--primary-dark)`"
              @click="onCreateEditor"
            />

            <Button
              v-else
              class="btn_reply"
              content="에디터 닫기"
              customPadding="0"
              :customColor="`var(--primary-dark)`"
              @click="onCloseEditor"
            />
          </div>
        </div>
        <div class="wrap_right">
          <Button
            class="btn_dropbox"
            size="sm"
            svg="more"
            customPadding="0"
            :customColor="`var(--list_info)`"
            @click="onAction"
          />

          <ActionSlot
            ref="ACTION_SLOT_EL"
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
          <span class="receiver" v-if="comment.parentComment">@ {{ myParentComment?.commenter?.nickname }}</span>
          <span v-if="!isAuthorized">비밀 댓글입니다. 작성자와 관리자만 볼 수 있어요</span>
          <span v-else>{{ comment.content }}</span>
        </p>
        <Button
          v-if="comment.childCommentCount"
          class="btn_childComment_toggle"
          :svg="!isVisible.childComments ? 'arrow-down' : 'arrow-up'"
          :size="'xs'"
          :content="'답글 ' + comment.childCommentCount + '개'"
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
        v-if="comment.childCommentCount"
        class="btn_childComment_toggle"
        :svg="!isVisible.childComments ? 'arrow-down' : 'arrow-up'"
        :size="'xs'"
        :content="'답글 ' + comment.childCommentCount + '개'"
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
</template>

<script>
  import { onBeforeMount, ref, computed, reactive } from 'vue'
  import { useStore } from 'vuex'
  import ActionSlot from './ActionSlot.vue'
  import CommentInfoSlot from './CommentInfoSlot.vue'
  import CommentEditor from '../CommentEditor.vue'
  import comment from '../../store/modules/comment'

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
      const isUpdate = ref(false)
      const myParentComment = ref(null)
      const ACTION_SLOT_EL = ref(null)

      const isVisible = reactive({
        commentEditor: false,
        childComments: false,
      })

      const onAction = () => {
        ACTION_SLOT_EL.value.onToggle()
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

      const onDeleteComment = () => {
        emit('onDeleteComment', props.comment)
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
      // id => props comment의 parentComment ID
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
        myParentComment.value = comments.value.find((comment) => searchParentComment(comment, props.comment.parentComment))
      })

      return {
        ACTION_SLOT_EL,
        isVisible,
        isUpdate,
        myParentComment,
        onAction,
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
