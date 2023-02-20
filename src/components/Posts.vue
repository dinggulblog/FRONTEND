<template>
  <div class="wrap_posts">
    <Slider v-if="type === 'slide'" :category="category" :maxCount="maxCount" :limit="limit" @slide="slide"></Slider>

    <!-- List of Posts -->
    <div class="posts">
      <ul :id="type" ref="POST_EL">
        <template v-if="posts?.length">
        <TransitionGroup name="fade_up" @before-enter="beforeEnter" @after-enter="afterEnter" @enter-cancelled="afterEnter">
          <template v-for="(post, index) in posts" :key="index">
              <PostsItem :type="type" :post="post" :data-index="index" @commitPosts="$store.commit('post/SET_POSTS', posts)"></PostsItem>
          </template>
          </TransitionGroup>
        <Observer v-model:page="page" @updatePage="onUpdatePage"></Observer>
      </template>
        <p v-else class="empty_posts">no posts yet</p>
      </ul>
    </div>
  </div>

</template>

<script setup>
  import { inject, ref, toRefs, reactive, computed, watch, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import PostsItem from './PostsItem.vue'
  import Observer from './global/Observer.vue'
  import Slider from './Slider.vue'

  const typeLimit = {
    list: 10,
    card: 9,
    slide: 8,
    recent: 6
  }

  const props = defineProps({
    type: {
      type: String,
      default: 'list',
      validator: (value) => ['list', 'card', 'slide', 'recent'].includes(value),
    },
    sort: {
      type: String,
      required: false,
      validator: (value) => ['view', 'like'].includes(value),
    },
    menu: {
      type: Array,
      default: () => [],
    },
    category: {
      type: String,
      default: '전체',
    },
    filter: {
      type: String,
      required: false,
      validator: (value) => ['like', 'comment'].includes(value),
    },
    userId: {
      type: String,
      required: false,
    },
  })
  const { dispatch } = useStore()
  const { type, menu, category, filter, userId, sort } = toRefs(props)

  const isMobileDevices = inject('isMobileDevices')

  const POST_EL = ref(null)
  const posts = ref([])   // 게시물 배열
  const page = ref(1)     // 현재까지 받아온 페이지
  const maxCount = ref(1) // 전체 게시물 갯수

  const limit = computed(() => typeLimit[type.value])        // 한 번의 요청에 받아올 게시물 갯수
  const maxPage = computed(() => Math.ceil(maxCount.value / limit.value)) // 요청 가능한 페이지의 상한값
  const skip = computed(() => (page.value - 1) * limit.value)

  const onUpdatePage = (updatePage) => {
    if (maxPage.value < updatePage) return
    page.value = updatePage
    getPosts(page.value)
  }

  const slide = (idx) => {
    const target = POST_EL.value?.querySelector(`li[data-index="${idx}"]`)
    if (!target) return

    const parent = POST_EL.value.getBoundingClientRect().left
    const x = target.getBoundingClientRect().left - parent

    POST_EL.value.style.transform = `translateX(-${x}px)`
    POST_EL.value.style.transition = 'all 0.3s'
  }

  const getPosts = async (getPage) => {
    const res = await dispatch('post/getPosts', reactive({ limit, skip, menu, category, filter, userId, sort, hasThumbnail: props.type === 'slide' ? true : false }))
    if (!res.success) throw new Error('게시물을 받아오는 도중 에러가 발생하였습니다.')

    if (res.maxCount) maxCount.value = type.value === 'recent' ? limit.value : res.maxCount
    posts.value.splice((getPage - 1) * limit.value, limit.value, ...res.posts)
  }

  const beforeEnter = (el) => {
    el.style.transitionDelay = 150 * parseInt(el.dataset.index % limit.value, 10) + 'ms'
  }

  const afterEnter = (el) => {
    el.style.transitionDelay = ''
  }

  watch(
    props,
    () => {
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
      posts.value = []
      onUpdatePage(1)
      getPosts(1)
    }
  )

  onMounted(() => {
    if (isMobileDevices.value && type.value === 'slide') POST_EL.value.style.overflowX = 'auto'
  })

  await getPosts(1)
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .wrap_posts {
    position: relative;

    .posts {

overflow-x: clip;
-ms-overflow-style: none;
scrollbar-width: none;

&::-webkit-scrollbar {
 display: none; /* Chrome, Safari, Opera*/
}


.empty_posts {
font-size: 1.4rem;
color: var(--text3);
text-transform: capitalize;
}
}

  }


</style>
