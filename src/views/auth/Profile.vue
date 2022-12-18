<template>
  <div class="profile">
    <form v-on:submit.prevent="submitForm">
      <div class="wrap_author">
        <AuthorSlot
          :profile="profileState"
          :state="displayState.state"
          @updateAvatar="onUpdateAvatar"
          @resetAvatar="resetAvatar"
          @updateGreetings="updateGreetings"
        >
        </AuthorSlot>
        <div class="wrap_btn-edit" v-if="profileState.nickname === profile.nickname">
          <button class="btn_edit" @click="displayState.state === 'edit' ? onUpdateGreetings() : onChangeState('edit')">
            {{ displayState.button.toUpperCase() }}
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
          소개글
        </li>
        <li
          @click="onChangeTab('like')"
          :style="[displayState.tab === 'like' ? { borderColor: 'var(--secondary)', color: 'var(--secondary)' } : '']"
        >
          좋아요한 게시글
        </li>
        <li
          @click="onChangeTab('comment')"
          :style="[
            displayState.tab === 'comment' ? { borderColor: 'var(--secondary)', color: 'var(--secondary)' } : '',
          ]"
        >
          댓글단 게시글
        </li>
      </ul>
    </div>

    <div v-if="displayState.tab === 'introduce'" class="introduce">
      <span v-if="displayState.state === 'introEdit'">
        <QuillEditor theme="snow" v-model:content="profileState.introduce" contentType="html" />
      </span>

      <div
        class="content_intro"
        v-else
        v-dompurify-html="profileState.introduce ? profileState.introduce : '작성된 소개글이 없습니다.'"
      ></div>

      <Button
        class="btn_edit_introduce"
        v-if="profileState.nickname === profile.nickname"
        :content="displayState.introButton"
        :size="'sm'"
        :rounded="true"
        :bgColor="'primary-dark'"
        :customFontSize="'1.2rem'"
        @onClick="displayState.state === 'introEdit' ? onUpdateIntroduce() : onChangeState('introEdit')"
      ></Button>
    </div>

    <Posts v-else type="list"></Posts>
  </div>
</template>

<script>
  import { onBeforeMount, computed, reactive } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStore } from 'vuex'
  import { QuillEditor } from '@vueup/vue-quill'
  import AuthorSlot from '../../components/slots/AuthorSlot.vue'
  import Posts from '../../components/posts/Posts.vue'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'

  export default {
    name: 'profile',
    components: {
      QuillEditor,
      AuthorSlot,
      Posts,
    },
    setup() {
      const route = useRoute()
      const { state, dispatch, commit } = useStore()

      const displayState = reactive({
        state: 'view',
        button: computed(() => (displayState.state === 'edit' ? '편집 완료' : '기본 정보 편집')),
        introButton: computed(() => (displayState.state === 'introEdit' ? '편집 완료' : '소개글 편집')),
        tab: 'introduce',
        alignItems: computed(() => (displayState.state === 'edit' ? 'flex-start' : 'center')),
      })

      const profileState = reactive({
        nickname: route.params.nickname,
        _id: '',
        avatar: '',
        greetings: '',
        introduce: '',
      })

      const profile = computed(() => state.auth.profile)
      const posts = computed(() => state.post.posts)
      const page = computed(() => state.post.page)
      const maxPage = computed(() => state.post.maxPage)
      const limit = computed(() => state.post.limit)

      const onChangeState = (state) => {
        displayState.state = state
      }

      const onChangeTab = (tab) => {
        displayState.tab = tab
        if (tab === 'like' || tab === 'comment') getPosts(tab)
      }

      const onUpdatePage = (page) => commit('post/SET_PAGE', page)

      const onUpdateAvatar = async (event) => {
        const formData = new FormData()
        formData.append('avatar', event.target.files[0])
        const { success, profile } = await dispatch('auth/updateProfileAvatar', {
          nickname: profileState.nickname,
          payload: formData,
        })

        if (!success) return

        profileState.avatar = profile.avatar
      }

      const resetAvatar = async () => {
        const { success, profile } = await dispatch('auth/deleteProfileAvatar', { nickname: profileState.nickname })

        if (!success) return

        profileState.avatar = null
      }

      const updateGreetings = (event) => {
        profileState.greetings = event.target.value
      }

      const onUpdateGreetings = async () => {
        if (profileState.greetings.length > 150) return alert('글자 수 제한을 초과하였습니다. (최대 150자까지 허용)')
        const { success, profile } = await dispatch('auth/updateProfile', {
          nickname: profileState.nickname,
          payload: { greetings: profileState.greetings },
        })

        if (!success) return

        profileState.greetings = profile.greetings
        onChangeState('view')
      }

      const onUpdateIntroduce = async () => {
        const { success, profile } = await dispatch('auth/updateProfile', {
          nickname: profileState.nickname,
          payload: { introduce: profileState.introduce.replace(/(^([ ]*<p><br><\/p>)*)|((<p><br><\/p>)*[ ]*$)/gi, '').trim(' ') },
        })

        if (!success) return

        profileState.introduce = profile.introduce
        onChangeState('view')
      }

      const getPosts = async (filter) => {
        await dispatch('post/getPosts', {
          auth: false,
          payload: {
            filter,
            page: page.value,
            limit: limit.value,
            userId: profileState._id,
          },
        })
      }

      onBeforeMount(async () => {
        if (profileState.nickname) {
          const { success, profile } = await dispatch('auth/getProfile', { nickname: profileState.nickname })

          if (!success) return
          
          profileState._id = profile._id
          profileState.avatar = profile.avatar
          profileState.greetings = profile.greetings
          profileState.introduce = profile.introduce
        }
      })

      return {
        profile,
        posts,
        page,
        maxPage,
        profileState,
        displayState,
        onChangeState,
        onChangeTab,
        onUpdatePage,
        onUpdateAvatar,
        resetAvatar,
        updateGreetings,
        onUpdateGreetings,
        onUpdateIntroduce,
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .profile {
    .wrap_author {
      position: relative;
      margin: 0 0 4.8rem;

      &::v-deep .author {
        align-items: v-bind('displayState.alignItems');
        .wrap_avatar {
          display: flex;
          flex-direction: column;
          align-items: center;
          .avatar {
            width: 9.6rem;
            height: 9.6rem;
          }

          .wrap_input_file {
            margin: 2.4rem 0 0.8rem;
            label {
              padding: 0.8rem 1.2rem;
              border-radius: 3.2rem;
              background: var(--primary);
              color: #fff;
              font-size: 1.1rem;
            }

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
            white-space: pre-wrap;
          }

          .textarea_greetings {
            margin: 1.6rem 0 0;
            border: 0.1rem solid #ccc;
            border-radius: 1.2rem;
            padding: 1.2rem;
            width: 100%;
            min-height: 6.8rem;
            resize: none;
            font-size: 1.4rem;
            color: var(--text-light);
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
      margin: 0 0 3.2rem 0;

      .tab {
        display: flex;
        flex-wrap: wrap;
        li {
          flex: 0 0 auto;
          padding: 0.8rem 1.6rem;
          margin: 0 1.6rem 0 0;
          list-style: none;
          text-align: center;
          border: 1px solid #ddd;
          border-radius: 3.2rem;
          transition: border-color ease 0.5s;
          cursor: pointer;
          color: var(--text-light);
          user-select: none;
          font-size: 1.4rem;
          letter-spacing: 0.1rem;
          font-family: 'Noto Sans KR';

          &:last-child {
            margin: 0;
          }
        }

        @include mobile_all {
          flex-wrap: nowrap;
          overflow-x: auto;
          overflow-y: hidden;
        }
      }
    }
  }

  .introduce {
    font-size: 1.6rem;
    .content_intro {
      color: var(--btn_text);
    }

    .btn_edit_introduce {
      margin: 2.4rem 0 0;
      margin-left: auto;
    }
  }
</style>
