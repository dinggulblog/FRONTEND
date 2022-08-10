<template>
  <div class="profile">
    <form v-on:submit.prevent="submitForm">
      <div class="author">
        <div class="avatar"></div>
        <div class="info">
          <h2>{{ profileState.nickname }}님</h2>
          <p v-if="profileDisplay === 'view'">{{ profileState.info }}</p>
          <input v-else v-model="infoInput" :placeholder="profileState.info ? profileState.info : ''" />
        </div>
        <div class="edit-btn" v-if="user.nickname === profileState.nickname">
          <button @click="profileDisplay === 'view' ? profileDisplayChange() : onSubmit()">{{ profileDisplay === 'view' ? 'Edit' : 'Confirm' }}</button>
        </div>
      </div>

      <div class="greetings">
        <p v-if="profileDisplay === 'view'">{{ profileState.greetings }}</p>
        <textarea v-else v-model="greetingsInput" :placeholder="profileState.greetings ? profileState.greetings : ''"></textarea>
      </div>
    </form>

    <ul class="tab">
      <li @click="tapDisplayChange('info')" :style="[tapDisplay === 'info' ? { borderColor: 'var(--point)', color: 'var(--point)' } : '']">INFO</li>
      <li @click="tapDisplayChange('likedPost')" :style="[tapDisplay === 'likedPost' ? { borderColor: 'var(--point)', color: 'var(--point)' } : '']">LIKED POSTS</li>
      <li @click="tapDisplayChange('commentedPost')" :style="[tapDisplay === 'commentedPost' ? { borderColor: 'var(--point)', color: 'var(--point)' } : '']">COMMENTED POSTS</li>
    </ul>

    <Info v-if="tapDisplay === 'info'" />
    <PostCollection v-if="tapDisplay === 'likedPost' || tapDisplay === 'commentedPost'" />
  </div>
</template>

<script>
import { onBeforeMount, computed, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Info from '../../components/Info.vue'
import PostCollection from '../../components/PostCollection.vue'

export default {
  name: 'profile',
  components: {
    Info,
    PostCollection
  },
  setup() {
    const { push, currentRoute } = useRouter()
    const { state, dispatch } = useStore()

    const user = computed(() => state.auth.user)

    const profileState = reactive({
      nickname: currentRoute.value.params.nickname,
      info: '간단한 소개',
      greetings: '인사말을 적어보세요',
    })

    const profileDisplay = ref('view')
    const infoInput = ref('')
    const greetingsInput = ref('')

    const tapDisplay = ref('info')

    onBeforeMount(async () => {
      if (profileState.nickname) {
        const response = await dispatch('auth/getProfile', profileState.nickname)
        // profileState.info = response.info
        // profileState.greetings = response.greetings
        // const postResponse = await dispatch('post/getPosts', { nickname: findUser.value })
      }
    })

    const profileDisplayChange = () => {
      profileDisplay.value = 'edit'
    }

    const onSubmit = async () => {
      const profile = {
        nickname: user.value.nickname,
        info: infoInput.value,
        greetings: greetingsInput.value,
      }
      console.log('변경할 프로필 내용 : ', profile)
      const response = await dispatch('auth/updateProfile', profile)
      response.success ? push({ name: 'profile', params: { nickname: user.value.nickname } }) : alert(response.message)
    }

    const tapDisplayChange = (selected) => {
      tapDisplay.value = selected
      console.log('현재 선택한 tap : ', tapDisplay.value)
    }

    return { user, profileState, profileDisplay, infoInput, greetingsInput, tapDisplay, profileDisplayChange, onSubmit, tapDisplayChange }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.profile {
  display: grid;
  grid-template-rows: auto auto;
  gap: 2.4rem 0;
  letter-spacing: normal;
  font-size: 1.4rem;

  .author {
    grid-row: 1 / 2;
    display: grid;
    grid-template-columns: auto auto 1fr;
    align-items: center;
    gap: 0 1.6rem;

    .avatar {
      grid-column: 1 / 2;
      width: 6rem;
      height: 6rem;
      border-radius: 50%;
      background: #e6e6e6;
      background: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnI3Ftw4ttKq1OERD38V3Z6Y65RvY9pSwkIw&usqp=CAU');
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    }

    .info {
      grid-column: 2 / 3;
      display: inherit;
      grid-template-rows: auto auto;
      gap: 0.8rem;

      h2 {
        grid-row: 1 / 2;
        color: var(--primary);
        font-weight: 500;
        font-size: 1.6rem;
      }

      p {
        grid-row: 2 / 3;
        color: var(--sub);
        font-weight: 300;
      }

      input {
        border: 1px solid var(--sub);
        border-radius: 0.5rem;
      }
    }

    .edit-btn {
      grid-column: 3 / 4;
      display: inherit;
      justify-content: end;

      button {
        background: var(--point);
        color: #fff;
        padding: 0.8rem 1.6rem;
        font-size: 1.2rem;
        border-radius: 2rem;
      }
    }
  }

  .greetings {
    grid-row: 2 / 3;
    color: var(--secondary);
    line-height: 2.8rem;

    textarea {
      border: 1px solid var(--sub);
      border-radius: 0.5rem;
      width: 100%;
      min-height: 10rem;
    }
  }

  .tab {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
    li {
      list-style: none;
      padding: 2rem 0;
      width: 33.3%;
      text-align: center;
      border-top: 2px solid var(--line);
      border-bottom: 2px solid var(--line);
      transition: border-color ease 0.5s;
      cursor: pointer;
      font-weight: 700;
      color: var(--sub);
      user-select: none;
    }
  }
}
</style>
