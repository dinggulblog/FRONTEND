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

  <template v-if="type === 'postAuthor'">
    <Author>
      <template #avatar>
        <img class="avatar" src="../../assets/4.jpg" alt="user_avatar" />
      </template>
      <template #nickname>
        <span class="nickname">{{ post.author.nickname }}</span>
      </template>
      <template #greetings>
        <p class="greetings">{{ post.author.greetings }}</p>
      </template>
    </Author>
  </template>

  <template v-if="type === 'profileView'">
    <Author>
      <template #avatar>
        <img class="avatar" :src="profile.avatar" alt="user_avatar" />
      </template>
      <template #nickname>
        <div class="nickname">{{ profile.nickname }}</div>
      </template>
      <template #greetings>
        <p class="greetings">{{ profile.greetings }}</p>
      </template>
    </Author>
  </template>

  <template v-if="type === 'profileEdit'">
    <Author>
      <template #avatar>
        <img class="avatar" :src="profile.avatar" alt="user_avatar" />
        <span class="wrap_input_file">
          <label for="input_file"><i class="material-symbols-outlined"> add_circle </i></label>
          <input type="file" id="input_file" @change="fileUpload" />
        </span>
      </template>
      <template #nickname>
        <div class="nickname">{{ profile.nickname }}</div>
      </template>
      <template #greetings>
        <input class="input_greetings" ref="GREETINGS_El" v-model="greetings" />
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
      profile: {
        type: Object,
      },
    },
    setup(props) {
      return {}
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .author {
    display: flex;
    align-items: center;
    font-family: 'Noto Sans KR';

    .wrap_avatar {
      margin: 0 1.2rem 0 0;

      .avatar {
        width: 3.2rem;
        height: 3.2rem;
        border-radius: 50%;
      }
    }
  }
</style>
