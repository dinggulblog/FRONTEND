<template>
  <div class="editor">
    <!-- Menu toolbar -->
    <div class="toolbar">
      <div class="menu">
        <select v-model="states.title" required>
          <option selected disabled hidden value="">Menu</option>
          <option v-for="title in getters['menu/getTitles']" :key="title" :value="title">{{ title }}</option>
        </select>
      </div>

      <div class="subject">
        <select v-model="states.subject" required>
          <option selected disabled hidden value="">Subject</option>
          <option v-for="subject in getters['menu/getSubjects'](states.title)" :key="subject" :value="subject">{{ subject }}</option>
        </select>
      </div>

      <div class="category">
        <select v-model="states.category">
          <option selected disabled hidden value="">Category</option>
          <option v-for="category in getters['menu/getCategories']({ title: states.title, subject: states.subject })" :key="category" :value="category">{{ category }}</option>
        </select>
      </div>

      <div class="toggle">
        <button class="material-icons" :style="[states.isPublic ? { color: '#E6E6E6' } : { color: 'var(--point)' }]" @click="togglePublic()">{{ states.isPublic ? 'toggle_off' : 'toggle_on' }}</button>
        <span :style="[states.isPublic ? { color: '#BABABA' } : { color: 'var(--point)' }]">{{ states.isPublic ? 'Public' : 'Secret' }}</span>
      </div>
    </div>

    <!-- Post body -->
    <div class="title">
      <input type="text" v-model="title" placeholder="제목을 입력하세요." onfocus="this.placeholder=''" onblur="this.placeholder='제목을 입력하세요.'" />
    </div>

    <div class="content">
      <textarea v-model="content" placeholder="당신의 이야기를 적어보세요..." ref="contentEl" id="contentEl"> </textarea>
      <markdown class="markdown" :source="content" :plugins="plugins" :breaks="true" :xhtmlOut="true" :typographer="true" />
      <!--<QuillEditor theme="snow" contentType="html" v-model:content="content" :toolbar="options.toolbarOptions" />-->
    </div>

    <div class="submit-btns">
      <Transition name="draftState">
        <span v-if="draftState === true"> <i class="material-symbols-outlined">hourglass_empty</i>Auto save..</span>
      </Transition>
      <button class="submit" @click="onSubmit()">Submit</button>
    </div>

    <div class="files" v-if="files?.length">
      <ul style="display: flex; list-style: none">
        <li v-for="(flie, index) in files" :key="flie.index" style="margin-right: 2rem; position: relative">
          <img :src="`https://dinggul.me/` + `${flie.serverFileName}`" style="width: 10rem; height: 10rem; border-radius: 20%" :class="fileStates.isActive === index ? 'selectedThumbnail' : ''" @click="onSelectImg(flie, index)" />
          <p style="font-size: 1.2rem; margin-top: 2rem; width: 10rem; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; word-wrap: break-word; letter-spacing: normal">{{ flie.serverFileName }}</p>
          <span style="position: absolute; right: -1rem; bottom: 2rem; color: var(--point); cursor: pointer; border-radius: 50%; background: #fff" @click="onDeleteImg(flie, index)"><i class="material-symbols-outlined" style="margin: 0"> do_not_disturb_on </i></span>
        </li>
      </ul>
    </div>

    <div class="files-btns">
      <label for="input-file" class="input-file-btn">Upload</label>
      <input type="file" id="input-file" @change="fileUpload" multiple />

      <button @click="onAddFile()" class="input-file-btn" :style="[files?.length ? { background: 'var(--point)' } : { background: 'var(--sub)', cursor: 'Default' }]">Insert</button>
    </div>
  </div>
  <Dialog ref="Dialog"></Dialog>
</template>

<script>
import { defineComponent, ref, reactive, computed, watch, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { useStore } from 'vuex'
import { QuillEditor } from '@vueup/vue-quill'
import Markdown from 'vue3-markdown-it'
import MarkdownEmoji from 'markdown-it-emoji'
import Dialog from '../../components/Dialog.vue'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import 'highlight.js/styles/atom-one-dark.css'
import { file } from '@babel/types'
import store from '../../store'

export default defineComponent({
  name: 'editor',
  components: {
    Dialog,
    Markdown,
  },
  setup(props, { emit }) {
    const { push, currentRoute } = useRouter()
    const { state, getters, commit, dispatch } = useStore()
    const {
      value: { params },
    } = currentRoute

    const Dialog = ref(null)
    const plugins = ref([{ plugin: MarkdownEmoji }])
    const options = {
      toolbarOptions: [['bold', 'italic', 'underline', 'strike'], [{ size: ['small', false, 'large', 'huge'] }], [{ color: [] }, { background: [] }], ['link', 'image'], ['clean']],
    }

    const states = reactive({
      title: '',
      subject: '',
      category: '',
      isPublic: true,
      canLeavePage: true,
    })

    const title = ref('')
    const content = ref('')
    const contentEl = ref(null)

    const files = ref('')

    const fileStates = reactive({
      fileId: '',
      fileName: '',
      fileUrl: '',
      isActive: 0,
    })

    const draftState = ref(false)
    let draftUpdateStop = ''

    const fileUpload = async (event) => {
      const formData = new FormData()
      const targetFiles = Object.values(event.target.files)
      targetFiles.forEach((file) => formData.append('images', file))
      const response = await dispatch('draft/updateDraft', { id: state.draft.draft._id, payload: formData })
      if (response.success) {
        files.value = state.draft.draft.images
        fileStates.fileId = state.draft.draft.images[0]._id
        fileStates.fileName = state.draft.draft.images[0].serverFileName
        fileStates.fileUrl = `https://dinggul.me/uploads/` + `${state.draft.draft.images[0].serverFileName}`
      }
    }

    const onSelectImg = (file, index) => {
      fileStates.fileId = file._id
      fileStates.fileName = file.serverFileName
      fileStates.fileUrl = `https://dinggul.me/uploads/` + `${file.serverFileName}`
      fileStates.isActive = index
    }

    const onAddFile = () => {
      let textarea = contentEl.value
      let start = textarea.value.substring(0, textarea.selectionStart)
      let end = textarea.value.substring(textarea.selectionEnd, textarea.value.length)

      const addText = `!` + `[` + `${fileStates.fileName}` + `]` + `(` + `${fileStates.fileUrl}` + `)\n`
      content.value = start + addText + end
      textarea.focus()
    }

    const onDeleteImg = async (file) => {
      const response = await dispatch('draft/deleteFile', { draftId: state.draft.draft._id, imageId: file._id })
      if (!response.success) alert(response.message)
    }

    const draftAutoUpdate = async () => {
      console.log('자동 저장 시작!')
      const draft = {
        subject: states.title && states.subject ? getters['menu/getMenuId']({ title: states.title, subject: states.subject }) : undefined,
        category: states.category ? states.category : undefined,
        title: title.value,
        content: content.value,
        isPublic: states.isPublic,
      }
      draftState.value = true
      const response = await dispatch('draft/updateDraft', { id: state.draft.draft._id, payload: draft })
      setTimeout(() => (draftState.value = false), 5000)
      if (!response.success) alert(response.message)
    }

    const onSubmit = async () => {
      if (!states.title || !states.subject) {
        return alert('게시글을 삽입할 메뉴를 선택해야 합니다.')
      }

      toggleCanLeavePage(true)
      const post = {
        _id: state.post.post._id || undefined,
        subject: states.title && states.subject ? getters['menu/getMenuId']({ title: states.title, subject: states.subject }) : undefined,
        title: title.value,
        content: content.value,
        category: states.category ? states.category : undefined,
        images: files.value ? files.value.map((file) => file._id) : undefined,
        //thumbnail: files.value ? fileStates.fileId : undefined,
        isPublic: states.isPublic,
      }

      const response = params.id ? await dispatch('post/updatePost', post) : await dispatch('post/createPost', post)
      console.log('포스트', post)
      response.success ? push({ name: 'post', params: { title: states.title, subject: states.subject, id: response.data.post._id } }) : alert(response.message)
    }

    const togglePublic = () => {
      states.isPublic = !states.isPublic
    }

    const toggleCanLeavePage = (bool) => {
      states.canLeavePage = bool
      emit('toggle-can-leave-site', states.canLeavePage)
    }

    const unLoadEvent = (event) => {
      if (!states.canLeaveSite) {
        event.preventDefault()
        event.returnValue = ''
      }
    }

    watch(
      [title, content],
      () => {
        toggleCanLeavePage(false)
      },
      { flush: 'post' }
    )

    const draftUpdateSet = () => {
      draftUpdateStop = setInterval(draftAutoUpdate, 10000)
    }

    onBeforeMount(async () => {
      if (params.id) {
        if (state.post.post._id) {
          const menu = getters['menu/getMenu'](state.post.post.subject)
          states.title = menu.title
          states.subject = menu.subject
          title.value = state.post.post.title
          content.value = state.post.post.content
          states.category = state.post.post.category
          if (state.post.post.images?.length) {
            files.value = state.post.post.images
            fileStates.fileName = state.post.post.images[0].serverFileName
            fileStates.fileUrl = `https://dinggul.me/uploads/` + `${state.post.post.images[0].serverFileName}`
          }
          console.log(files.value)
        } else {
          const { data } = await dispatch('post/getPost', params.id)
          const menu = getters['menu/getMenu'](data.post.subject)
          states.title = menu.title
          states.subject = menu.subject
          title.value = data.post.title
          content.value = data.post.content
          states.category = data.post.category
          if (data.post.images?.length) {
            files.value = data.post.images
            fileStates.fileName = data.post.images[0].serverFileName
            fileStates.fileUrl = `https://dinggul.me/uploads/` + `${data.post.images[0].serverFileName}`
          }
        }
      } else {
        const response = await dispatch('draft/getDraft')
        if (response.success) {
          if (state.draft.draft !== null) {
            if (state.draft.draft._id) {
              const choiceLoad = await Dialog.value.show({ title: '작성 중인 글이 있습니다.', message: '이어서 작성하시겠습니까?', okButton: '불러오기', cancelButton: '새로 작성하기' })
              if (choiceLoad) {
                states.title = state.draft.draft.title ? state.draft.draft.title : ''
                states.subject = state.draft.draft.subject ? state.draft.draft.subject : ''
                title.value = state.draft.draft.title ? state.draft.draft.title : ''
                content.value = state.draft.draft.content ? state.draft.draft.content : ''
                states.category = state.draft.draft.category ? state.draft.draft.category : ''
                if (state.draft.draft.images.length) {
                  files.value = state.draft.draft.images
                  fileStates.fileName = state.draft.draft.images[0].serverFileName
                  fileStates.fileUrl = `https://dinggul.me/uploads/` + `${state.draft.draft.images[0].serverFileName}`
                }
                console.log('draft있어서 기존꺼 불러옴')
                console.log('드래프트 이미지는?', state.draft.draft.images)
              } else {
                await dispatch('draft/createDraft')
                console.log('draft있지만 원치않아서 새로 생성')
              }
            }
          } else {
            await dispatch('draft/createDraft')
            console.log('draft없어서 새로 생성')
          }
        }
      }
    })

    onMounted(() => {
      window.addEventListener('beforeunload', unLoadEvent)
      if (!params.id) draftUpdateSet()
    })

    onBeforeUnmount(async () => {
      clearInterval(draftUpdateStop)
      console.log('stop!')
    })

    onUnmounted(async () => {
      window.removeEventListener('beforeunload', unLoadEvent)
      commit('draft/SET_DRAFT', {})
    })

    onBeforeRouteLeave(async (to, from, next) => {
      if (states.canLeavePage) {
        next()
      } else {
        const ok = await Dialog.value.show({ title: '현재 페이지에서 나가시겠습니까?', message: '작성된 내용은 떠나갈것입니다...' })
        ok ? next() : next(false)
      }
    })

    /*
    const addTag = (event) => {
      if (event.code === 'Comma') {
        store.commit('post/UPDATE_POST_TAGS', event.target.value)
        tag.value = ''
        event.target.value = ''
      }
    }

    const delTag = (index) => {
      store.commit('post/REMOVE_POST_TAG', index)
    }
    */

    return { getters, Dialog, plugins, options, states, title, content, contentEl, files, fileStates, draftState, fileUpload, onSelectImg, onAddFile, onDeleteImg, onSubmit, togglePublic }
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

    .draftState-enter-active,
    .draftState-leave-active {
      transition: opacity 0.8s ease;
    }

    .draftState-enter-from,
    .draftState-leave-to {
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
