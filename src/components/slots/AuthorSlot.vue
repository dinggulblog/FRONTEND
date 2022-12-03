<template>
  <template v-if="type === 'header'">
    <Author>
      <template #avatar>
        <img
          class="avatar"
          :src="user.avatar ? `${IMAGE_URL}${user.avatar.serverFileName}` : DEFAULT_AVATAR_64"
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
        <img
          class="avatar"
          :src="comment.commenter.avatar ? `${IMAGE_URL}${comment.commenter.avatar.serverFileName}` : DEFAULT_AVATAR_64"
          alt="user_avatar"
        />
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
          <img
            class="avatar"
            :src="post.author.avatar ? `${IMAGE_URL}${post.author.avatar.serverFileName}` : DEFAULT_AVATAR_192"
            alt="user_avatar"
          />
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

  <template v-if="type === 'view' || type === 'introEdit'">
    <Author>
      <template #avatar>
        <img
          class="avatar"
          :src="profile.avatar ? `${IMAGE_URL}${profile.avatar.serverFileName}` : DEFAULT_AVATAR_192"
          alt="user_avatar"
        />
      </template>
      <template #nickname>
        <div class="nickname">{{ profile.nickname }}</div>
      </template>
      <template #greetings>
        <p class="greetings">{{ profile.greetings ? profile.greetings : '인사말을 적어보세요.' }}</p>
      </template>
    </Author>
  </template>

  <template v-if="type === 'edit'">
    <Author>
      <template #avatar>
        <img
          class="avatar"
          :src="profile.avatar ? `${IMAGE_URL}${profile.avatar.serverFileName}` : DEFAULT_AVATAR_192"
          alt="user_avatar"
        />
        <div class="wrap_input_file">
          <label for="input_file">아바타 업로드</label>
          <input type="file" id="input_file" @change="$emit('updateAvatar', $event)" accept="image/*" />
        </div>
        <Button
          class="btn_avatar_reset"
          :content="'아바타 초기화'"
          :size="'sm'"
          :rounded="true"
          @click="$emit('resetAvatar')"
        ></Button>
      </template>
      <template #nickname>
        <div class="nickname">{{ profile.nickname }}</div>
      </template>
      <template #greetings>
        <textarea
          class="textarea_greetings"
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
  import DEFAULT_AVATAR_192 from '../../assets/defalut_avatar_192.png'
  import DEFAULT_AVATAR_64 from '../../assets/defalut_avatar_64.png'

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
    emits: ['updateAvatar', 'updateGreetings', 'resetAvatar'],
    setup(props) {
      const IMAGE_URL = ref(process.env.VUE_APP_IMAGE_URL)

      return {
        IMAGE_URL,
        DEFAULT_AVATAR_192,
        DEFAULT_AVATAR_64,
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
        object-fit: cover;
      }
    }
  }
</style>
