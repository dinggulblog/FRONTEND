<template>
  <div class="profile">
    <form v-on:submit.prevent="submitForm">
      <div class="wrap_author">
        <AuthorSlot :profile="profileState" :type="displayState.display"></AuthorSlot>
        <div class="wrap_btn-edit">
          <button class="btn_edit" @click="displayState.display === 'profileView' ? onChangeDisplay() : onSubmit()">
            {{ displayState.display === 'profileView' ? 'EDIT' : 'OK' }}
          </button>
        </div>
      </div>
    </form>

    <div class="wrap_tab">
      <ul class="tab">
        <li
          @click="onChangeTab('introduce')"
          :style="[
            displayState.tab === 'introduce' ? { borderColor: 'var(--secondary)', color: 'var(--secondary)' } : '',
          ]"
        >
          INTRODUCE
        </li>
        <li
          @click="onChangeTab('like')"
          :style="[displayState.tab === 'like' ? { borderColor: 'var(--secondary)', color: 'var(--secondary)' } : '']"
        >
          LIKED POSTS
        </li>
        <li
          @click="onChangeTab('comment')"
          :style="[
            displayState.tab === 'comment' ? { borderColor: 'var(--secondary)', color: 'var(--secondary)' } : '',
          ]"
        >
          COMMENTED POSTS
        </li>
      </ul>
    </div>

    <Introduce v-if="displayState.tab === 'introduce'" :introduce="profileState.introduce" />
  </div>

  <!--

  <div class="profile">
    <form v-on:submit.prevent="submitForm">
      <div class="author">
        <div class="avatar">
          <img :src="profileState.avatar" alt="avatar" />
        </div>
        <div class="info">
          <h2>{{ profileState.nickname }}님</h2>
          <p v-if="displayState.display === 'view'">
            {{ profileState.greetings ? profileState.greetings : 'EDIT 버튼을 눌러 인사말을 추가할 수 있어요.' }}
          </p>
          <input v-else ref="GREETINGS_EL" v-model="greetings" />
        </div>
        <div class="edit-btn">
          <button @click="displayState.display === 'view' ? onChangeDisplay() : onSubmit()">
            {{ displayState.display === 'view' ? 'Edit' : 'OK' }}
          </button>
        </div>
      </div>
    </form>

    <ul class="tab">
      <li
        @click="onChangeTab('introduce')"
        :style="[
          displayState.tab === 'introduce' ? { borderColor: 'var(--secondary)', color: 'var(--secondary)' } : '',
        ]"
      >
        INTRODUCE
      </li>
      <li
        @click="onChangeTab('like')"
        :style="[displayState.tab === 'like' ? { borderColor: 'var(--secondary)', color: 'var(--secondary)' } : '']"
      >
        LIKED POSTS
      </li>
      <li
        @click="onChangeTab('comment')"
        :style="[displayState.tab === 'comment' ? { borderColor: 'var(--secondary)', color: 'var(--secondary)' } : '']"
      >
        COMMENTED POSTS
      </li>
    </ul>

    <Introduce v-if="displayState.tab === 'introduce'" :introduce="profileState.introduce" />


          <div class="posts" v-if="displayState.tab === 'like' || displayState.tab === 'comment'">
      <ul v-if="posts.length">
        <template v-for="post in posts" :key="post._id">
          <List
            :type="'profile'"
            :title="getters['menu/getTitle'](post.subject)"
            :subject="getters['menu/getSubject'](post.subject)"
            :post="post"
            :isLike="[...post.likes].includes(user._id)"
          />
        </template>
      </ul>
      <div v-else class="empty"><span>There is no posts.</span></div>

      <Pagenation2
        :page="pageState.page"
        :limit="pageState.limit"
        :maxPage="pageState.maxPage"
        @updatePage="updatePage"
      />
    </div>
  </div>

  -->
</template>

<script>
  import { onBeforeMount, computed, ref, reactive, nextTick, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  import AuthorSlot from '../../components/slots/AuthorSlot.vue'
  import Introduce from '../../components/Introduce.vue'
  import Pagenation2 from '../../components/Pagenation.vue'

  export default {
    name: 'profile',
    components: {
      AuthorSlot,
      Introduce,
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
        display: 'profileView',
        tab: 'introduce',
      })

      const pageState = reactive({
        page: 1,
        limit: 5,
        maxPage: 1,
      })

      const greetings = ref(null)
      const GREETINGS_EL = ref(null)
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
        displayState.display = 'profileEdit'
      }

      const fileUpload = async (event) => {
        avatarFlie = event.target.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(event.target.files[0])
        reader.onload = () => (profileState.avatar = reader.result)
      }

      const onSubmit = async () => {
        const formData = new FormData()
        formData.append('avatar', avatarFlie)
        formData.append('greetings', greetings.value)
        formData.append('introduce', profileState.introduce)
        const response = await dispatch('auth/updateProfile', formData)
        if (response.success) {
          profileState.avatar = response.data.user.avatar
          profileState.greetings = response.data.user.greetings
          profileState.introduce = response.data.user.introduce
          displayState.display = 'view'
        }
      }

      const findUserPosts = async (filter) => {
        const response = await dispatch('post/getPosts', {
          filter,
          nickname: profileState.nickname,
          page: pageState.page,
          limit: pageState.limit,
        })
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

      return {
        getters,
        user,
        posts,
        profileState,
        displayState,
        pageState,
        greetings,
        GREETINGS_EL,
        onChangeDisplay,
        fileUpload,
        onSubmit,
        onChangeTab,
        updatePage,
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
</style>
