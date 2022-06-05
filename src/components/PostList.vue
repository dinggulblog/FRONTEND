<template>
  <div class="postList">
    <ul v-for="post in sortedPosts" :key="post._id">
      <li>
        <div>
          <h2>
            <router-link :to="{ name: 'post', params: { menu: post.menu.name, sub: post.menu.subname, postNum: post.postNum } }">{{ post.postNum }} - {{ post.title }}</router-link>
          </h2>
          <p>{{ post.content }}</p>
          <div class="postInfo">
            <span v-text="dayjs(post.createdAt).format('YYYY년 M월 D일')"></span>
            <span></span>
            <span><i class="material-icons" :style="[post.likeActive ? { color: 'var(--likeActive)' } : { color: 'var(--like)' }]">favorite</i>{{ post.likeCount }}</span>
          </div>
        </div>

        <div>
          <span>{{ post.comment }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import post from '../store/modules/post'
import { ref } from 'vue'

export default {
  props: {
    sortedPosts: {
      type: Array,
      required: true,
    },
  },
  setup() {
    return { dayjs }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.postList {
  margin-top: 3.6rem;

  ul {
    margin: 0 0 4.8rem 0;
    border-bottom: 1px solid var(--line);

    li {
      display: grid;
      grid-template-columns: minmax(28rem, auto) minmax(8rem, 12.8rem);

      div:nth-child(1) {
        grid-column: 1 / 2;
        display: grid;
        grid-template-rows: repeat(3, auto);

        h2 {
          grid-row: 1 / 2;
          font-size: 1.8rem;
          color: var(--primary);
          font-weight: 500;
          letter-spacing: normal;
        }

        p {
          grid-row: 2 / 3;
          font-size: 1.4rem;
          color: var(--sub);
          margin: 2rem 0 2.8rem 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-wrap: break-word;
          letter-spacing: normal;
        }

        .postInfo {
          grid-row: 3 / 4;
          padding: 0 0 4.8rem 0;
          font-size: 1.2rem;
          color: var(--sub);
          display: grid;
          align-items: center;
          grid-template-columns: auto auto auto 1fr;
          justify-content: start;

          span:nth-child(1) {
            grid-column: 1 / 2;
          }

          span:nth-child(2) {
            grid-column: 2 / 3;
            border-left: 0.1rem solid var(--line);
            height: 1.2rem;
            margin: 0.3rem 1.6rem 0;
          }

          span:nth-child(3) {
            grid-column: 3 / 4;
            display: grid;
            grid-template-columns: repeat(2, auto);
            align-items: center;
            margin-top: 0.3rem;

            i {
              margin-right: 0.8rem;
              color: var(--like);
              font-size: 1.6rem;
            }
          }
        }
      }

      div:nth-child(2) {
        grid-column: 2 / 3;
        display: grid;
        justify-content: end;
        align-items: center;
        grid-template-rows: repeat(4, 1fr);

        span {
          grid-row: 2 / 3;
          width: 4.8rem;
          height: 3.6rem;
          background: #eeeeee;
          color: #aaaaaa;
          font-size: 1.4rem;
          border-radius: 40% 40% 0% 40%;
          display: grid;
          place-content: center;
          padding-top: 0.2rem;
          margin-top: -0.5rem;
        }
      }
    }
  }
}
</style>
