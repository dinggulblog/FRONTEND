<template>
  <div class="wrap_item">
    <div class="is-active" v-if="comment.isActive">
      <div class="wrap_header">
        <div class="wrap_left">
          <div class="author">
            <div class="avatar"></div>
            <router-link :to="{ name: 'profile', params: { nickname: comment.commenter.nickname } }">{{ comment.commenter.nickname }}</router-link>
          </div>
          <span class="createdAt">{{ dayjs(comment.createdAt).format('YYYY년 M월 D일') }}</span>
          <span class="child_count">답글 {{ comment.childComments?.length ? comment.childComments?.length : 0 }}개</span>
          <button class="btn_reply" @click="onCommentState('reply')" v-if="comment.isActive">답글 작성</button>
        </div>
        <div class="wrap_right">
          <div class="toggle" v-if="comment.commenter.nickname === user.nickname && comment.isActive">
            <button @click="displayToggle()"><i class="material-icons">more_horiz</i></button>
            <ul v-if="!isToggleHide">
              <li @click="onCommentState('edit')">댓글 수정</li>
              <li @click="onCommentDelete()">댓글 삭제</li>
            </ul>
          </div>
        </div>
      </div>
      <p class="content" v-if="commentState === 'view' || commentState === 'reply'" :style="[commentState !== 'view' ? { marginBottom: '2.4rem' } : '']">
        <template v-if="notIsPublic">
          <i class="material-icons"> lock </i>
          해당 댓글은 작성자와 관리자만 볼 수 있습니다.
        </template>

        <template v-else>
          {{ comment.content }}
        </template>
      </p>
      <div class="comment_editor" ref="" v-if="commentState === 'edit' || commentState === 'reply'" :style="[commentState === 'reply' ? { marginLeft: '4rem' } : '']">
        <CommentEditor :comment="comment" :pid="pid" :curRouteParams="curRouteParams" :commentState="commentState" @updatedComment="updatedComment" />
      </div>
    </div>

    <div class="not-is-acitve" v-else>해당 댓글은 삭제된 댓글입니다.</div>
  </div>

  <ul>
    <li v-for="child in comment.childComments" :key="child._id">
      <CommentItem :comment="child" :curRouteParams="curRouteParams" :pid="pid" :postAuthor="postAuthor" />
    </li>
  </ul>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import dayjs from 'dayjs'
import CommentEditor from '../components/CommentEditor.vue'

export default {
  components: {
    CommentEditor,
  },
  props: {
    comment: {
      type: Object,
      required: true,
    },
    curRouteParams: {
      type: Object,
    },
    pid: {
      type: String,
    },
    postAuthor: {
      type: String,
    },
  },
  setup(props) {
    const { dispatch, state } = useStore()
    const user = computed(() => state.auth.user)

    const isToggleHide = ref(true)
    const commentState = ref('view')
    const notIsPublic = ref(!props.comment.isPublic && props.comment.commenter.nickname !== user.value.nickname && props.postAuthor !== user.value.nickname)

    const displayToggle = () => {
      isToggleHide.value = !isToggleHide.value
    }

    const onCommentState = (state) => {
      user.value.nickname ? (commentState.value = state) : alert('로그인이 필요합니다.')
    }

    const updatedComment = (state) => {
      commentState.value = state
    }

    const onCommentDelete = async () => {
      const response = await dispatch('comment/deleteComment', {
        id: props.comment._id,
        postId: props.pid,
      })
      if (!response.success) alert(response.message)
    }

    return { dayjs, user, isToggleHide, commentState, notIsPublic, displayToggle, onCommentState, updatedComment, onCommentDelete }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped></style>
