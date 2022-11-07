<template>
  <div class="editor">

    <!-- Menu toolbar -->
    <div class="toolbar">
      <div class="menu">
        <select v-model="main" required @change="onResetMenu">
          <option selected disabled hidden value="">Main Menu</option>
          <option v-for="mainmenu in mainMenus" :key="mainmenu" :value="mainmenu">{{ mainmenu }}</option>
        </select>
      </div>

      <div class="subject">
        <select v-model="sub" required :disabled="!main">
          <option selected disabled hidden value="">Sub Menu</option>
          <option v-for="submenu in subMenus" :key="submenu" :value="submenu">{{ submenu }}</option>
        </select>
      </div>

      <div class="category">
        <select v-model="category" :disabled="!sub">
          <option selected disabled hidden value="">Category</option>
          <option v-for="ctg in categories" :key="ctg" :value="ctg">{{ ctg }}</option>
        </select>
      </div>

      <div class="toggle">
        <button 
          class="material-icons"
          :style="isPublic ? { color: '#E6E6E6' } : { color: 'var(--point)' }"
          @click="onTogglePublic"
        >{{ isPublic ? 'toggle_off' : 'toggle_on' }}</button>
        <span :style="[isPublic ? { color: '#BABABA' } : { color: 'var(--point)' }]">{{ isPublic ? 'Public' : 'Secret' }}</span>
      </div>
    </div>

    <!-- Post body -->
    <div class="title">
      <input type="text" v-model="title" placeholder="제목을 입력하세요." onfocus="this.placeholder=''" onblur="this.placeholder='제목을 입력하세요.'" />
    </div>

    <div class="content">
      <textarea v-model="content" placeholder="당신의 이야기를 적어보세요..." ref="contentEl" id="contentEl"></textarea>
      <markdown class="markdown" :source="content" :plugins="plugins" :breaks="true" :xhtmlOut="true" :typographer="true" />
      <!--<QuillEditor theme="snow" contentType="html" v-model:content="content" :toolbar="options.toolbarOptions" />-->
    </div>

    <div class="submit-btns">
      <Transition name="isLoading">
        <span v-if="isLoading"> <i class="material-symbols-outlined">hourglass_empty</i>Auto save..</span>
      </Transition>
      <button class="submit" @click="onPostUpload">Submit</button>
    </div>

    <!-- File template -->
    <div class="files" v-if="files?.length">
      <ul style="display: flex; list-style: none">
        <li v-for="(flie, index) in files" :key="flie.serverFileName" style="margin-right: 2rem; position: relative">
          <img :src="`${fileState.fileUrl}${flie.serverFileName}`" style="width: 10rem; height: 10rem; border-radius: 20%" :class="fileState.fileIndex === index ? 'selectedThumbnail' : ''" @click="onSelectFile(flie, index)" />
          <p style="font-size: 1.2rem; margin-top: 2rem; width: 10rem; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; word-wrap: break-word; letter-spacing: normal">{{ flie.serverFileName }}</p>
          <span style="position: absolute; right: -1rem; bottom: 2rem; color: var(--point); cursor: pointer; border-radius: 50%; background: #fff" @click="onDeleteFile(flie, index)"><i class="material-symbols-outlined" style="margin: 0"> do_not_disturb_on </i></span>
        </li>
      </ul>
    </div>

    <div class="files-btns">
      <label for="input-file" class="input-file-btn">Upload</label>
      <input type="file" id="input-file" @change="onFileUpload" multiple />
      <button @click="onAddFile" class="input-file-btn" :style="[files?.length ? { background: 'var(--point)' } : { background: 'var(--sub)', cursor: 'Default' }]">Insert</button>
    </div>

  </div>
  <Dialog ref="Dialog"></Dialog>
</template>

<script>
import { defineComponent, ref, reactive, computed, watch, watchEffect, onBeforeMount, onMounted, onUnmounted } from 'vue'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import { useStore } from 'vuex'
import { QuillEditor } from '@vueup/vue-quill'
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
    const options = {
      toolbarOptions: [['bold', 'italic', 'underline', 'strike'], [{ size: ['small', false, 'large', 'huge'] }], [{ color: [] }, { background: [] }], ['link', 'image'], ['clean']],
    }

    let canLeavePage = true
    let stopDraftUpdate = false
    const isLoading = computed(() => state.loading.isLoading)
    const draft = computed(() => state.draft.draft)
    
    const mainMenus = computed(() => Object.keys(state.menu.groupedMenus))
    const subMenus = computed(() => state.menu.groupedMenus[main.value]?.map(menu => menu.sub))
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
      fileIndex: 0
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

    watch(
      [title, content],
      () => toggleCanLeavePage(false),
      { flush: 'post' }
    )

    watchEffect(
      () => {
        commit('menu/SET_CURRENT_MENUS', { main: main.value, sub: sub.value })
        commit('menu/SET_CURRENT_CATEGORIES')
      }
    )

    onBeforeMount(async () => {
      const setInitData = (post) => {
        const menu = state.menu.menus.find(menu => menu._id === post.menu)
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
      } 
      else {
        await dispatch('draft/getDraft')
        if (draft.value?._id) {
          const ok = await Dialog.value.show({ title: '작성 중인 글이 있습니다.', message: '이어서 작성하시겠습니까?', okButton: '불러오기', cancelButton: '새로 작성하기' })
          ok ? setInitData(draft.value) : await dispatch('draft/createDraft')
        }
        else {
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
      options,
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
      onDeleteFile,
      onSelectFile,
      onTogglePublic,
      onResetMenu
    }
  },
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.editor {
  display: grid;
  grid-template-rows: repeat(5, auto);
  gap: 2.4rem 0;

  input,
  select {
    background: var(--formBg);
    border: 0;
    padding: 0 2.4rem;
    color: var(--primary);
    font-size: 1.4rem;

    &::placeholder {
      color: var(--primary);
    }
  }

  .toolbar {
    grid-row: 1 / 2;
    display: grid;
    grid-template-columns: auto auto 1fr;

    select {
      width: 16rem;
      height: 4.8rem;
      color: var(--point);

      option {
        color: var(--primary);
      }
    }

    div:nth-child(1) {
      grid-column: 1 / 2;
    }

    div:nth-child(2) {
      grid-column: 2 / 3;
      margin: 0 2.4rem;
    }

    div:nth-child(3) {
      grid-column: 3 / 4;
    }

    div:nth-child(4) {
      display: grid;
      grid-column: 4 / 5;
      grid-template-columns: repeat(2, auto);
      justify-content: end;
      align-items: center;

      button {
        grid-column: 1 / 2;
        font-size: 4.8rem;
        transition: all 300ms linear;
      }

      span {
        grid-column: 2 / 3;
        font-size: 1.2rem;
        font-weight: 500;
        margin-left: 0.8rem;
      }
    }
  }

  .title {
    grid-row: 2 / 3;

    input {
      width: 100%;
      height: 4.8rem;
    }
  }

  .content {
    grid-row: 3 / 4;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 2rem;
    line-height: 1.5;
    font-size: 1.6rem;
    color: var(--primary);

    textarea {
      padding: 2.4rem;
      min-height: 40rem;
      background: var(--formBg);
      border: 0;
      color: var(--primary);
      font-size: 1.6rem;
      line-height: 1.5;
      resize: vertical;
    }

    textarea::placeholder {
      font-style: italic;
    }

    .markdown {
      background: var(--formBg);
      padding: 2.4rem;
    }
  }

  /*
  .tags {
    grid-row: 4 / 5;
    z-index: 1;

    input {
      width: 100%;
      height: 4.8rem;
    }

    ul {
      display: inline-grid;
      margin-bottom: 2.4rem;
      li {
        display: grid;
        grid-template-columns: auto auto;
        align-items: center;
        margin-right: 0.8rem;
        padding: 0.4rem 1.2rem;
        border: 1px solid #dadada;
        color: var(--point);
        font-size: 1.2rem;
        border-radius: 2.8rem;

        span {
          margin: 0 0.8rem 0 0;
        }

        i {
          font-size: 0.8rem;
          margin: 0;
        }
      }
    }
  }
*/
  .submit-btns {
    grid-row: 4 / 5;
    justify-self: end;
    display: grid;
    grid-template-columns: auto auto;
    justify-content: end;

    .isLoading-enter-active,
    .isLoading-leave-active {
      transition: opacity 0.8s ease;
    }

    .isLoading-enter-from,
    .isLoading-leave-to {
      opacity: 0;
    }

    span {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      color: var(--primary);
      margin-right: 2rem;

      i {
        margin: 0;
      }
    }

    button.submit {
      width: 10.8rem;
      height: 4rem;
      background: var(--point);
      color: #fff;
      font-weight: 500;
      font-size: 1.2rem;
      border-radius: 2rem;
    }
  }

  .selectedThumbnail {
    border: 2px solid var(--point);
  }

  .files-btns {
    display: flex;
    align-items: center;

    #input-file {
      display: none;
    }

    .input-file-btn {
      display: inherit;
      justify-content: center;
      align-items: center;
      width: 10.8rem;
      height: 4rem;
      background: var(--point);
      color: #fff;
      font-weight: 500;
      font-size: 1.2rem;
      margin-right: 2rem;
      cursor: pointer;
    }
  }
}
</style>
