<template>
  <template v-if="type === 'header'">
    <Author>
      <template #avatar>
        <img
          class="avatar"
          :src="`${IMAGE_URL}${user?.avatar?.serverFileName}` || '../../assets/1.jpg'"
          alt="user_avatar"
        />
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
        <img class="avatar" :src="profile.avatar || '../../assets/1.jpg'" alt="user_avatar" />
      </template>
      <template #nickname>
        <span class="nickname">{{ comment.commenter.nickname }}</span>
      </template>
    </Author>
  </template>

  <template v-if="type === 'postAuthor'">
    <Author>
      <template #avatar>
        <div class="wrap_avatar">
          <img class="avatar" :src="profile.avatar || '../../assets/1.jpg'" alt="user_avatar" />
        </div>
      </template>
      <template #nickname>
        <span class="nickname">{{ post.author.nickname }}</span>
      </template>
      <template #greetings>
        <p class="greetings">{{ post.author.greetings }}</p>
      </template>
    </Author>
  </template>

  <template v-if="type === 'edit'">
    <Author>
      <template #avatar>
        <img class="avatar" :src="profile.avatar || '../../assets/1.jpg'" alt="user_avatar" />
      </template>
      <template #nickname>
        <div class="nickname">{{ profile.nickname }}</div>
      </template>
      <template #greetings>
        <p class="greetings">{{ profile.greetings }}</p>
      </template>
    </Author>
  </template>

  <template v-if="type === 'ok'">
    <Author>
      <template #avatar>
        <img class="avatar" :src="profile.avatar || '../../assets/1.jpg'" alt="user_avatar" />
        <span class="wrap_input_file">
          <label for="input_file"><i class="material-symbols-outlined"> add_circle </i></label>
          <input type="file" id="input_file" @change="$emit('updateAvatar', $event)" accept="image/*" />
        </span>
      </template>
      <template #nickname>
        <div class="nickname">{{ profile.nickname }}</div>
      </template>
      <template #greetings>
        <textarea
          class="input_greetings"
          :value="profile.greetings"
          @keydown="$emit('updateGreetings', $event)"
        ></textarea>
      </template>
    </Author>
  </template>
</template>

<script>
  import { ref } from 'vue'
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
    emits: ['updateAvatar', 'updateGreetings'],
    setup(props) {
      const IMAGE_URL = ref(process.env.VUE_APP_IMAGE_URL)

      console.log(props.user)
      return {
        IMAGE_URL,
      }
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
