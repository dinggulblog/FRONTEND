<template>
  <Author>
    <template #avatar>
      <img class="avatar" :src="avatar?.thumbnail ?? DEFAULT_AVATAR_192" alt="profile_avatar" />
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

    <template #nickname>
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
  import { reactive, toRefs, onMounted } from 'vue'
  import Author from '../slots/Author.vue'
  import DEFAULT_AVATAR_192 from '../../assets/default_avatar_192.webp'
  import DEFAULT_AVATAR_64 from '../../assets/default_avatar_64.webp'

  export default {
    name: 'AuthorSlot',
    components: {
      Author,
    },
    props: {
      profile: {
        type: Object,
        default: () => reactive({}),
      },
      state: {
        type: String,
      },
    },
    emits: ['updateAvatar', 'updateGreetings', 'resetAvatar'],
    setup(props) {
      const { avatar, nickname, greetings } = toRefs(props.profile)

      onMounted(() => {
        console.log(nickname.value)
      })

      return {
        DEFAULT_AVATAR_192,
        DEFAULT_AVATAR_64,
        avatar,
        nickname,
        greetings,
      }
    },
  }
</script>