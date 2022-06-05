<template>
  <div class="editor">
    <div class="choose">
      <div class="menu">
        <select v-model="selectedMenu">
          <option v-for="menu in menus" :key="menu.key" :value="menu.value">
            {{ menu.value }}
          </option>
        </select>
      </div>

      <div class="subMenu" v-show="subMenus.length">
        <select v-model="selectedSubMenu">
          <option v-for="sub in subMenus" :key="sub.key">
            {{ sub.value }}
          </option>
        </select>
      </div>

      <div class="category" v-show="selectedSubMenu">
        <select v-model="selectedCategory">
          <option v-for="category in categories" :key="category">
            {{ category }}
          </option>
        </select>
      </div>

      <div class="toggle">
        <button class="material-icons" v-text="isPrivate ? 'toggle_on' : 'toggle_off'" :style="[isPrivate ? { color: 'var(--point)' } : { color: '#E6E6E6' }]" @click="isPrivate = !isPrivate"></button>
        <span v-text="isPrivate ? 'Secret' : 'Public'" :style="[isPrivate ? { color: 'var(--point)' } : { color: '#BABABA' }]"></span>
      </div>
    </div>

    <div class="title">
      <input type="text" v-model="title" placeholder="제목" onfocus="this.placeholder=''" onblur="this.placeholder='제목'" />
    </div>

    <div class="content">
      <textarea v-model="contentValue" placeholder="당신의 이야기를 적어보세요..."> </textarea>
      <markdown :source="contentValue" :plugins="plugins" :breaks="true" :xhtmlOut="true" :typographer="true" class="markdown" />
      <!--<QuillEditor theme="snow" contentType="html" v-model:content="content" :toolbar="option.toolbarOptions" />-->
    </div>

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

    <button @click="onSubmit()" class="submit">Submit</button>
  </div>
  <Dialog ref="Dialog"></Dialog>
</template>

<script>
import { ref, inject, computed, watch, onMounted, onUpdated, onBeforeUnmount } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { QuillEditor } from '@vueup/vue-quill'
import Dialog from '../../components/Dialog.vue'
import Markdown from 'vue3-markdown-it'
import MarkdownEmoji from 'markdown-it-emoji'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import 'highlight.js/styles/atom-one-dark.css'

export default {
  name: 'editor',
  components: {
    Dialog,
    Markdown,
  },
  setup(props, { emit }) {
    const router = useRouter()
    const route = router.currentRoute.value
    const store = useStore()
    const Dialog = ref(null)
    const contentValue = ref()

    const plugins = ref([
      {
        plugin: MarkdownEmoji,
      },
    ])

    const state = {
      firstUpdate: true,
      canLeavePage: true,
    }
    const option = {
      toolbarOptions: [['bold', 'italic', 'underline', 'strike'], [{ size: ['small', false, 'large', 'huge'] }], [{ color: [] }, { background: [] }], ['link', 'image'], ['clean']],
    }

    if (!route.params.idx) store.commit('post/SET_POST', { title: '', content: '', tags: [] })

    const post = computed(() => store.state.post.post)
    const isPrivate = ref(false)

    const selectedMenu = ref()
    const selectedSubMenu = ref()
    const selectedCategory = ref()

    const menus = ref(inject('menus'))
    const subMenus = computed(() => (selectedMenu.value ? menus.value.find((menu) => menu.value === selectedMenu.value).sub : []))
    const categories = computed(() => (selectedSubMenu.value ? subMenus.value.find((sub) => sub.value === selectedSubMenu.value).categories : []))

    const title = computed({
      get: () => store.state.post.post.title || '',
      set: (val) => store.commit('post/SET_POST_TITLE', val),
    })
    const content = computed({
      get: () => store.state.post.post.content || '',
      set: (val) => store.commit('post/SET_POST_CONTENT', val),
    })
    const tag = ref(null)
    const tags = computed({
      get: () => store.state.post.post.tags || [],
      set: (val) => store.commit('post/SET_POST_TAGS', val),
    })

    watch([title, content, tags], () => {
      toggleCanLeavePage(false)
    })

    watch(selectedMenu, () => {
      selectedSubMenu.value = selectedCategory.value = ''
    })

    const onSubmit = async () => {
      try {
        toggleCanLeavePage(true)
        let response = null

        selectedMenu.value == null ? alert('메뉴를 선택해주세요') : store.commit('post/SET_POST_STATE', { menu: selectedMenu, sub: selectedSubMenu, category: selectedCategory, isPrivate })

        post.value._id ? (response = await store.dispatch('post/editPost', post.value)) : (response = await store.dispatch('post/createPost', post.value))

        response === 200 ? router.push({ name: 'post', params: { idx: store.state.post.posts.length } }) : alert(`Cannot save diary(Server error ${response})`)
      } catch (err) {
        console.log(err)
      }
    }

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

    const toggleCanLeavePage = (bool) => {
      state.canLeavePage = bool
      emit('toggle-can-leave-site', state.canLeavePage)
    }

    const unLoadEvent = (event) => {
      if (!state.canLeaveSite) {
        event.preventDefault()
        event.returnValue = ''
      }
    }

    const goBack = () => {
      router.go(-1)
    }

    onUpdated(() => {
      if (state.firstUpdate) {
        state.canLeavePage = true
      }
      state.firstUpdate = false
    })

    onMounted(() => {
      window.addEventListener('beforeunload', unLoadEvent)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('beforeunload', unLoadEvent)
    })

    onBeforeRouteLeave(async (to, from, next) => {
      if (state.canLeavePage) {
        next()
      } else {
        const ok = await Dialog.value.show({
          title: '현재 페이지에서 나가시겠습니까?',
          message: '작성된 내용은 떠나갈것입니다...',
        })
        ok ? next() : next(false)
      }
    })

    return {
      Dialog,
      plugins,
      option,
      selectedMenu,
      selectedSubMenu,
      selectedCategory,
      menus,
      subMenus,
      categories,
      isPrivate,
      post,
      title,
      content,
      tag,
      tags,
      onSubmit,
      addTag,
      delTag,
      goBack,
      contentValue,
    }
  },
}
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

  .choose {
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

    div:nth-child(4) {
      grid-column: 4 / 5;
      display: grid;
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
