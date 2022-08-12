<template>
  <div class="profile">
    <form v-on:submit.prevent="submitForm">
      <div class="author">
        <div class="avatar">
          <img :src="profileState.avatar" alt="avatar" />
          <span v-if="displayState.display === 'edit'">
            <label for="input-file"><i class="material-symbols-outlined"> add_circle </i></label>
            <input type="file" id="input-file" @change="fileUpload" />
          </span>
        </div>
        <div class="info">
          <h2>{{ profileState.nickname }}님</h2>
          <p v-if="displayState.display === 'view'">{{ profileState.greetings ? profileState.greetings : 'EDIT 버튼을 눌러 인사말을 추가할 수 있어요.' }}</p>
          <input v-else ref="greetingsInputEl" v-model="greetingsInput" />
        </div>
        <div class="edit-btn" v-if="user.nickname === profileState.nickname">
          <button @click="displayState.display === 'view' ? onChangeDisplay() : onSubmit()">{{ displayState.display === 'view' ? 'Edit' : 'OK' }}</button>
        </div>
      </div>
    </form>

    <ul class="tab">
      <li @click="onChangeTab('introduce')" :style="[displayState.tab === 'introduce' ? { borderColor: 'var(--point)', color: 'var(--point)' } : '']">INTRODUCE</li>
      <li @click="onChangeTab('like')" :style="[displayState.tab === 'like' ? { borderColor: 'var(--point)', color: 'var(--point)' } : '']">LIKED POSTS</li>
      <li @click="onChangeTab('comment')" :style="[displayState.tab === 'comment' ? { borderColor: 'var(--point)', color: 'var(--point)' } : '']">COMMENTED POSTS</li>
    </ul>

    <Introduce v-if="displayState.tab === 'introduce'" :introduce="profileState.introduce" />

    <div class="posts" v-if="displayState.tab === 'like' || displayState.tab === 'comment'">
      <ul v-if="posts.length">
        <template v-for="post in posts" :key="post._id">
          <List :type="'profile'" :title="getters['menu/getTitle'](post.subject)" :subject="getters['menu/getSubject'](post.subject)" :post="post" :isLike="[...post.likes].includes(user.id)" />
        </template>
      </ul>
      <div v-else class="empty"><span>There is no posts.</span></div>

      <Pagenation2 :page="pageState.page" :limit="pageState.limit" :maxPage="pageState.maxPage" @updatePage="updatePage" />
    </div>
  </div>
</template>

<script>
import { onBeforeMount, computed, ref, reactive, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Introduce from '../../components/Introduce.vue'
import List from '../../components/List.vue'
import Pagenation2 from '../../components/Pagenation2.vue'

export default {
  name: 'profile',
  components: {
    Introduce,
    List,
    Pagenation2,
  },
  setup() {
    const { currentRoute } = useRouter()
    const { state, getters, dispatch } = useStore()

    const user = computed(() => state.auth.user)
    const posts = computed(() => state.post.posts)

    const profileState = reactive({
      nickname: currentRoute.value.params.nickname,
      avatar: '',
      greetings: '',
      introduce: '',
    })

    const displayState = reactive({
      display: 'view',
      tab: 'introduce',
    })

    const pageState = reactive({
      page: 1,
      limit: 5,
      maxPage: 1,
    })

    const greetingsInput = ref(profileState.greetings)
    const greetingsInputEl = ref(null)
    let avatarFlie = ''

    onBeforeMount(async () => {
      if (profileState.nickname) {
        const response = await dispatch('auth/getProfile', profileState.nickname)
        const user = response.data.user

        if (user) {
          profileState.greetings = user.greetings
          profileState.introduce = user.introduce
          profileState.avatar = user.avatar
        }
      }
    })

    const onChangeDisplay = () => {
      displayState.display = 'edit'
      nextTick(() => {
        greetingsInput.value = profileState.greetings
        greetingsInputEl.value.focus()
      })
    }

    const fileUpload = async (event) => {
      avatarFlie = event.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.onload = () => (profileState.avatar = reader.result)
      greetingsInputEl.value.focus()
    }

    const onSubmit = async () => {
      const formData = new FormData()
      formData.append('avatar', avatarFlie)
      formData.append('greetings', greetingsInput.value)
      formData.append('introduce', profileState.introduce)
      const response = await dispatch('auth/updateProfile', formData)
      if (response.success) {
        console.log(response.data.user)
        profileState.avatar = response.data.user.avatar
        profileState.greetings = response.data.user.greetings
        profileState.introduce = response.data.user.introduce
        displayState.display = 'view'
      }
    }

    const findUserPosts = async (filter) => {
      const response = await dispatch('post/getPosts', { filter, nickname: profileState.nickname, page: pageState.page, limit: pageState.limit })
      response.success ? (pageState.maxPage = response.data.maxPage || 1) : alert(response.message)
    }

    const onChangeTab = (tab) => {
      displayState.tab = tab
      if (tab === 'like' || tab === 'comment') {
        findUserPosts(tab)
      }
      console.log('현재 선택한 tab : ', displayState.tab)
    }

    const updatePage = ({ updatedPage }) => {
      pageState.page = updatedPage
    }

    return { getters, user, posts, profileState, displayState, pageState, greetingsInput, greetingsInputEl, onChangeDisplay, fileUpload, onSubmit, onChangeTab, updatePage }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.profile {
  display: grid;
  grid-template-rows: auto auto;
  letter-spacing: normal;
  font-size: 1.4rem;

  .author {
    grid-row: 1 / 2;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 0 1.6rem;

    .avatar {
      grid-column: 1 / 2;
      position: relative;

      img {
        width: 6rem;
        height: 6rem;
        border-radius: 50%;
        background-color: var(--line);
      }

      #input-file {
        display: none;
      }

      i {
        position: absolute;
        right: -0.7rem;
        bottom: 0;
        margin: 0;
        color: var(--point);
        cursor: pointer;
        border-radius: 50%;
        background: #fff;
      }

      .material-symbols-outlined {
        font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48;
      }
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
        color: var(--primary);
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        word-wrap: break-word;
      }

      input {
        border-radius: 1rem;
        padding: 0.8rem 1.6rem;
        width: 100%;
        background-color: #eee;
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

  .tab {
    display: flex;
    justify-content: center;
    margin: 4.8rem 0;
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

  .posts {
    .empty {
      color: var(--primary);
    }
  }
}
</style>
