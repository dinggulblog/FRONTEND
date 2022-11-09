<template>
  <div class="editor">
    <div class="wrap_select_toggle">
      <div class="select">
        <div class="main">
          <select v-model="main" required @change="onResetMenu">
            <option selected disabled hidden value="">main menu</option>
            <option v-for="mainmenu in mainMenus" :key="mainmenu" :value="mainmenu">{{ mainmenu }}</option>
          </select>
        </div>

        <div class="sub">
          <select v-model="sub" required :disabled="!main">
            <option selected disabled hidden value="">sub menu</option>
            <option v-for="submenu in subMenus" :key="submenu" :value="submenu">{{ submenu }}</option>
          </select>
        </div>

        <div class="category">
          <select v-model="category" :disabled="!sub">
            <option selected disabled hidden value="">category</option>
            <option v-for="ctg in categories" :key="ctg" :value="ctg">{{ ctg }}</option>
          </select>
        </div>
      </div>

      <div class="toggle">
        <span :style="[isPublic ? { color: '#BABABA' } : { color: 'var(--secondary)' }]">{{ isPublic ? '공개' : '비밀' }}</span>
        <i class="material-icons" :style="isPublic ? { color: '#E6E6E6' } : { color: 'var(--secondary)' }" @click="onTogglePublic">{{ isPublic ? 'toggle_off' : 'toggle_on' }}</i>
      </div>
    </div>

    <div class="wrap_title_file-add-btn">
      <div class="title">
        <input type="text" v-model="title" placeholder="제목을 입력하세요." onfocus="this.placeholder=''" onblur="this.placeholder='제목을 입력하세요.'" />
      </div>
      <div class="file_add_btn">
        <label for="upload_input" class="upload_label">사진 불러오기</label>
        <input type="file" id="upload_input" @change="onFileUpload" multiple />
      </div>
    </div>

    <div class="content">
      <textarea v-model="content" placeholder="당신의 이야기를 적어보세요..." ref="contentEl" id="contentEl"></textarea>
      <markdown class="markdown" :source="content" :plugins="plugins" :breaks="true" :xhtmlOut="true" :typographer="true" />
    </div>

    <div class="files" v-if="files?.length">
      <ul>
        <li v-for="(flie, index) in files" :key="flie.serverFileName">
          <div class="wrap_thumbnail">
            <img src="https://news.nateimg.co.kr/orgImg/cc/2021/07/23/4159_10727_3352.png" :class="fileState.fileIndex === index ? 'selected_thumbnail' : ''" @click="onSelectFile(flie, index)" />
            <!--
          <img :src="`${fileState.fileUrl}${flie.serverFileName}`" :class="fileState.fileIndex === index ? 'selectedThumbnail' : ''" @click="onSelectFile(flie, index)" />
          -->
            <button class="file_del_btn" @click="onDeleteFile(flie, index)"><i class="material-symbols-outlined"> do_not_disturb_on </i></button>
          </div>
          <p class="file_name">{{ flie.serverFileName }}</p>
        </li>
      </ul>
    </div>

    <div class="wrap_btns">
      <div class="wrap_left">
        <button @click="onAddFile" v-show="files?.length" class="file_insert_btn">사진 첨부</button>
        <button @click="onClearFile" v-show="files?.length" class="file_clear_btn">사진 모두 제거</button>
      </div>
      <div class="wrap_right">
        <div class="wrap_isLoading">
          <Transition name="isLoading">
            <span class="isLoading" v-if="isLoading"> <i class="material-symbols-outlined">hourglass_empty</i>자동 저장중..</span>
          </Transition>
        </div>
        <button class="submit_btn" @click="onPostUpload">글 등록</button>
      </div>
    </div>
  </div>
  <Dialog ref="Dialog"></Dialog>
</template>

<script>
import { defineComponent, ref, reactive, computed, watch, watchEffect, onBeforeMount, onMounted, onUnmounted } from 'vue'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import { useStore } from 'vuex'
import Markdown from 'vue3-markdown-it'
import MarkdownEmoji from 'markdown-it-emoji'
import Dialog from '../../components/Dialog.vue'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import 'highlight.js/styles/atom-one-dark.css'

export default defineComponent({
  name: 'editor',
  components: {
    Dialog,
    Markdown,
  },
  setup() {
    const route = useRoute()
    const { state, commit, dispatch } = useStore()

    const Dialog = ref(null)
    const contentEl = ref(null)
    const plugins = ref([{ plugin: MarkdownEmoji }])

    let canLeavePage = true
    let stopDraftUpdate = false
    const isLoading = computed(() => state.loading.isLoading)
    const draft = computed(() => state.draft.draft)

    const mainMenus = computed(() => Object.keys(state.menu.groupedMenus))
    const subMenus = computed(() => state.menu.groupedMenus[main.value]?.map((menu) => menu.sub))
    const menus = computed(() => state.menu.currentMenus)
    const categories = computed(() => state.menu.currentCategories)
    const main = ref('')
    const sub = ref('')
    const category = ref('')
    const title = ref('')
    const content = ref('')
    const isPublic = ref(true)
    const files = ref([])
    const fileState = reactive({
      fileId: '',
      fileName: '',
      fileUrl: 'http://localhost:3000/uploads/',
      fileIndex: 0,
    })

    const draftUpload = async () => {
      console.log('자동 저장 시작!')
      const payload = {
        menu: menus.value?.shift()?._id,
        title: title.value,
        content: content.value,
        category: category.value,
        isPublic: isPublic.value,
        thumbnail: files.value.length ? fileState.fileId : null,
      }

      if (draft.value?._id) {
        await dispatch('draft/updateDraft', { draftId: draft.value._id, payload })
      }
    }

    const onPostUpload = async () => {
      if (!main.value || !sub.value) {
        return alert('게시글을 삽입할 메뉴를 선택해야 합니다.')
      }
      toggleCanLeavePage(true)
      const postId = state.post.post._id
      const payload = {
        menu: menus.value?.shift()._id,
        title: title.value,
        content: content.value,
        category: category.value,
        isPublic: isPublic.value,
        images: files.value?.map((file) => file._id) ?? null,
        thumbnail: files.value.length ? fileState.fileId : null,
      }

      route.params.id && postId ? await dispatch('post/updatePost', { postId, payload }) : await dispatch('post/createPost', payload)
    }

    const onFileUpload = async (event) => {
      const formData = new FormData()
      const targetFiles = Object.values(event.target.files)
      targetFiles.forEach((file) => formData.append('images', file))

      const response = await dispatch('draft/updateDraft', { draftId: draft.value._id, payload: formData })
      if (response.success) {
        files.value = draft.value.images
        onSelectFile([...draft.value.images].shift(), 0)
      }
    }

    const onDeleteFile = async (file) => {
      await dispatch('draft/deleteFile', { draftId: draft.value._id, imageId: file._id })
    }

    const onAddFile = () => {
      let textarea = contentEl.value
      let start = textarea.value.substring(0, textarea.selectionStart)
      let end = textarea.value.substring(textarea.selectionEnd, textarea.value.length)

      const addText = `!` + `[` + `${fileState.fileName}` + `]` + `(` + `${fileState.fileUrl}` + `)\n`
      content.value = start + addText + end
      textarea.focus()
    }

    const onSelectFile = (file, index) => {
      fileState.fileId = file._id
      fileState.fileName = file.serverFileName
      fileState.fileUrl = fileState.fileUrl + fileState.fileName
      fileState.fileIndex = index
    }

    const onClearFile = () => {
      files.value = []
    }

    const onTogglePublic = () => {
      isPublic.value = !isPublic.value
    }

    const onResetMenu = () => {
      sub.value = ''
      category.value = ''
    }

    const toggleCanLeavePage = (bool) => {
      canLeavePage = bool
    }

    const unloadEvent = (event) => {
      if (!canLeavePage) {
        event.preventDefault()
        event.returnValue = ''
      }
    }

    const startAutoUpdate = () => {
      stopDraftUpdate = setInterval(draftUpload, 10000)
    }

    watch([title, content], () => toggleCanLeavePage(false), { flush: 'post' })

    watchEffect(() => {
      commit('menu/SET_CURRENT_MENUS', { main: main.value, sub: sub.value })
      commit('menu/SET_CURRENT_CATEGORIES', menus.value)
    })

    onBeforeMount(async () => {
      const setInitData = (post) => {
        const menu = state.menu.menus.find((menu) => menu._id === post.menu)
        const images = [...post.images]
        main.value = menu?.main
        sub.value = menu?.sub
        title.value = post?.title
        content.value = post?.content
        isPublic.value = post?.isPublic
        if (images.length) {
          files.value = images
          onSelectFile(images.shift(), 0)
        }
      }

      if (route.params.id) {
        if (!state.post.post?._id) await dispatch('post/getPost', route.params.id)
        setInitData(state.post.post)
      } else {
        await dispatch('draft/getDraft')
        if (draft.value?._id) {
          const ok = await Dialog.value.show({ title: '작성 중인 글이 있습니다.', message: '이어서 작성하시겠습니까?', okButton: '불러오기', cancelButton: '새로 작성하기' })
          ok ? setInitData(draft.value) : await dispatch('draft/createDraft')
        } else {
          await dispatch('draft/createDraft')
        }
      }
    })

    onMounted(() => {
      window.addEventListener('beforeunload', unloadEvent)
      if (!route.params.id) startAutoUpdate()
    })

    onUnmounted(async () => {
      window.removeEventListener('beforeunload', unloadEvent)
      clearInterval(stopDraftUpdate)
      commit('draft/SET_DRAFT', {})
    })

    onBeforeRouteLeave(async (to, from, next) => {
      if (canLeavePage) next()
      else {
        const ok = await Dialog.value.show({ title: '현재 페이지에서 나가시겠습니까?', message: '작성된 내용은 떠나갈것입니다...' })
        ok ? next() : next(false)
      }
    })

    return {
      Dialog,
      contentEl,
      plugins,
      menus,
      mainMenus,
      subMenus,
      categories,
      main,
      sub,
      category,
      title,
      content,
      isPublic,
      files,
      fileState,
      isLoading,
      onPostUpload,
      onFileUpload,
      onAddFile,
      onClearFile,
      onDeleteFile,
      onSelectFile,
      onTogglePublic,
      onResetMenu,
    }
  },
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.editor {
  .wrap_select_toggle {
    display: flex;
    flex-direction: row;
    align-items: center;

    .select {
      display: flex;
      flex-direction: row;
      width: 90%;

      div {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #ddd;
        width: 27rem;
        border-radius: 3.2rem;
        font-size: 1.4rem;
        margin-right: 2.4rem;

        select {
          width: calc(27rem - 4.8rem);
          font-size: 1.4rem;
          color: var(--text-light);
          height: 4.8rem;
          background-color: transparent;
          font-family: 'Roboto', 'Noto Sans KR', sans-serif;
          text-transform: uppercase;
        }

        &:last-child select > option {
          text-transform: none;
        }
      }
    }

    .toggle {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 10%;
      cursor: pointer;
      user-select: none;

      i {
        font-size: 4.8rem;
      }

      span {
        font-size: 1.2rem;
        margin: 0 0.4rem 0 0;
        letter-spacing: 0.1rem;
      }
    }
  }

  .wrap_title_file-add-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 1px solid #ddd;
    margin: 2.4rem 0 1.6rem;
    border-radius: 3.2rem;
    width: 100%;
    height: 4.8rem;
    padding: 0 2.4rem;

    .title {
      width: 85%;
      input {
        color: var(--text-light);
        font-size: 1.4rem;
        width: 100%;
      }

      input::placeholder {
        color: var(--text-light);
        font-size: 1.4rem;
      }
    }

    .file_add_btn {
      width: 15%;
      display: flex;
      justify-content: flex-end;

      label.upload_label {
        font-size: 1.2rem;
        line-height: 1.8rem;
        cursor: pointer;
        text-transform: uppercase;
        letter-spacing: 0.1rem;
        color: var(--text-light);
        position: relative;
        padding: 0 0 0 3.2rem;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          width: 0.01rem;
          height: 1.6rem;
          background-color: var(--border-dark);
        }
      }

      input#upload_input {
        display: none;
      }
    }
  }

  .content {
    display: flex;
    flex-direction: row;

    textarea,
    .markdown {
      width: 50%;
      min-height: 48rem;
      border-radius: 3.2rem;
      border: 1px solid #ddd;
      padding: 2.4rem;
      font-size: 1.4rem;
      color: var(--text-light);
    }

    textarea {
      margin: 0 2.4rem 0 0;
      resize: vertical;
    }

    textarea::placeholder {
      color: var(--text-light);
      font-size: 1.4rem;
    }
  }

  .files {
    ul {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      margin: calc(3.2rem - 1.2rem) 0 0;

      li {
        width: 7.4rem;
        height: calc(7.4rem + 1.6rem);
        margin: 1.2rem 2.4rem 0 0;

        &:nth-child(12n + 0) {
          margin: 1.2rem 0;
        }

        .wrap_thumbnail {
          position: relative;
          img {
            width: 100%;
            height: 7.4rem;
            border-radius: 2.4rem;
            border: 2px solid #d9d9d9;
            object-fit: cover;
            padding: 0.2rem;

            &.selected_thumbnail {
              border: 2px solid var(--primary-dark);
            }
          }
          .file_del_btn {
            position: absolute;
            bottom: -0.6rem;
            right: -0.6rem;
            color: var(--secondary-dark);

            i {
              font-size: 2.2rem;
            }

            .material-symbols-outlined {
              font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48;
            }
          }
        }

        .file_name {
          width: 7.4rem;
          height: 1.6rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
          margin: 0.8rem 0 0;
          font-size: 1.2rem;
          color: var(--text-light);
        }
      }
    }
  }

  .wrap_btns {
    display: flex;
    flex-direction: row;
    margin: 4.8rem 0 0;

    .wrap_left {
      width: 50%;

      .file_insert_btn,
      .file_clear_btn {
        border: 2px solid var(--primary-dark);
        color: var(--primary-dark);
        border-radius: 3.2rem;
        padding: 1.2rem 2.4rem;
        font-size: 1.3rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.1rem;
      }

      .file_clear_btn {
        margin: 0 0 0 1.2rem;
      }
    }

    .wrap_right {
      width: 50%;
      display: flex;
      justify-content: flex-end;

      .wrap_isLoading {
        margin: 0 2.4rem 0 0;

        .isLoading-enter-active,
        .isLoading-leave-active {
          transition: opacity 2s ease;
        }

        .isLoading-enter-from,
        .isLoading-leave-to {
          opacity: 0;
        }
      }

      .submit_btn {
        display: flex;
        justify-content: center;
        align-items: center;
        background: var(--primary-dark);
        color: #fff;
        border-radius: 3.2rem;
        padding: 1.2rem 2.4rem;
        font-size: 1.3rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.1rem;
      }
    }
  }
}
</style>
