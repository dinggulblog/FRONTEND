<template>
  <div class="profile">
    <!-- Profile -->
    <form v-on:submit.prevent="submitForm">
      <div class="wrap_author">
        <User :profile="profileState" :state="displayState.state" @updateAvatar="onUpdateAvatar" @resetAvatar="resetAvatar" @updateGreetings="updateGreetings" />
        <div class="wrap_btn-edit" v-if="profileState.nickname === user.nickname">
          <button class="btn_edit" @click="displayState.state === 'edit' ? onUpdateGreetings() : onChangeState('edit')">
            {{ displayState.state === 'edit' ? '편집 완료' : '기본 정보 편집' }}
          </button>
        </div>
      </div>
    </form>

    <!-- Tab menu -->
    <div class="wrap_tab">
      <ul class="tab">
        <li v-for="tab in tabs" :key="tab.name" :class="tab.name === displayState.tab ? 'isActive' : ''" @click="onChangeTab(tab.name)">
          {{ tab.content }}
        </li>
      </ul>
    </div>

    <!-- Tab content - Introduce -->
    <div v-if="displayState.tab === 'intro'" class="introduce">
      <span v-if="displayState.state === 'introEdit'">
        <QuillEditor v-model:content="profileState.introduce" contentType="html" :options="options" />
      </span>

      <div v-else class="content_intro" v-dompurify-html="profileState.introduce ? profileState.introduce : '작성된 소개글이 없습니다.'"></div>

      <Button
        v-if="profileState.nickname === user.nickname"
        class="btn_edit_introduce"
        :size="'sm'"
        :shape="'fill-round'"
        :theme="'primary'"
        @click="displayState.state === 'introEdit' ? onUpdateIntroduce() : onChangeState('introEdit')">
        {{ displayState.state === 'introEdit' ? '편집 완료' : '소개글 편집' }}
      </Button>
    </div>

    <!-- Tab content - Posts -->
    <Suspense v-else>
      <template #default>
        <Posts :filter="displayState.tab" :userId="profileState._id" :type="'recent'" />
      </template>
      <template #fallback>
        <ul :id="'recent'">
          <Recent v-for="skeleton in 6" :key="skeleton" />
        </ul>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { inject, ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { QuillEditor } from '@vueup/vue-quill'
import User from '../../components/User.vue'
import Posts from '../../components/Posts.vue'
import Recent from '../../components/slots/Recent.vue'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const { go, currentRoute } = useRouter()
const { state, dispatch } = useStore()

const TOAST_EL = inject('TOAST_EL')
const tabs = ref([
  { name: 'intro', content: '소개글' },
  { name: 'like', content: '좋아요 한 게시물' },
  { name: 'comment', content: '댓글 단 게시물' },
])
const options = ref({
  theme: 'snow',
  placeholder: '소개글을 작성해 주세요.',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['clean'],
    ],
  },
})

const profileState = reactive({
  nickname: computed(() => currentRoute.value.params.nickname),
  _id: '',
  avatar: '',
  greetings: '',
  introduce: '',
})

const displayState = reactive({
  tab: 'intro',
  state: 'view',
})

const user = computed(() => state.auth.user)

const onChangeState = (state) => {
  displayState.state = state
}

const onChangeTab = (tab) => {
  displayState.tab = tab
}

const onUpdateAvatar = async (event) => {
  if (user.value.nickname !== profileState.nickname) return TOAST_EL.value.open('error', '본인 프로필만 수정 가능합니다.')

  const formData = new FormData()
  formData.append('avatar', event.target.files[0])

  const { success, profile } = await dispatch('auth/updateProfileAvatar', {
    nickname: profileState.nickname,
    payload: formData,
  })

  if (!success) return TOAST_EL.value.open('error', '아바타 업데이트 도중 에러가 발생하였습니다.')

  profileState.avatar = profile.avatar
}

const resetAvatar = async () => {
  if (user.value.nickname !== profileState.nickname) return TOAST_EL.value.open('error', '본인 프로필만 수정 가능합니다.')

  const { success } = await dispatch('auth/deleteProfileAvatar', {
    nickname: profileState.nickname,
  })

  if (!success) return TOAST_EL.value.open('error', '아바타 업데이트 도중 에러가 발생하였습니다.')

  profileState.avatar = null
}

const updateGreetings = (event) => {
  profileState.greetings = event.target.value
}

const onUpdateGreetings = async () => {
  if (profileState.greetings.length > 150) return TOAST_EL.value.open('error', '글자 수 제한을 초과하였습니다. (최대 150자까지 허용)')
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
    payload: {
      introduce: profileState.introduce,
    },
  })

  if (!success) return

  profileState.introduce = profile.introduce
  onChangeState('view')
}

watch(
  currentRoute,
  async () => {
    const { profile, error } = await dispatch('auth/getProfile', {
      nickname: profileState.nickname,
    })

    if (error) {
      alert(error)
      return go(-1)
    }

    profileState._id = profile._id
    profileState.avatar = profile.avatar
    profileState.greetings = profile.greetings
    profileState.introduce = profile.introduce
  },
  { immediate: true }
)
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.profile {
  .wrap_author {
    position: relative;
    margin: 0 0 4.8rem;

    &:deep(.user-info) {
      align-items: center;

      @include mobile {
        align-items: center;
      }
      .wrap_avatar {
        display: flex;
        flex-direction: column;
        align-items: center;
        .avatar {
          width: 9.6rem;
          height: 9.6rem;
        }

        .wrap_input_file {
          padding: 0.8rem 1.2rem;
          border-radius: 3.2rem;
          background: var(--primary);
          color: var(--text1);
          font-size: 1.1rem;
          cursor: pointer;
          margin: 0.8rem 0;

          label {
            padding: 0;
            margin: 0;
          }

          #input_file {
            display: none;
          }
        }
      }
      .wrap_nickname_greetings {
        color: var(--text3);
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
          border: 0.1rem solid var(--border3);
          border-radius: 1.2rem;
          padding: 1.2rem;
          width: 100%;
          min-height: 12rem;
          resize: none;
          font-size: 1.4rem;
          color: var(--text2);

          @include mobile {
            min-height: 12rem;
          }
        }
      }
    }

    .btn_edit {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 1.4rem;
      text-decoration: underline;
      color: var(--primary);
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
        text-align: center;
        border: 1px solid var(--border3);
        border-radius: 3.2rem;
        transition: border-color ease 0.5s;
        cursor: pointer;
        color: var(--text3);
        user-select: none;
        font-size: 1.4rem;

        &:last-child {
          margin: 0;
        }

        &.isActive {
          border-color: var(--primary);
          color: var(--primary);
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
  font-size: 1.4rem;

  .content_intro {
    color: var(--text4);
  }

  .btn_edit_introduce {
    margin: 2.4rem 0 0;
    margin-left: auto;
  }
}
</style>
