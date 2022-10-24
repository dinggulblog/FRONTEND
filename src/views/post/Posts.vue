<template>
  <div class="posts">
    <!-- Toolbar -->
    <Toolbar :type="states.type" :category="states.category" :categories="states.categories" :title="states.title" :subject="states.subject" @updatedType="updatedType" @updatedCategory="updatedCategory" />

    <!-- List contents -->
    <div v-if="posts.length">
      <ul :class="states.type">
        <template v-for="post in posts" :key="post._id">
          <Slot :type="states.type" :title="states.title" :subject="states.subject" :post="post" :isLike="[...post.likes].includes(user.id)"></Slot>
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
import Slot from '../../components/Slot.vue'
import Pagenation2 from '../../components/Pagenation2.vue'

export default {
  name: 'posts',
  components: {
    Toolbar,
    Slot,
    Pagenation2,
  },
  setup() {
    const { state, getters, dispatch } = useStore()
    const route = useRoute()

    const page = ref(1)
    const limit = ref(6)
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

    const updatedType = (type) => {
      states.type = type
    }

    const updatedCategory = (category) => {
      states.category = category
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

    return { page, limit, maxPage, states, params, user, posts, updatedType, updatedCategory, updatePage }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss">
.list {
  display: flex;
  flex-direction: column;
}

.card {
  display: flex;
  width: 100%;
  flex-wrap: wrap;

  @include tablet_landscape {
    & #card:nth-child(3n + 0) {
      margin-right: 0;
    }
  }

  @include desktop {
    & #card:nth-child(3n + 0) {
      margin-right: 0;
    }
  }

  @include mobile_tablet {
    & #card:nth-child(2n + 0) {
      margin-right: 0;
    }
  }
}
</style>
