<template>
  <template v-if="type === 'header'">
    <Author>
      <template #avatar>
        <img class="avatar" src="../../assets/4.jpg" alt="user_avatar" />
      </template>
      <template #nickname>
        <span class="nickname">{{ user.nickname }}</span>
      </template>
    </Author>
  </template>

  <template v-if="type === 'post'">
    <Author>
      <template #nickname>
        <span class="nickname">{{ post.author.nickname }}</span>
      </template>
    </Author>
  </template>

  <template v-if="type === 'comment'">
    <Author>
      <template #avatar>
        <img class="avatar" src="../../assets/4.jpg" alt="user_avatar" />
      </template>
      <template #nickname>
        <span class="nickname">{{ comment.commenter.nickname }}</span>
      </template>
    </Author>
  </template>
</template>

<script>
  import Author from '../Author.vue'

  export default {
    name: 'AuthorSlot',
    components: {
      Author,
    },
    props: {
      type: {
        type: String,
      },
      user: {
        type: Object,
      },
      post: {
        type: Object,
      },
      comment: {
        type: Object,
      },
    },
    setup() {
      return {}
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .author {
    display: flex;
    align-items: center;

    .nickname {
      font-family: 'Noto Sans KR';
    }
    .avatar {
      width: 3.2rem;
      height: 3.2rem;
      border-radius: 50%;
    }
  }
</style>
