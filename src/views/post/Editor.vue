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

    <button @click="onAddFile()">해당 포커스에 파일 첨부하기</button>

    <button class="submit" @click="onSubmit()">Submit</button>

    <!--
    <div class="tags">
      <transition-group name="list" tag="div" class="tagView">
        <ul v-for="(item, index) in tags" :key="item" v-show="tags">
          <li>
            <span>{{ item }}</span
            ><button @click="delTag(index)"><i class="material-icons">clear</i></button>
          </li>
        </ul>
      </transition-group>
      <input type="text" v-model.trim="tag" placeholder="태그는 쉼표(,)로 구분" onfocus="this.placeholder=''" onblur="this.placeholder='태그는 쉼표(,)로 구분'" @keyup="addTag($event)" />
    </div>
    -->
  </div>
  <Dialog ref="Dialog"></Dialog>
</template>

<script>
import { defineComponent, ref, reactive, watch, onBeforeMount, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
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
  setup(props, { emit }) {
    const { push, currentRoute } = useRouter()
    const { state, getters, dispatch } = useStore()
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

    const onAddFile = () => {
      let textarea = contentEl.value
      let start = textarea.value.substring(0, textarea.selectionStart)
      let end = textarea.value.substring(textarea.selectionEnd, textarea.value.length)

      const addText = '![고양이애옹](https://cdn.pixabay.com/photo/2019/03/13/08/29/cat-4052454_1280.jpg)\n'
      textarea.value = start + addText + end
      textarea.selectionStart = textarea.selectionStart + addText.length
      textarea.selectionEnd = textarea.selectionStart
      textarea.focus()
    }

    const onSubmit = async () => {
      if (!states.title || !states.subject) {
        return alert('게시글을 삽입할 메뉴를 선택해야 합니다.')
      }

      toggleCanLeavePage(true)

      const post = {
        _id: state.post.post._id || undefined,
        subject: getters['menu/getMenuIds']({ title: states.title, subject: states.subject }),
        category: states.category ? states.category : undefined,
        isPublic: states.isPublic,
        title: title.value,
        content: content.value,
      }
      const response = params.postNum ? await dispatch('post/updatePost', post) : await dispatch('post/createPost', post)

      response.success ? push({ name: 'post', params: { title: states.title, subject: states.subject, postNum: response.data.post.postNum } }) : alert(response.message)
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

    const stop = watch(
      [title, content],
      () => {
        toggleCanLeavePage(false)
      },
      { flush: 'post' }
    )

    setTimeout(() => {
      if (!states.canLeavePage) stop()
    }, 1000 * 60)

    onBeforeMount(() => {
      if (params.postNum) {
        const menu = getters['menu/getMenu'](state.post.post.subject)
        states.title = menu.title
        states.subject = menu.subject
        title.value = state.post.post.title
        content.value = state.post.post.content
        states.category = state.post.post.category
      }
    })

    onMounted(() => {
      window.addEventListener('beforeunload', unLoadEvent)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('beforeunload', unLoadEvent)
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

    return { getters, Dialog, plugins, options, states, title, content, contentEl, onAddFile, onSubmit, togglePublic }
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

  button.submit {
    grid-row: 5 / 6;
    width: 10.8rem;
    height: 4rem;
    justify-self: end;
    background: var(--point);
    color: #fff;
    font-weight: 500;
    font-size: 1.2rem;
    border-radius: 2rem;
  }
}
</style>
