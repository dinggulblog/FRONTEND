<template>
  <li :class="type">
    <div>
      <div class="thumbnail" v-if="type === 'album' && post.imageURL" :style="{ backgroundImage: 'url(' + require(`@/assets/${post.imageURL}`) + ')' }"></div>
      <h2>
        <router-link :to="{ name: 'post', params: { title, subject, postNum: post.postNum } }">{{ post.postNum }} - {{ post.title }}</router-link>
      </h2>
      <p>
        {{ markdownText(post.content) }}
      </p>

      <div class="post-info">
        <span v-text="dayjs(post.createdAt).format('YYYY년 M월 D일')"></span>
        <span></span>
        <span v-if="type === 'album'">댓글 {{ post.commentCount }}</span>
        <span><i class="material-icons" :style="[isLike ? { color: 'var(--likeActive)' } : { color: 'var(--like)' }]">favorite</i>{{ post.likeCount }}</span>
      </div>
    </div>

    <div v-if="type === 'list'">
      <span>{{ post.commentCount }}</span>
    </div>
  </li>
</template>

<script>
import dayjs from 'dayjs'
import markdownText from 'markdown-to-text'

export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      default: undefined,
    },
    post: {
      type: Object,
      required: true,
    },
    isLike: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return { dayjs, markdownText }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
li.list {
  margin: 0 0 4.8rem 0;
  border-bottom: 1px solid var(--line);
  display: grid;
  grid-template-columns: minmax(28rem, auto) minmax(8rem, 12.8rem);

  div:nth-child(1) {
    grid-column: 1 / 2;
    display: grid;
    grid-template-rows: repeat(3, auto);

    h2 {
      grid-row: 1 / 2;
      font-size: 1.8rem;
      font-weight: 500;
      letter-spacing: normal;

      a {
        color: var(--primary);
      }
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

    .post-info {
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
      background: #eaeaea;
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

li.album {
  div:nth-child(1) {
    display: grid;
    grid-template-rows: repeat(4, auto);

    .thumbnail {
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

      a {
        color: var(--primary);
      }
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
</style>
