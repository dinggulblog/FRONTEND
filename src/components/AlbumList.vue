<template>
  <div class="albumList">
    <ul v-for="post in sortedPosts" :key="post._id">
      <li>
        <div>
          <router-link :to="{ name: 'post', params: { menu: routeParams.menu, sub: routeParams?.sub } }">
            <div class="thumbNail" :style="{ backgroundImage: 'url(' + require(`@/assets/${post.imageURL}`) + ')' }"></div>
            <h2>{{ post.title }}</h2>
            <p>{{ post.content }}</p>
            <div class="postInfo">
              <span v-text="dayjs(post.createdAt).format('YYYY년 M월 D일')"></span>
              <span></span>
              <span>댓글 {{ post.comment }}</span>
              <span><i class="material-icons" :style="[post.likeActive ? { color: 'var(--likeActive)' } : { color: 'var(--like)' }]">favorite</i>{{ post.like }}</span>
            </div>
          </router-link>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  props: {
    sortedPosts: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const route = useRoute()
    const routeParams = computed(() => route.params)

    return { dayjs, routeParams }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.albumList {
  margin: 3.6rem 0 4.8rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(auto, 28.2rem));
  justify-content: start;
  gap: 4.8rem 2.4rem;

  ul {
    li {
      div:nth-child(1) {
        display: grid;
        grid-template-rows: repeat(4, auto);

        .thumbNail {
          width: 100%;
          height: 18.8rem;
          grid-row: 1 / 2;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
        }

        h2 {
          grid-row: 2 / 3;
          font-size: 1.6rem;
          color: var(--primary);
          font-weight: 500;
          margin: 3.2rem 0 0;
          letter-spacing: normal;
        }

        p {
          grid-row: 3 / 4;
          font-size: 1.4rem;
          color: var(--sub);
          margin: 1.6rem 0 4rem 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          word-wrap: break-word;
          letter-spacing: normal;
        }

        .postInfo {
          grid-row: 4 / 5;
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
            border-left: 0.1rem solid var(--line);
            height: 1.2rem;
            margin: 0 1.6rem 0;
            grid-column: 2 / 3;
          }

          span:nth-child(3) {
            grid-column: 3 / 4;
          }

          span:nth-child(4) {
            grid-column: 4 / 5;
            display: grid;
            grid-template-columns: repeat(2, auto);
            align-items: center;
            justify-content: end;

            i {
              margin-right: 0.8rem;
              font-size: 1.6rem;
            }
          }
        }
      }
    }
  }
}
</style>
