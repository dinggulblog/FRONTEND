<template>
  <li>
    <div>
      <div class="isActive" v-if="comment.isActive">
        <div class="info" ref="infoEl">
          <div class="author">
            <div class="profileImg"></div>
            <span>
              <router-link :to="{ name: 'profile', params: { nickname: comment.commenter.nickname } }">{{ comment.commenter.nickname }}</router-link>
            </span>
          </div>
          <span></span>
          <span class="createdAt">{{ dayjs(comment.createdAt).format('YYYY년 M월 D일') }}</span>
          <span></span>
          <span class="length">답글 {{ comment.childComments?.length ? comment.childComments?.length : 0 }}개</span>
          <span v-if="comment.isActive"></span>
          <span class="replyBtn" @click="onCommentState('reply')" v-if="comment.isActive">답글 작성</span>
          <div class="option" v-if="comment.commenter.nickname === user.nickname && comment.isActive">
            <button @click="toggleOptionBtn()"><i class="material-icons">more_horiz</i></button>
            <ul v-if="!isToggleHide">
              <li @click="onCommentState('edit')">댓글 수정</li>
              <li @click="onCommentDelete()">댓글 삭제</li>
            </ul>
          </div>
        </div>
        <p v-if="commentState === 'view' || commentState === 'reply'" :style="[commentState !== 'view' ? { marginBottom: '2.4rem' } : '']">
          <template v-if="notIsPublic">
            <i class="material-icons"> lock </i>
            해당 댓글은 작성자와 관리자만 볼 수 있습니다.
          </template>

          <template v-else>
            {{ comment.content }}
          </template>
        </p>
        <div class="comment-editor" ref="" v-if="commentState === 'edit' || commentState === 'reply'" :style="[commentState === 'reply' ? { marginLeft: '4rem' } : '']">
          <CommentEditor :comment="comment" :pid="pid" :curRouteParams="curRouteParams" :commentState="commentState" @updatedComment="updatedComment" />
        </div>
      </div>

      <div v-else class="notIsActive">해당 댓글은 삭제된 댓글입니다.</div>
    </div>

    <ul>
      <comment-item v-for="child in comment.childComments" :key="child._id" :comment="child" :curRouteParams="curRouteParams" :pid="pid" :postAuthor="postAuthor" />
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
    postAuthor: {
      type: String,
    },
  },
  setup(props) {
    const { dispatch, state } = useStore()
    const user = computed(() => state.auth.user)

    console.log('프롭스 코멘트', props.comment)

    const isToggleHide = ref(true)
    const commentState = ref('view')
    const notIsPublic = ref(!props.comment.isPublic && props.comment.commenter.nickname !== user.value.nickname && props.postAuthor !== user.value.nickname)
    const infoEl = ref(null)

    document.addEventListener('click', function (e) {
      if (commentState.value == 'reply') {
        //슬라이드 메뉴가 열려 있을때
        let tgEl = e.target
        let header = tgEl.closest(infoEl.value) //조상중 #header를 찾음-버튼이 header안에 있을 경우//

        if (!header) {
          //hdader이 조상이 아니면 닫기//
          infoEl.value.classList.remove('.replyBtn')
          return commentState.value === 'view'
        }
      }
    })

    const toggleOptionBtn = () => {
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

    return { dayjs, user, isToggleHide, commentState, notIsPublic, toggleOptionBtn, onCommentState, updatedComment, onCommentDelete }
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
          border: 0;

          a {
            color: var(--sub);
            grid-column: 2 / 3;
            font-weight: 500;
            font-size: 1.4rem;
          }
        }
      }

      span:nth-child(2) {
        grid-column: 2 / 3;
        border-left: 0.1rem solid var(--line);
        height: 1.2rem;
      }

      span:nth-child(3) {
        grid-column: 3 / 4;
      }

      span:nth-child(4) {
        grid-column: 4 / 5;
        border-left: 0.1rem solid var(--line);
        height: 1.2rem;
      }

      span:nth-child(5) {
        grid-column: 5 / 6;
      }

      span:nth-child(6) {
        grid-column: 6 / 7;
        border-left: 0.1rem solid var(--line);
        height: 1.2rem;
      }

      span:nth-child(7) {
        grid-column: 7 / 8;
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
      display: flex;
      align-items: center;

      i {
        margin-right: 0.8rem;
      }
    }

    .notIsActive {
      font-size: 1.4rem;
      color: var(--secondary);
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
    margin-left: 4rem;

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
