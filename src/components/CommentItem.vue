<template>
  <li>
    <div :style="[comment.parentComment ? { marginLeft: '50px' } : { marginLeft: '0px' }]">
      <div class="info">
        <div class="author">
          <div class="profileImg"></div>
          <span>{{ comment.commenter.nickname }}</span>
        </div>
        <span class="createdAt">{{ dayjs(comment.createdAt).format('YYYY년 M월 D일') }}</span>
        <span></span>
        <span class="length">답글 {{ comment.children?.length ?? 0 }}개</span>
        <span v-if="comment.isActive"></span>
        <span @click="onCommentEditor('reply')" v-if="comment.isActive">답글 작성</span>
        <div class="option" v-if="comment.commenter.nickname === user.nickname && comment.isActive">
          <button @click="toggleOptionBtn()"><i class="material-icons">more_horiz</i></button>
          <ul v-if="!isToggleHide">
            <li @click="onCommentEditor('edit')">댓글 수정</li>
            <li @click="onCommentDelete()">댓글 삭제</li>
          </ul>
        </div>
      </div>
      <p v-if="commentState === 'view' || commentState === 'reply'">{{ comment.isActive ? comment.content : '해당 댓글은 삭제된 댓글입니다.' }}</p>
      <div class="comment-editor" v-if="commentState === 'edit' || commentState === 'reply'" :style="[commentState === 'reply' ? { marginLeft: '4rem' } : '']">
        <CommentEditor :comment="comment" :pid="comment.post" :curRouteParams="curRouteParams" :commentState="commentState" @updatedComment="updatedComment" />
      </div>
    </div>

    <ul>
      <comment-item v-for="child in comment.childComments" :key="child._id" :comment="child" :pid="pid" />
    </ul>
  </li>
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
  },
  setup(props) {
    const { dispatch, state } = useStore()
    const user = computed(() => state.auth.user)

    const isToggleHide = ref(true)
    const commentState = ref('view')

    const toggleOptionBtn = () => {
      isToggleHide.value = !isToggleHide.value
    }

    const onCommentEditor = (state) => {
      commentState.value = state
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

    console.log('코멘트', props.comment)

    return { dayjs, user, isToggleHide, commentState, toggleOptionBtn, onCommentEditor, updatedComment, onCommentDelete }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
ul {
  font-weight: 400;
  li {
    display: grid;
    grid-template-rows: repeat(2, auto);
    border-top: 1px solid var(--line);
    margin: 0 0 0rem;
    padding: 3.2rem 0 0;

    .info {
      display: grid;
      grid-template-columns: auto auto auto auto auto auto 1fr auto;
      align-items: center;
      font-size: 1.2rem;
      gap: 0 1.4rem;
      margin: 0 0 2.4rem;

      div.author {
        grid-column: 1 / 2;
        display: grid;
        grid-template-columns: repeat(2, auto);
        align-items: center;
        gap: 0 1.4rem;

        div.profileImg {
          grid-column: 1 / 2;
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
          background: #e6e6e6;
          background: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnI3Ftw4ttKq1OERD38V3Z6Y65RvY9pSwkIw&usqp=CAU');
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
        }

        span {
          grid-column: 2 / 3;
          font-weight: 500;
          font-size: 1.4rem;
        }
      }

      span:nth-child(2) {
        grid-column: 2 / 3;
      }

      span:nth-child(3) {
        grid-column: 3 / 4;
        border-left: 0.1rem solid var(--line);
        height: 1.2rem;
      }

      span:nth-child(4) {
        grid-column: 4 / 5;
      }

      span:nth-child(5) {
        grid-column: 5 / 6;
        border-left: 0.1rem solid var(--line);
        height: 1.2rem;
      }

      span:nth-child(6) {
        grid-column: 6 / 7;
        color: var(--point);
      }

      div.option {
        grid-column: 8 / 9;
        margin-left: 0.2rem;
        position: relative;

        button {
          display: grid;
          place-content: center;
          i {
            margin: 0;
            color: var(--primary);
          }
        }

        ul {
          position: absolute;
          right: 0;
          top: 3.2rem;
          z-index: 10;
          padding: 2.4rem;
          background: #fff;
          border: 0;
          box-shadow: 0 0 2.4rem 0.3rem rgba(0, 0, 0, 0.15);
          width: 10rem;

          li {
            border: 0;
            margin: 0;
            padding: 0;
            color: var(--primary);
            font-size: 1.2rem;
            font-weight: 500;
            display: grid;
            justify-content: center;
            cursor: pointer;
          }

          li:nth-child(2) {
            margin: 1.6rem 0 0;
          }
        }
      }
    }

    p {
      font-size: 1.4rem;
      line-height: 2.8rem;
      letter-spacing: normal;
      color: var(--secondary);
      margin: 0 0 2.4rem;
    }
  }
}

ul.reply {
  padding-left: 4.8rem;
}

ul > li > ul {
  margin: 3.2rem 0 0;
  li {
    border-top: 1px solid var(--line);

    p {
      span {
        margin-right: 1.4rem;
        font-weight: 500;
        padding: 0.8rem 1.2rem;
        background: #eee;
        border-radius: 2.8rem;
        color: var(--point);
      }
    }
  }
}
</style>
