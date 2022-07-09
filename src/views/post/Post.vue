<template>
  <div class="container">
    <div class="post">
      <!-- v-for로 들어갈 예정(이미지 여러 개일 경우)
      <div class="images" v-if="post.imageURL"
        :style="{ backgroundImage: 'url(' + require(`@/assets/${post.imageURL}`) + ')'}"></div>
      -->

      <div class="contents">
        <h2>{{ post.title }} - {{ post.postNum }}</h2>
        <p>{{ post.content }}</p>
      </div>

      <div class="info">
        <span v-text="dayjs(post.createdAt).format('YYYY년 M월 D일')"></span>
        <span></span>
        <span
          ><i class="material-icons" :style="[post.likeActive ? { color: 'var(--likeActive)' } : { color: 'var(--like)' }]">favorite</i
          >{{ post.like }}</span
        >
        <div class="option">
          <button @click="optionToggle = !optionToggle"><i class="material-icons">more_horiz</i></button>
          <ul v-if="!optionToggle">
            <li v-if="post.author === user"><router-link :to="{ name: 'editor', params: { postNum: post.postNum } }">수정</router-link></li>
            <li v-if="post.author === user" @click="onDelete">삭제</li>
            <li @click="clipboard">링크 복사</li>
          </ul>
        </div>
      </div>

      <div class="tags">
        <ul v-for="tag in post.tag" :key="tag">
          <li>{{ tag }}</li>
        </ul>
      </div>

      <div class="page">
        <Pagenation />
      </div>
    </div>

    <div class="comment">
      <CommentEditor />

      <div class="items">
        <h2>댓글 {{ comments.length }}개</h2>
        <ul v-for="comment in comments" :key="comment._id">
          <CommentItem :comment="comment" />
        </ul>
      </div>
    </div>
  </div>

  <Dialog ref="Dialog"></Dialog>
</template>

<script>
import { ref, computed, onBeforeMount, onUpdated, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import dayjs from 'dayjs'
import CommentEditor from './CommentEditor.vue'
import CommentItem from '../../components/CommentItem.vue'
import Pagenation from '../../components/Pagenation.vue'
import Dialog from '../../components/Dialog.vue'
import Author from '../../components/Author.vue'

export default {
  name: 'post',
  components: {
    CommentEditor,
    CommentItem,
    Dialog,
    Pagenation,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const user = computed(() => store.state.auth.user.name)
    const CommentEditor = ref(null)
    const Dialog = ref(null)

    const comments = computed(() => store.state.comment.comments)

    const postNum = ref(router.currentRoute.value.params.postNum)
    const maxPostNum = ref(store.state.post.posts.length - 1)

    //const post = computed({
    //get: () => store.state.post.posts[postNum.value] || {},
    //set: (val) => store.commit('post/SET_POST', val),
    //})

    const post = ref({})
    post.value = store.dispatch('post/getPost', store.state.posts[router.currentRoute.value.params.postNum]._id)

    onBeforeMount(async () => {
      document.title = post.value.title
      router.currentRoute.value.meta.title = post.value.title
    })

    onUpdated(() => {
      document.title = post.value.title
      router.currentRoute.value.meta.title = post.value.title
    })

    window.scrollTo(0, 0)

    const onDelete = async () => {
      try {
        const ok = await Dialog.value.show({
          title: 'Delete this Post',
          message: 'Are you sure you want to delele this post?',
        })
        if (ok) {
          const response = await store.dispatch('post/deletePost', post.value._id)
          response === 200
            ? router.push({ name: 'posts', params: { menu: router.currentRoute.value.params.menu } })
            : alert(`Cannot delete post (Server error ${response})`)
        }
      } catch (err) {
        console.log(err)
      }
    }

    const optionToggle = ref(false)
    optionToggle.value = !optionToggle.value

    const clipboard = async () => {
      const url = ref(null)
      url.value = window.location.href
      try {
        await navigator.clipboard.writeText(url.value)
        alert('클립보드에 복사되었습니다')
      } catch (err) {
        alert('처리에 실패하였습니다.')
      }
    }

    return { dayjs, user, CommentEditor, comments, onDelete, optionToggle, clipboard, Pagenation, post, postNum, maxPostNum }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.container {
  display: grid;
  grid-template-rows: repeat(2, auto);

  .post {
    display: grid;
    grid-template-rows: repeat(5, auto);
    color: var(--primary);

    .contents {
      grid-row: 1 / 2;

      h2 {
        font-size: 2.4rem;
        letter-spacing: normal;
      }

      p {
        font-size: 1.4rem;
        margin: 4.8rem 0;
        line-height: 2.8rem;
        color: var(--secondary);
        letter-spacing: normal;
      }
    }

    .info {
      grid-row: 2 / 3;
      display: grid;
      grid-template-columns: auto auto auto 1fr;
      align-items: center;
      gap: 0 1.6rem;
      color: var(--sub);

      span:nth-child(1) {
        grid-column: 1 / 2;
        font-size: 1.2rem;
      }

      span:nth-child(2) {
        grid-column: 2 / 3;
        border-left: 0.1rem solid var(--line);
        height: 1.2rem;
      }

      span:nth-child(3) {
        grid-column: 3 / 4;
        display: grid;
        grid-template-columns: repeat(2, auto);
        align-items: center;
        font-size: 1.2rem;

        i {
          margin-right: 0.8rem !important;
          color: var(--like);
          font-size: 1.6rem;
        }
      }

      div.option {
        grid-column: 4 / 5;
        justify-self: end;
        position: relative;

        button {
          display: grid;
          place-content: center;
          color: var(--primary);

          i {
            margin: 0;
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
            color: var(--primary);
            font-size: 1.2rem;
            font-weight: 500;
            display: grid;
            justify-content: center;
            cursor: pointer;

            a {
              color: var(--primary);
            }
          }

          li:nth-child(2) {
            margin: 1.6rem 0;
          }
        }
      }
    }

    .tags {
      grid-row: 3 / 4;
      margin-top: 2.4rem;

      ul {
        display: inline-grid;
        margin-right: 0.8rem;
        padding: 0.3rem 1.2rem 0.5rem;
        border: 1px solid #dadada;
        color: var(--point);
        font-size: 1.2rem;
        border-radius: 2.8rem;
        list-style: none;
      }
    }

    .page {
      grid-row: 4 / 5;
      display: grid;
      grid-template-columns: auto 1fr auto;
      border-top: 1px solid var(--line);
      margin: 4.8rem 0;
      padding: 4.8rem 0 0;
      color: var(--primary);
      font-size: 1.4rem;
      font-weight: 500;

      button {
        display: grid;
        grid-template-columns: repeat(2, auto);
        align-items: center;
      }

      button:nth-child(1) {
        grid-column: 1 / 2;
      }

      button:nth-child(2) {
        grid-column: 2 / 3;
        justify-self: end;

        i {
          margin: 0 0 0 1.6rem;
        }
      }
    }
  }

  .comment {
    display: grid;
    grid-template-rows: repeat(2, auto);

    .items {
      color: var(--primary);

      h2 {
        font-size: 1.6rem;
        margin: 6.4rem 0 0;
        padding: 0 0 4rem;
        font-weight: 500;
      }
    }
  }
}
</style>
