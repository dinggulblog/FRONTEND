<template>
  <Author>
    <template #avatar>
      <img
        class="avatar"
        :src="avatar ? `${IMAGE_URL}${avatar.serverFileName}` : DEFAULT_AVATAR_192"
        alt="user_avatar"
      />
    </template>

    <template #avatar_upload v-if="state === 'edit'">
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
      />
    </template>

    <template #nickname v-if="nickname">
      <span class="nickname">{{ nickname }}</span>
    </template>

    <template #greetings v-if="greetings && state !== 'edit'">
      <p class="greetings">{{ greetings }}</p>
    </template>

    <template #greetings_textarea v-else-if="state === 'edit'">
      <textarea
        class="textarea_greetings"
        placeholder="인사말을 적어보세요."
        :value="greetings"
        @change="$emit('updateGreetings', $event)"
      />
    </template>
  </Author>
</template>

<script>
  import { reactive, ref, toRefs } from 'vue'
  import { useMedia } from '../../common/mediaQuery'

  import DEFAULT_AVATAR_192 from '../../assets/default_avatar_192.png'
  import DEFAULT_AVATAR_64 from '../../assets/default_avatar_64.png'
  import Author from '../Author.vue'

  export default {
    name: 'AuthorSlot',
    components: {
      Author,
    },
    props: {
      user: {
        type: Object,
        default: () => reactive({}),
      },
      state: {
        type: String,
      },
    },
    emits: ['updateAvatar', 'updateGreetings', 'resetAvatar'],
    setup(props) {
      const IMAGE_URL = ref(process.env.VUE_APP_IMAGE_URL)
      const isMobile = useMedia('only screen and (max-width: 1023px)')

      const { avatar, nickname, greetings } = toRefs(props.user)

      return {
        DEFAULT_AVATAR_192,
        DEFAULT_AVATAR_64,
        IMAGE_URL,
        isMobile,
        avatar,
        nickname,
        greetings,
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

    .nickname {
      display: block;
    }

    .time {
      display: block;
    }
  }
</style>
