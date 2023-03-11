<template>
  <div class="editor">
    <div class="wrap_select_toggle">
      <div class="select">
        <!-- Main menu select box -->
        <div class="main">
          <select required v-model="main" @change="onChangeMainMenu">
            <option selected disabled hidden :value="''">게시판 선택</option>
            <option v-for="main in Object.keys($store.state.menu.menus)" :key="main" :value="main">{{ main }}</option>
          </select>
        </div>

        <!-- Sub menu select box -->
        <div class="sub">
          <select required v-model="sub" :disabled="!main" @change="onChangeSubMenu">
            <option selected disabled hidden :value="''">메뉴 선택</option>
            <template v-if="main">
              <option v-for="{ sub } in $store.state.menu.menus[main]" :key="sub" :value="sub">{{ sub }}</option>
            </template>
          </select>
        </div>

        <!-- Category select box -->
        <div class="category">
          <select v-model="category" :disabled="!sub">
            <option selected disabled hidden :value="''">카테고리 선택</option>
            <template v-if="sub">
              <option v-for="category in $store.state.menu.categories" :key="category" :value="category">{{ category }}</option>
            </template>
          </select>
        </div>
      </div>

      <!-- Public scope toggle button -->
      <div class="wrap_toggle">
        <Toggle :isPublic="isPublic" @update="onChangeIsPublic" />
      </div>
    </div>

    <!-- Title and File button -->
    <div class="wrap_title_file-add-btn">
      <div class="title">
        <input type="text" v-model="title" placeholder="제목을 입력하세요." onfocus="this.placeholder=''" onblur="this.placeholder='제목을 입력하세요.'" />
      </div>
    </div>

    <!-- Content -->
    <div class="content">
      <textarea ref="CONTENT_EL" v-model="content" placeholder="당신의 이야기를 적어보세요..." @keydown="onChangeCanLeavePage(false)" />
      <markdown class="markdown" :source="content" :plugins="plugins" :breaks="true" :xhtmlOut="true" :typographer="true" />
    </div>

    <!-- GPT Buttons -->
    <div>
      <Button :thema="'primary'" @click="onCreateCompletions">초안 만들기 </Button>
      <Button :thema="'primary'" @click="onCloseCompletions">생성 멈춰! </Button>
    </div>

    <!-- Image Buttons -->
    <div class="wrap_image_btns">
      <div class="images_add_btn">
        <label for="upload_input" class="upload_label"> <Ico :svg="'add-image'" class="ico_add-image" />사진 추가</label>
        <input ref="UPLOAD_INPUT_EL" type="file" id="upload_input" @change="onUploadImages" @click="$refs.UPLOAD_INPUT_EL.value = ''" multiple />
      </div>
      <!--
        <Button
          v-show="fileState.files.length"
          class="btn_image_clear"
          svg="add-image"
          :content="'사진 모두 제거'"
          :size="'md'"
          @click="onClearImages"
        ></Button>
        -->
    </div>

    <!-- Images -->
    <div class="images" v-if="images.length">
      <ul>
        <li v-for="(file, index) in images" :key="index">
          <div class="wrap_thumbnail">
            <img 
              :src="`${file.thumbnail}`"
              :class="file._id === thumbnail ? 'selected_thumbnail' : ''"
              @click="onSelectImage(file), onInsertImage(file.thumbnail)"
            />
            <Button class="image_del_btn" 
              :svg="'del-image'" 
              :theme="'primary'"
              @click="onDeleteImage(file, index)"
            />
          </div>
        </li>
      </ul>
    </div>

    <!-- Submit Button -->
    <div class="wrap_btns">
      <Button 
        class="btn_submit"
        :shape="isMobile ? 'fill-round-full' : 'fill-round'"
        :theme="'primary'"
        @click="onChangeCanLeavePage(true), onUpdatePost()"
      >작성 완료
      </Button>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, reactive, computed, nextTick, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { useStore } from 'vuex'
import Markdown from 'vue3-markdown-it'
import MarkdownEmoji from 'markdown-it-emoji'
import Toggle from '../../components/ui/Toggle.vue'
import 'highlight.js/styles/atom-one-dark.css'

const route = useRoute()
const { push } = useRouter()
const { state, dispatch, commit } = useStore()
const { postId, draftId } = route.query

const plugins = [{ plugin: MarkdownEmoji }]

const isMobile = inject('isMobile')
const DIALOG_EL = inject('DIALOG_EL')
const TOAST_EL = inject('TOAST_EL')
const CONTENT_EL = ref(null)

const MAX_TRY = 3
let tempId = null
let autoSave = null
let eventSource = null
let canLeavePage = true

const main = computed({
  get: () => state.post.main ?? '',
  set: (value) => commit('post/SET_MAIN', value)
})
const sub = computed({
  get: () => state.post.sub ?? '',
  set: (value) => commit('post/SET_SUB', value)
})
const title = computed({
  get: () => state.post.post.title ?? '',
  set: (value) => commit('post/SET_TITLE', value)
})
const content = computed({
  get: () => state.post.post.content ?? '',
  set: (value) => commit('post/SET_CONTENT', value)
})
const category = computed({
  get: () => state.post.post.category ?? '',
  set: (value) => commit('post/SET_CATEGORY', value)
})
const isPublic = computed({
  get: () => state.post.post.isPublic,
  set: (value) => commit('post/SET_IS_PUBLIC', value)
})
const images = computed({
  get: () => state.post.post.images ?? [],
  set: (value) => commit('post/SET_IMAGES', value)
})
const thumbnail = computed({
  get: () => state.post.post.thumbnail,
  set: (value) => commit('post/SET_THUMBNAIL', value)
})

const postState = reactive({
  main,
  sub,
  title,
  content,
  category,
  isPublic,
  images: images.value.map((image) => image._id),
  thumbnail
})

const onChangeMainMenu = () => {
  document.body.querySelector('div.sub select').selectedIndex = 0
  document.body.querySelector('div.category select').selectedIndex = 0
}

const onChangeSubMenu = () => {
  document.body.querySelector('div.category select').selectedIndex = 0
}

const onChangeIsPublic = (state) => {
  isPublic.value = Boolean(state)
}

const onUpdateDraft = async (formData) => {
  if (!sub.value) return TOAST_EL.value.open('error', '게시글을 삽입할 메뉴를 선택해야 합니다.')

  const { success, draft, images: updatedImages } = await dispatch('draft/updateDraft', { 
    draftId: tempId,
    payload: formData ? formData : postState
  })

  if (!success) {
    TOAST_EL.value.open('error', '임시저장에 실패하였습니다')
  } else {
    TOAST_EL.value.open('success', '임시저장 되었습니다.')
    tempId = draft._id
  }

  return { success, images: updatedImages }
}

const onUpdatePost = async () => {
  if (!sub.value) return TOAST_EL.value.open('error', '게시글을 삽입할 메뉴를 선택해야 합니다.')

  const { success, post, error } = postId
    ? await dispatch('post/updatePost', { payload: postState, postId: postId })
    : await dispatch('post/createPost', { payload: postState })

  if (!success) return TOAST_EL.value.open('error', error)

  return push({ name: 'post', params: { postId: post._id } })
}

const onUploadImages = async (event) => {
  if (!event.target.files.length) return
  if (!sub.value) return TOAST_EL.value.open('error', '게시글을 삽입할 메뉴를 선택해야 합니다.')

  for (const { name } of event.target.files) {
    if (String(name).split('.')[0].length > 32) {
      return TOAST_EL.value.open('error', '파일명은 32자 이하만 가능합니다.')
    }
  }

  const formData = new FormData()
  Object.values(event.target.files).forEach((file) => formData.append('images', file))
  Object.entries(postState).forEach(([key, value]) => formData.append(key, value))

  const { success, images: updatedImages, error } = postId
    ? await dispatch('post/updatePost', { postId: postId, payload: formData })
    : await onUpdateDraft(formData)

  if (!success) return TOAST_EL.value.open('error', error)

  if (Array.isArray(updatedImages) && updatedImages.length) {
    images.value = updatedImages
    onSelectImage(updatedImages[0])
    for await (const image of updatedImages) {
      await nextTick()
      onInsertImage(image.thumbnail)
    }
  }
}

const onDeleteImage = async (file, index) => {
  if (typeof file !== 'object') return

  const { success, error } = postId
    ? await dispatch('post/deleteFile', { postId: postId, imageId: file._id })
    : await dispatch('draft/deleteFile', { draftId: tempId, imageId: file._id })

  if (!success) return TOAST_EL.value.open('error', error)

  commit('post/UNSET_IMAGE', index)
}

const onSelectImage = (file) => {
  if (typeof file !== 'object') return
  thumbnail.value = file._id
}

const onInsertImage = (url) => {
  let start = CONTENT_EL.value.value.substring(0, CONTENT_EL.value.selectionStart)
  let end = CONTENT_EL.value.value.substring(CONTENT_EL.value.selectionEnd, CONTENT_EL.value.value.length)

  const innerText = `\n!` + `[` + `]` + `(` + `${url}` + `)\n`
  content.value = start + innerText + end
  CONTENT_EL.value.focus()
}

const onCreateCompletions = async () => {
  const url = `//localhost:3000/v1/openai/stream/completions?prompt=${title.value}`

  if (eventSource && (eventSource.readyState === 0 || eventSource.readyState === 1)) {
    return TOAST_EL.value.open('error', '초안 생성 중입니다. 생성 종료 버튼을 눌러 진행을 멈추거나 생성이 종료된 후 다시 시도해 주세요.')
  }
  if (title.value?.length < 6) {
    return TOAST_EL.value.open('error', '제목을 최소 5글자 이상 입력해주세요.')
  }

  eventSource = new EventSource(url, { withCredentials: true })

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data)
    content.value += data
  }
  eventSource.onerror = (error) => {
    error.data === 'DONE'
      ? TOAST_EL.value.open('success', '초안 작성을 완료하였습니다.')
      : TOAST_EL.value.open('error', '서버와 통신이 원할하지 않습니다. 잠시 후 다시 시도해 주세요.')

    eventSource.close()
  }
}

const onCloseCompletions = () => {
  eventSource.close()
}

const onChangeCanLeavePage = (bool) => {
  canLeavePage = bool
}

const unloadEvent = (event) => {
  if (!canLeavePage) {
    event.preventDefault()
    event.returnValue = ''
  }
}

watch(
  () => canLeavePage,
  (newCanLeavePage, oldCanLeavePage) => {
    if (newCanLeavePage && !oldCanLeavePage && !autoSave) {
      autoSave = postId ? setInterval(onUpdatePost, 1000 * 60 * 5) : setInterval(onUpdateDraft, 1000 * 60 * 5)
    }
  },
)

watch(
  sub,
  () => {
    if (main.value) {
      commit('menu/SET_CURRENT_MENUS', { main: main.value, sub: sub.value })
    } 
  }
)

watch(
  () => route.query,
  async () => {
    if (postId) {
      const { success, error } = await dispatch('post/getPost', { postId: postId })

      if (!success) {
        TOAST_EL.value.open('error', error)
        return push({ name: 'editor' })
      }
    } 
    else if (draftId) {
      const { success, error } = await dispatch('post/getDraft', { draftId: draftId })

      if (!success) {
        TOAST_EL.value.open('error', error)
        return push({ name: 'editor' })
      }

      tempId = draftId
    }
    else {
      commit('post/SET_POST', {})
    }
  }, { immediate: true }
)

onMounted(() => {
  window.addEventListener('beforeunload', unloadEvent)
  onSelectImage(images.value[0])
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', unloadEvent)
  clearInterval(autoSave)
})

onBeforeRouteLeave(async (to, from, next) => {
  if (canLeavePage) next()
  else {
    const ok = await DIALOG_EL.value.show({
      title: '현재 페이지에서 나가시겠습니까?',
      message: '임시 저장되지 않은 내용은 사라집니다.',
      okButton: '나가기',
      cancelButton: '잠시만요!',
    })
    ok ? next() : next(false)
  }
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.editor {
  .wrap_select_toggle {
    display: flex;
    flex-direction: row;
    align-items: center;

    @include mobile {
      flex-direction: column;
      align-items: flex-end;
    }

    .select {
      display: flex;
      flex-direction: row;
      width: 90%;

      @include mobile {
        flex-direction: column;
        width: 100%;
      }

      div {
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid var(--border3);
        width: 27rem;
        font-size: 1.4rem;
        margin-right: 2.4rem;
        padding: 0 2.4rem;

        @include mobile {
          width: 100%;
          margin-right: 0;
          margin-bottom: 1.6rem;
        }

        select {
          width: 100%;
          font-size: 1.4rem;
          color: var(--text3);
          height: 4.8rem;
          background-color: transparent;
          text-transform: uppercase;
        }

        &:last-child select > option {
          text-transform: none;
        }
      }
    }

    .wrap_toggle {
      display: flex;
      justify-content: flex-end;
      width: 10%;

      &:deep(.toggle) {
        flex-direction: row-reverse;

        span {
          margin: 0 0.4rem 0 0;
        }
      }

      @include mobile {
        width: 100%;
      }
    }
  }

  .wrap_title_file-add-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid var(--border3);
    margin: 2.4rem 0 1.6rem;
    width: 100%;
    height: 4.8rem;
    padding: 0 2.4rem;

    @include mobile {
      margin: 1.6rem 0;
    }

    .title {
      width: 80%;

      input {
        color: var(--text4);
        font-size: 1.4rem;
        width: 100%;
      }

      input::placeholder {
        color: var(--text2);
        font-size: 1.4rem;
      }
    }
  }

  .content {
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid #ddd;

    textarea,
    .markdown {
      width: 50%;
      min-height: 48rem;
      padding: 2.4rem;
      font-size: 1.4rem;
      color: var(--text3);
      overflow-y: auto;
      max-height: 64rem;
      line-height: 1.5;

      -ms-overflow-style: none;
      scrollbar-width: none;
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;

      &::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera*/
      }
    }

    textarea {
      margin: 0 2.4rem 0 0;
      resize: vertical;

      @include mobile_all {
        width: 100%;
        margin: 0;
      }
    }

    textarea::placeholder {
      color: var(--text2);
      font-size: 1.4rem;
    }

    .markdown {
      @include mobile_all {
        display: none;
      }
    }
  }

  .images_add_btn {
    margin: 1.6rem 0 2.4rem;
    label.upload_label {
      font-size: 1.2rem;
      line-height: 1.8rem;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.1rem;
      color: var(--text3);
      display: flex;
      align-items: center;
      padding: 1.2rem 2.4rem 1.2rem 0;

      .ico_add-image {
        margin: 0 0.8rem 0 0;
      }
    }

    input#upload_input {
      display: none;
    }
  }

  .btn_image_clear {
    margin: 0 0 0 0;
  }

  .images {
    margin: 0 0 2.4rem 0;
    ul {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      margin: calc(3.2rem - 1.2rem) 0 0;

      li {
        width: 7.4rem;
        height: calc(7.4rem + 1.6rem);
        margin: 0rem 2.4rem 0 0;

        .wrap_thumbnail {
          position: relative;
          img {
            width: 100%;
            height: 7.4rem;
            border-radius: 2.4rem;
            object-fit: cover;
            padding: 0.2rem;

            &.selected_thumbnail {
              border: 2px solid var(--primary);
            }
          }
          .image_del_btn {
            position: absolute;
            bottom: -0.6rem;
            right: -0.6rem;
            color: var(--primary);

            i {
              font-size: 2.2rem;
            }

            .material-symbols-outlined {
              font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48;
            }
          }
        }
      }
    }
  }

  .wrap_btns {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .wrap_image_btns {
      display: flex;
      align-items: center;
      margin: 1.6rem 0 2rem;
      justify-content: flex-start;
      width: 100%;
    }
  }
}
</style>
