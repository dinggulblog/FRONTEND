<template>
  <div class="editor">
    <div class="wrap_select_toggle">
      <div class="select">
        <!-- Main menu select box -->
        <div class="main">
          <select required @change="onChangeMainMenu">
            <option selected disabled hidden value="">main menu</option>
            <option v-for="main in Object.keys(menuState.menus)" :key="main" :value="main">{{ main }}</option>
          </select>
        </div>

        <!-- Sub menu select box -->
        <div class="sub">
          <select required :disabled="!menuState.mainMenus.length" @change="onChangeSubMenu">
            <option selected disabled hidden value="">sub menu</option>
            <option v-for="menu in menuState.mainMenus" :key="menu?._id" :value="menu?.sub">{{ menu?.sub }}</option>
          </select>
        </div>

        <!-- Category select box -->
        <div class="category">
          <select :disabled="!menuState.subMenu.categories" @change="onChangeCategory">
            <option selected disabled hidden value="">category</option>
            <option v-for="category in menuState.subMenu.categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
      </div>

      <!-- Public scope toggle button -->
      <div class="wrap_toggle">
        <Toggle :isActive="postState.isPublic" @update="onChangeIsPublic" />
      </div>
    </div>

    <!-- Title and File button -->
    <div class="wrap_title_file-add-btn">
      <div class="title">
        <input
          type="text"
          v-model="postState.title"
          placeholder="제목을 입력하세요."
          onfocus="this.placeholder=''"
          onblur="this.placeholder='제목을 입력하세요.'"
        />
      </div>
    </div>

    <!-- Content -->
    <div class="content">
      <textarea
        ref="CONTENT_EL"
        v-model="postState.content"
        placeholder="당신의 이야기를 적어보세요..."
        @keydown="onChangeCanLeavePage(false)"
      />
      <markdown
        class="markdown"
        :source="postState.content"
        :plugins="plugins"
        :breaks="true"
        :xhtmlOut="true"
        :typographer="true"
      />
    </div>

    <div class="wrap_image_btns">
      <div class="images_add_btn">
        <label for="upload_input" class="upload_label">
          <Ico :svg="'add-image'" class="ico_add-image" />사진 추가
        </label>
        <input
          ref="UPLOAD_INPUT_EL"
          type="file"
          id="upload_input"
          @change="onUploadImages"
          @click="$refs.UPLOAD_INPUT_EL.value = ''"
          multiple
        />
      </div>
      <!--
        <Button
          v-show="fileState.files.length"
          class="btn_image_clear"
          svg="add-image"
          :content="'사진 모두 제거'"
          :size="'md'"
          :disabled="menuState.isLoading"
          @click="onClearImages"
        ></Button>
        -->
    </div>

    <!-- Images -->
    <div class="images" v-if="fileState.files.length">
      <ul>
        <li v-for="(file, index) in fileState.files" :key="file.serverFileName">
          <div class="wrap_thumbnail">
            <img
              :src="`${IMAGE_URL}${file.serverFileName}`"
              :class="fileState.fileIndex === index ? 'selected_thumbnail' : ''"
              @click="onSelectImage(file, index), onInsertImage(file.thumbnail)"
            />
            <Button class="image_del_btn" @click="onDeleteImage(file, index)" :svg="'del-image'" :theme="'primary'" />
          </div>
        </li>
      </ul>
    </div>

    <div class="wrap_btns">
      <!-- Buttons -->
      <Button
        class="btn_submit"
        :content="'글 등록'"
        :shape="isMobile ? 'fill-round-full' : 'fill-round'"
        :theme="'primary'"
        :disabled="menuState.isLoading"
        @click="onChangeCanLeavePage(true), onUpdatePost()"
      />
    </div>
  </div>
</template>

<script setup>
  import { inject, ref, reactive, computed, nextTick, watch, onBeforeMount, onMounted, onUnmounted } from 'vue'
  import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
  import { useStore } from 'vuex'
  import { useMedia } from '../../common/mediaQuery'
  import Markdown from 'vue3-markdown-it'
  import MarkdownEmoji from 'markdown-it-emoji'
  import Toggle from '../../components/ui/Toggle.vue'
  import 'highlight.js/styles/atom-one-dark.css'

  const route = useRoute()
  const { go, push } = useRouter()
  const { state, dispatch } = useStore()

  const DIALOG_EL = inject('DIALOG_EL')
  const TOAST_EL = inject('TOAST_EL')
  const CONTENT_EL = ref(null)

  let autoSave = null
  let canLeavePage = true
  const isMobile = useMedia('only screen and (max-width: 767px)')

  const plugins = ref([{ plugin: MarkdownEmoji }])
  const IMAGE_URL = ref(process.env.VUE_APP_IMAGE_URL)

  const temp = ref(false)
  const postId = ref(null)
  const draftId = ref(null)
  const authorId = ref(null)

  const menuState = reactive({
    isLoading: computed(() => state.loading.isLoading),
    percentage: computed(() => state.loading.percentage),
    menus: computed(() => state.menu.menus),
    mainMenus: [],
    subMenu: {},
  })

  const postState = reactive({
    menu: '',
    title: '',
    content: '',
    category: '기타',
    isPublic: true,
    images: computed(() => fileState.files.map(({ _id }) => _id)),
    thumbnail: computed(() => fileState.fileId),
  })

  const fileState = reactive({
    files: [],
    fileId: '',
    fileUrl: '',
    fileIndex: 0,
  })

  const onChangeMainMenu = (event) => {
    menuState.mainMenus = menuState.menus[event.target.value]
    document.body.querySelector('div.sub select').selectedIndex = 0
    document.body.querySelector('div.category select').selectedIndex = 0
  }

  const onChangeSubMenu = (event) => {
    menuState.subMenu = menuState.mainMenus.find((menu) => menu.sub === event.target.value)
    postState.menu = menuState.subMenu?._id
    document.body.querySelector('div.category select').selectedIndex = 0
  }

  const onChangeCategory = (event) => {
    postState.category = event.target.value
  }

  const onChangeIsPublic = (state) => {
    postState.isPublic = Boolean(state)
  }

  const onUpdateDraft = async (formData = new FormData()) => {
    if (!postState.menu) return TOAST_EL.value.open('error', '게시글을 삽입할 메뉴를 선택해야 합니다.')

    const { ...payload } = postState
    Object.keys(payload).forEach((key) => formData.append(key, payload[key]))

    const { success, draft, images } = draftId.value
      ? await dispatch('draft/updateDraft', { draftId: draftId.value, payload: formData })
      : await dispatch('draft/createDraft', formData)

    success
      ? TOAST_EL.value.open('success', '임시저장 되었습니다.')
      : TOAST_EL.value.open('error', '임시저장에 실패하였습니다')

    draftId.value = draft?._id

    return { success, images }
  }

  const onUpdatePost = async () => {
    if (!postState.menu) return TOAST_EL.value.open('error', '게시글을 삽입할 메뉴를 선택해야 합니다.')

    const { ...payload } = postState
    const { success, post, error } = postId.value
      ? await dispatch('post/updatePost', { postId: postId.value, authorId: authorId.value, payload })
      : await dispatch('post/createPost', payload)

    if (!success) return TOAST_EL.value.open('error', error)

    if (canLeavePage) push({ name: 'post', params: { postId: post._id } })
  }

  const onUploadImages = async (event) => {
    if (!event.target.files.length) return
    if (!postState.menu) return TOAST_EL.value.open('error', '게시글을 삽입할 메뉴를 선택해야 합니다.')

    for (const { name } of event.target.files) {
      if (String(name).split('.')[0].length > 32) {
        return TOAST_EL.value.open('error', '파일명은 32자 이하만 가능합니다.')
      }
    }

    const formData = new FormData()
    Object.values(event.target.files).forEach((file) => formData.append('images', file))

    const { success, images, error } = postId.value
      ? await dispatch('post/updatePost', { postId: postId.value, authorId: authorId.value, payload: formData })
      : await onUpdateDraft(formData)

    if (!success) return TOAST_EL.value.open('error', error)

    if (Array.isArray(images)) {
      fileState.files.push(...images)
      onSelectImage(fileState.files[0], 0)
      for await (const { thumbnail } of images) {
        await nextTick()
        onInsertImage(thumbnail)
      }
    }
  }

  const onDeleteImage = async (file, index) => {
    if (!file?._id) return

    const { success, error } = postId.value
      ? await dispatch('post/deleteFile', { postId: postId.value, imageId: file._id })
      : await dispatch('draft/deleteFile', { draftId: draftId.value, imageId: file._id })

    if (!success) return TOAST_EL.value.open('error', error)

    fileState.files.splice(index, 1)
  }

  const onSelectImage = (file, index) => {
    if (!file) return TOAST_EL.value.open('error', '파일이 선택되지 않았습니다.')
    fileState.fileId = file._id
    fileState.fileUrl = file.thumbnail
    fileState.fileIndex = index
  }

  const onInsertImage = (url) => {
    let start = CONTENT_EL.value.value.substring(0, CONTENT_EL.value.selectionStart)
    let end = CONTENT_EL.value.value.substring(CONTENT_EL.value.selectionEnd, CONTENT_EL.value.value.length)

    const innerText = `\n!` + `[` + `]` + `(` + `${url}` + `)\n`
    postState.content = start + innerText + end
    CONTENT_EL.value.focus()
  }

  /*
      const onClearImages = () => {
        fileState.files = []
      }
  */

  const onChangeCanLeavePage = (bool) => {
    canLeavePage = bool
  }

  const unloadEvent = (event) => {
    if (!canLeavePage) {
      event.preventDefault()
      event.returnValue = ''
    }
  }

  const setInitData = (post = {}, temp = false) => {
    const { _id, author, menu, category, title, content, isPublic, images, thumbnail } = post

    if (temp) draftId.value = _id
    else postId.value = _id

    authorId.value = author._id
    postState.menu = menu
    postState.title = title
    postState.content = content
    postState.category = category
    postState.isPublic = isPublic
    fileState.files = Array.isArray(images) ? images : []

    const idx = fileState.files.findIndex(({ _id }) => _id === thumbnail)
    if (thumbnail && idx !== -1) {
      onSelectImage(fileState.files[idx], idx)
    }
  }

  watch(
    () => canLeavePage,
    (newCanLeavePage, oldCanLeavePage) => {
      if (newCanLeavePage && !oldCanLeavePage && !autoSave) {
        autoSave = route.query.id ? setInterval(onUpdatePost, 1000 * 60 * 5) : setInterval(onUpdateDraft, 1000 * 60 * 5)
      }
    }
  )

  watch(
    () => postState.menu,
    () => {
      const { menu, category } = postState

      if (menu) {
        const { main, sub } = Object.keys(menuState.menus).reduce((acc, key) => {
          const searchedMenu = menuState.menus[key].find(({ _id }) => _id === menu)
          if (searchedMenu) acc = { ...searchedMenu }
          return acc
        }, {})

        if (main) {
          document.body.querySelector('div.main select').value = main
          menuState.mainMenus = menuState.menus[main]
        }
        if (sub) {
          document.body.querySelector('div.sub select').value = sub
          menuState.subMenu = menuState.mainMenus.find((menu) => menu.sub === sub)
        }
        if (category) document.body.querySelector('div.category select').value = category
      }
    },
    { flush: 'post' }
  )

  onBeforeMount(async () => {
    if (route.query.id) {
      if (state.post.post) return setInitData(state.post.post)

      const { success, post, error } = await dispatch('post/getPost', { postId: route.query.id })
      if (!success) {
        alert(error)
        return go(-1)
      }

      setInitData(post)
    }
  })

  onMounted(() => {
    window.addEventListener('beforeunload', unloadEvent)
  })

  onUnmounted(async () => {
    window.removeEventListener('beforeunload', unloadEvent)
    if (autoSave) clearInterval(autoSave)
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
            font-family: 'Roboto', 'Noto Sans KR', sans-serif;
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
