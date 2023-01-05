<template>
  <div class="editor">
    <div class="wrap_select_toggle">
      <div class="select">
        <div class="main">
          <select required @change="onChangeMainMenu">
            <option selected disabled hidden value="">main menu</option>
            <option v-for="main in Object.keys(menuState.menus)" :key="main" :value="main">{{ main }}</option>
          </select>
        </div>

        <div class="sub">
          <select required :disabled="!menuState.mainMenus.length" @change="onChangeSubMenu">
            <option selected disabled hidden value="">sub menu</option>
            <option v-for="menu in menuState.mainMenus" :key="menu?._id" :value="menu?.sub">{{ menu?.sub }}</option>
          </select>
        </div>

        <div class="category">
          <select :disabled="!menuState.subMenu.categories" @change="onChangeCategory">
            <option selected disabled hidden value="">category</option>
            <option v-for="category in menuState.subMenu.categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
      </div>

      <div class="wrap_toggle">
        <Toggle :isPublic="postState.isPublic" @updateIsPublic="onChangeIsPublic" />
      </div>
    </div>

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
      <div class="images_add_btn">
        <label for="upload_input" class="upload_label">사진 불러오기</label>
        <input
          ref="UPLOAD_INPUT_EL"
          type="file"
          id="upload_input"
          @change="onUploadImages"
          @click="$refs.UPLOAD_INPUT_EL.value = ''"
          multiple
        />
      </div>
    </div>

    <div class="content">
      <textarea
        id="content-el"
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

    <div class="images" v-if="fileState.files.length">
      <ul>
        <li v-for="(file, index) in fileState.files" :key="file.serverFileName">
          <div class="wrap_thumbnail">
            <img
              :src="`${IMAGE_URL}${file.serverFileName}`"
              :class="fileState.fileIndex === index ? 'selected_thumbnail' : ''"
              @click="onSelectImage(file, index)"
            />
            <button class="image_del_btn" @click="onDeleteImage(file, index)">
              <i class="material-symbols-outlined"> do_not_disturb_on </i>
            </button>
          </div>
        </li>
      </ul>
    </div>

    <div class="wrap_btns">
      <div class="wrap_image_btns">
        <Button
          v-show="fileState.files.length"
          class="btn_image_insert"
          :content="'사진 첨부'"
          :size="'md'"
          :borderColor="'primary-dark'"
          :rounded="true"
          :full="isMobile ? true : false"
          :disabled="menuState.isLoading"
          @onClick="onInsertImage"
        ></Button>
        <Button
          v-show="fileState.files.length"
          class="btn_image_clear"
          :content="'사진 모두 제거'"
          :size="'md'"
          :borderColor="'primary-dark'"
          :rounded="true"
          :full="isMobile ? true : false"
          :disabled="menuState.isLoading"
          @onClick="onClearImages"
        ></Button>
      </div>

      <Button
        class="btn_submit"
        :content="'글 등록'"
        :size="'md'"
        :bgColor="'primary-dark'"
        :custom="true"
        :rounded="true"
        :full="isMobile ? true : false"
        :disabled="menuState.isLoading"
        @onClick="onChangeCanLeavePage(true), onUpdatePost()"
      ></Button>

      <!--
      <div class="wrap_right">
        <div class="wrap_isLoading">
          <Transition name="isLoading">
            <span class="isLoading" v-if="menuState.isLoading">
              <i class="material-symbols-outlined">hourglass_empty</i>{{ `자동 저장중...${menuState.percentage}` }}
            </span>
          </Transition>
        </div>
      </div>
      -->
    </div>
  </div>
  <Dialog ref="Dialog"></Dialog>
</template>

<script>
  import { defineComponent, ref, reactive, computed, onBeforeMount, onMounted, onUnmounted } from 'vue'
  import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
  import { useStore } from 'vuex'
  import { useMedia } from '../../common/mediaQuery'
  import Markdown from 'vue3-markdown-it'
  import MarkdownEmoji from 'markdown-it-emoji'
  import Toggle from '../../components/global/Toggle.vue'
  import 'highlight.js/styles/atom-one-dark.css'

  export default defineComponent({
    name: 'editor',
    components: {
      Toggle,
      Markdown,
    },
    setup() {
      const route = useRoute()
      const { go, push } = useRouter()
      const { state, commit, dispatch } = useStore()

      let canLeavePage = true
      const isMobile = useMedia('only screen and (max-width: 767px)')
      const Dialog = ref(null)
      const plugins = ref([{ plugin: MarkdownEmoji }])
      const IMAGE_URL = ref(process.env.VUE_APP_IMAGE_URL)

      const menuState = reactive({
        isLoading: computed(() => state.loading.isLoading),
        percentage: computed(() => state.loading.percentage),
        menus: computed(() => state.menu.menus),
        mainMenus: [],
        subMenu: {},
      })

      const postState = reactive({
        postId: '',
        draftId: '',
        menu: '',
        title: '',
        content: '',
        category: '기타',
        isPublic: true,
        images: computed(() => fileState.files.map((file) => file._id)),
        thumbnail: computed(() => fileState.fileId),
      })

      const fileState = reactive({
        tempFiles: new FormData(),
        files: [],
        fileId: '',
        fileName: '',
        fileUrl: 'http://localhost:3000/uploads/',
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
        if (!postState.menu) return

        const { draftId, postId, ...payload } = postState
        Object.keys(payload).forEach((key) => formData.append(key, payload[key]))

        const { success, draft, images } = draftId
          ? await dispatch('draft/updateDraft', { draftId, payload: formData })
          : await dispatch('draft/createDraft', formData)

        if (draft) postState.draftId = draft._id
        return { success, images }
      }

      const onUpdatePost = async () => {
        if (!postState.menu) return alert('게시글을 삽입할 메뉴를 선택해야 합니다.')

        const { draftId, postId, ...payload } = postState
        const { success, post } = postId
          ? await dispatch('post/updatePost', { postId, payload })
          : await dispatch('post/createPost', payload)

        if (success && canLeavePage) {
          push({ name: 'post', query: { id: post._id } })
        }
      }

      const onUploadImages = async (event) => {
        if (!event.target.files.length) return
        if (!postState.menu) return alert('게시글을 삽입할 메뉴를 선택해야 합니다.')

        const formData = new FormData()
        Object.values(event.target.files).forEach((file) => formData.append('images', file))

        const { success, images } = postState.postId
          ? await dispatch('post/updatePost', { postId: postState.postId, payload: formData })
          : await onUpdateDraft(formData)

        if (success && images) {
          fileState.files = fileState.files.concat(images)
          onSelectImage(fileState.files[0], 0)
        }
      }

      const onDeleteImage = async (file) => {
        if (!file?._id) return

        const { success } = postState.postId
          ? await dispatch('post/deleteFile', { postId: postState.postId, imageId: file._id })
          : await dispatch('draft/deleteFile', { draftId: postState.draftId, imageId: file._id })

        const idx = fileState.files.indexOf(file)
        if (success && idx !== -1) fileState.files = fileState.files.filter((file, index) => index !== idx)
      }

      const onSelectImage = (file, index) => {
        if (file) {
          fileState.fileId = file._id
          fileState.fileName = file.serverFileName
          fileState.fileUrl = fileState.fileUrl + fileState.fileName
          fileState.fileIndex = index
        }
      }

      const onInsertImage = () => {
        let textarea = document.body.querySelector('#content-el')
        let start = textarea.value.substring(0, textarea.selectionStart)
        let end = textarea.value.substring(textarea.selectionEnd, textarea.value.length)

        const innerText = `!` + `[` + `]` + `(` + `${fileState.fileUrl}` + `)\n`
        postState.content = start + innerText + end
        textarea.focus()
      }

      const onClearImages = () => {
        fileState.files = []
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

      const setInitData = (post, temp = false) => {
        const { _id, menu, category, title, content, isPublic, images, thumbnail } = post

        if (temp) postState.draftId = _id
        else postState.postId = _id

        postState.menu = menu
        postState.title = title
        postState.content = content
        postState.category = category
        postState.isPublic = isPublic
        fileState.files = Array.isArray(images) ? images : []

        const idx = fileState.files.findIndex((file) => file._id === thumbnail)
        if (thumbnail && idx !== -1) {
          onSelectImage(fileState.files[idx], idx)
        }
      }

      const autoSave = route.query.id
        ? setInterval(onUpdatePost, 1000 * 60 * 10)
        : setInterval(onUpdateDraft, 1000 * 60 * 10)

      onBeforeMount(() => {
        const { post } = state.post
        const { draft } = state.draft

        if (route.query.id) {
          if (post._id) setInitData(post)
          else if (draft._id) setInitData(draft, true)
          else go(-1)
        }
      })

      onMounted(() => {
        window.addEventListener('beforeunload', unloadEvent)
        const { menu, category } = postState

        if (menu) {
          const { main, sub } = state.menu.menus.find((m) => m._id === menu)

          document.body.querySelector('div.main select').value = main
          menuState.mainMenus = menuState.menus[main]

          document.body.querySelector('div.sub select').value = sub
          menuState.subMenu = menuState.mainMenus.find((menu) => menu.sub === sub)

          if (category) document.body.querySelector('div.category select').value = category
        }
      })

      onUnmounted(async () => {
        window.removeEventListener('beforeunload', unloadEvent)
        clearInterval(autoSave)
        commit('draft/SET_DRAFT', {})
      })

      onBeforeRouteLeave(async (to, from, next) => {
        if (canLeavePage) next()
        else {
          const ok = await Dialog.value.show({
            title: '현재 페이지에서 나가시겠습니까?',
            message: '임시 저장되지 않은 내용은 사라집니다.',
            okButton: '나가기',
            cancelButton: '잠시만요!',
          })
          ok ? next() : next(false)
        }
      })

      return {
        isMobile,
        Dialog,
        plugins,
        IMAGE_URL,
        menuState,
        postState,
        fileState,
        onChangeCanLeavePage,
        onChangeMainMenu,
        onChangeSubMenu,
        onChangeCategory,
        onChangeIsPublic,
        onUpdatePost,
        onUploadImages,
        onInsertImage,
        onClearImages,
        onDeleteImage,
        onSelectImage,
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
          border: 1px solid #ddd;
          width: 27rem;
          border-radius: 3.2rem;
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

      .wrap_toggle {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 10%;

        @include mobile {
          width: 100%;
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

      @include mobile {
        margin: 1.6rem 0;
      }

      .title {
        width: 80%;

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

      .images_add_btn {
        width: 20%;
        display: flex;
        justify-content: flex-end;
        margin: 0 0 0 3.2rem;

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

        @include mobile_all {
          width: 100%;
          margin: 0;
        }
      }

      textarea::placeholder {
        color: var(--text-light);
        font-size: 1.4rem;
      }

      .markdown {
        @include mobile_all {
          display: none;
        }
      }
    }

    .images {
      margin: 0 0 -1.2rem 0;
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
              border: 2px solid #ddd;
              object-fit: cover;
              padding: 0.2rem;

              &.selected_thumbnail {
                border: 2px solid var(--primary-dark);
              }
            }
            .image_del_btn {
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

        .btn_image_clear {
          margin: 0 0 0 1.2rem;
        }
      }

      /*

      .wrap_right {
        width: 50%;
        display: flex;
        justify-content: flex-end;

        .wrap_isLoading {
          display: flex;
          align-items: center;
          margin: 0 2.4rem 0 0;

          .isLoading {
            display: flex;
            align-items: center;
            color: var(--text-light);
          }
          .isLoading-enter-active,
          .isLoading-leave-active {
            transition: opacity 5s ease;
          }

          .isLoading-enter-from,
          .isLoading-leave-to {
            opacity: 0;
          }
        }


        .wrap_auto-save {
          display: flex;
          align-items: center;
          margin: 0 0 0 2.4rem;

          #auto-save {
            width: 1.6rem;
            height: 1.6rem;
          }
          label {
            margin: 0 2.4rem 0 1.2rem;
            font-size: 1.3rem;
            color: var(--text-dark);
          }
        }
  
      }
      */
    }
  }
</style>
