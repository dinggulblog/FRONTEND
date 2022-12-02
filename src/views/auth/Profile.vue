<template>
  <div class="profile">
    <form v-on:submit.prevent="submitForm">
      <div class="wrap_author">
        <AuthorSlot 
          :profile="profileState"
          :type="displayState.button"
          @updateAvatar="onUpdateAvatar"
          @updateGreetings="updateGreetings">
        </AuthorSlot>
        <div class="wrap_btn-edit">
          <button class="btn_edit" @click="displayState.button === 'ok' ? onUpdateGreetings() : onChangeButton('ok')">
            {{ displayState.button.toUpperCase() }}
          </button>
        </div>
      </div>
    </form>

    <div class="wrap_tab">
      <ul class="tab">
        <li
          @click="onChangeTab('introduce')"
          :style="[displayState.tab === 'introduce' ? { borderColor: 'var(--secondary)', color: 'var(--secondary)' } : '']">
          INTRODUCE
        </li>
        <li
          @click="onChangeTab('like')"
          :style="[displayState.tab === 'like' ? { borderColor: 'var(--secondary)', color: 'var(--secondary)' } : '']">
          LIKED POSTS
        </li>
        <li
          @click="onChangeTab('comment')"
          :style="[displayState.tab === 'comment' ? { borderColor: 'var(--secondary)', color: 'var(--secondary)' } : '']">
          COMMENTED POSTS
        </li>
      </ul>
    </div>

    <div v-if="displayState.tab === 'introduce'" class="introduce">{{ profileState.introduce }}</div>
    <Posts v-else type="list" :user="user"></Posts>
    
  </div>
</template>

<script>
  import { onBeforeMount, computed, reactive } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStore } from 'vuex'
  import AuthorSlot from '../../components/slots/AuthorSlot.vue'
  import Posts from '../../components/Posts.vue'

  export default {
    name: 'profile',
    components: {
      AuthorSlot,
      Posts
    },
    setup() {
      const route = useRoute()
      const { state, dispatch, commit } = useStore()

      const displayState = reactive({
        button: 'edit',
        tab: 'introduce',
      })

      const profileState = reactive({
        nickname: route.params.nickname,
        _id: '',
        email: '',
        avatar: '',
        greetings: '',
        introduce: '',
      })

      const user = computed(() => state.auth.user)
      const posts = computed(() => state.post.posts)
      const page = computed(() => state.post.page)
      const maxPage = computed(() => state.post.maxPage)
      const limit = computed(() => state.post.limit)

      const onChangeButton = (text) => {
        displayState.button = text
      }

      const onChangeTab = (tab) => {
        displayState.tab = tab
        if (tab === 'like' || tab === 'comment') getPosts(tab)
      }

      const onUpdatePage = (page) => commit('post/SET_PAGE', page)

      const onUpdateAvatar = async (event) => {
        const formData = new FormData()
        formData.append('avatar', event.target.files[0])
        const { success, profile } = await dispatch('auth/updateProfileAvatar', { nickname: profileState.nickname, payload: formData })

        if (!success) return

        profileState.avatar = process.env.VUE_APP_IMAGE_URL + profile.avatar?.serverFileName
      }

      const updateGreetings = (event) => {
        profileState.greetings = event.target.value
      }

      const onUpdateGreetings = async () => {
        const { success, profile } = await dispatch('auth/updateProfile', { nickname: profileState.nickname, payload: { greetings: profileState.greetings } })

        if (!success) return

        profileState.greetings = profile.greetings
        onChangeButton('edit')
      }

      const getPosts = async (filter) => {
        await dispatch('post/getPosts', { auth: false, payload: {
          filter,
          page: page.value,
          limit: limit.value,
          userId: profileState._id,
        }})
      }

      onBeforeMount(async () => {
        if (profileState.nickname) {
          const { success, profile } = await dispatch('auth/getProfile', { nickname: profileState.nickname })

          if (!success) return

          profileState._id = profile._id;
          profileState.email = profile.email
          profileState.avatar = profile.avatar
          profileState.greetings = profile.greetings
          profileState.introduce = profile.introduce
        }
      })

      return {
        user,
        posts,
        page,
        maxPage,
        profileState,
        displayState,
        onChangeButton,
        onChangeTab,
        onUpdatePage,
        onUpdateAvatar,
        updateGreetings,
        onUpdateGreetings,
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .profile {
    .wrap_author {
      margin: 0 0 6.4rem;
      position: relative;

      &::v-deep .author {
        .wrap_avatar {
          position: relative;
          .avatar {
            width: 9.6rem;
            height: 9.6rem;
            margin: 0 1.6rem 0 0;
          }

          .wrap_input_file {
            position: absolute;
            bottom: 0;
            right: 0;

            #input_file {
              display: none;
            }
          }
        }
        .wrap_nickname_greetings {
          color: var(--btn_text);
          width: 100%;
          .nickname {
            font-size: 1.6rem;
            font-weight: 500;
          }

          .greetings {
            margin: 1.6rem 0 0;
            font-size: 1.4rem;
            overflow: hidden;
            white-space: normal;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: keep-all;
          }

          .input_greetings {
            margin: 1.6rem 0 0;
            border: 1px solid blue;
            padding: 1.2rem;
            width: 100%;
          }
        }
      }

      .btn_edit {
        position: absolute;
        top: 0;
        right: 0;
        font-size: 1.4rem;
        text-decoration: underline;
        color: var(--secondary);
      }
    }

    .wrap_tab {
      margin: 4.8rem 0;

      .tab {
        display: flex;
        li {
          padding: 1.2rem 2.4rem;
          margin: 0 2.4rem 0 0;
          list-style: none;
          text-align: center;
          border: 2px solid #ddd;
          border-radius: 3.2rem;
          transition: border-color ease 0.5s;
          cursor: pointer;
          font-weight: 500;
          color: var(--btn_text);
          user-select: none;
          font-size: 1.2rem;
          letter-spacing: 0.1rem;

          &:last-child {
            margin: 0;
          }
        }
      }
    }
  }

  .introduce {
    font-size: 1.6rem;
    color: var(--primary);
  }
</style>
