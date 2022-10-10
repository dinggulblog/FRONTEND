<template>
  <div class="posts">
    <!-- Toolbar -->
    <Toolbar :type="states.type" :category="states.category" :categories="states.categories" :title="states.title" :subject="states.subject" @updatedToolbar="updatedToolbar" />

    <!-- List contents -->
    <div v-if="posts.length">
      <ul :class="states.type">
        <template v-for="post in posts" :key="post._id">
          <hi :type="states.type" :title="states.title" :subject="states.subject" :post="post" :isLike="[...post.likes].includes(user.id)" />
        </template>
      </ul>
    </div>
    <div v-else class="empty"><span>There is no posts.</span></div>

    <!-- Pagenation -->
    <Pagenation2 :page="page" :limit="limit" :maxPage="maxPage" @updatePage="updatePage" />
  </div>
</template>

<script>
import { ref, reactive, computed, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import Toolbar from '../../components/Toolbar.vue'
import hi from '../../components/Slot.vue'
import Pagenation2 from '../../components/Pagenation2.vue'

export default {
  name: 'posts',
  components: {
    Toolbar,
    hi,
    Pagenation2,
  },
  setup() {
    const { state, getters, dispatch } = useStore()
    const route = useRoute()

    const page = ref(1)
    const limit = ref(5)
    const maxPage = ref(1)
    const states = reactive({
      type: 'list',
      category: 'All',
      categories: [],
      title: '',
      subject: undefined,
    })

    const params = computed(() => route.params)
    const user = computed(() => state.auth.user)
    const posts = computed(() => state.post.posts)

    const updatedToolbar = ({ updatedType, updatedCategory }) => {
      if (updatedType) {
        states.type = updatedType
      } else if (updatedCategory) {
        states.category = updatedCategory
      }
    }

    const updatePage = ({ updatedPage }) => {
      page.value = updatedPage
    }

    watch(
      params,
      () => {
        states.title = params.value.title
        states.subject = params.value?.subject
        states.category = 'All'
        states.categories = getters['menu/getCategories']({ title: states.title, subject: states.subject })
        updatePage({ updatedPage: 1 })
      },
      { immediate: true }
    )

    watchEffect(
      async () => {
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
        const subjects = getters['menu/getMenuIds']({ title: states.title, subject: states.subject })
        const response = await dispatch('post/getPosts', { subjects, category: states.category === 'All' ? undefined : states.category, page: page.value, limit: limit.value })
        response.success ? (maxPage.value = response.data.maxPage || 1) : alert(response.message)
      },
      { flush: 'post' }
    )

    return { page, limit, maxPage, states, params, user, posts, updatedToolbar, updatePage }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.posts {
  .empty {
    color: var(--primary);
  }
}

.list {
  li:last-child {
    margin-bottom: 0;
  }
}

.album {
  display: grid;
  justify-content: start;
  grid-template-columns: repeat(auto-fit, minmax(auto, 30.3rem));
  gap: 3.2rem 3.2rem;
}
</style>
