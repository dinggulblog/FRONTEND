<template>

  <!-- Slide Toolbar -->
  <Slider v-if="type === 'slide'" :category="category" :maxCount="maxCount" :limit="limit" :isAllMobileDevice="isAllMobileDevice" @slide="slide"></Slider>

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

</template>

<script setup>
  import { ref, reactive, computed, watch, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import PostsItem from './PostsItem.vue'
  import Observer from './global/Observer.vue'
  import Slider from './Slider.vue'

  const props = defineProps({
    menu: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: 'list',
      validator: (value) => ['list', 'card', 'recent', 'slide'].includes(value),
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
    recent: {
      type: Boolean,
      default: false,
    },
    sort: {
      type: String,
      required: false,
      validator: (value) => ['view', 'like'].includes(value),
    },
  })
  const { dispatch } = useStore()

  const MOBILE_LIST = /Android|Mobile|iP(hone|od|ad)|BlackBerry|I EMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/
  const POST_EL = ref(null)
  const isAllMobileDevice = computed(() => navigator.userAgent.match(MOBILE_LIST) === null ? false : true)

  const posts = ref([]) // 게시물 배열
  const page = ref(1) // 현재까지 받아온 페이지
  const maxCount = ref(1) // 전체 게시물 갯수

  const limit = computed(() => (props.recent ? 6 : 12)) // 한 번의 요청에 받아올 게시물 갯수
  const maxPage = computed(() => Math.ceil(maxCount.value / limit.value)) // 요청 가능한 페이지의 상한값
  const skip = computed(() => (page.value - 1) * limit.value)
  const menu = computed(() => props.menu.map(({ _id }) => _id))
  const category = computed(() => props.category)

  // 게시물 요청 쿼리
  const query = reactive({
    limit,
    skip,
    menu,
    category,
    filter: computed(() => props.filter),
    userId: computed(() => props.userId),
    sort: computed(() => props.sort),
  })

  const onUpdatePage = (updatePage) => {
    if (maxPage.value < updatePage || props.recent) return
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
    const { success, posts: newPosts, maxCount: newMaxCount } = await dispatch('post/getPosts', query)
    if (!success) throw new Error('게시물을 받아오는 도중 에러가 발생하였습니다.')

    if (newMaxCount) maxCount.value = props.recent ? limit.value : newMaxCount
    posts.value.splice((getPage - 1) * limit.value, limit.value, ...newPosts)
  }

  const beforeEnter = (el) => {
    el.style.transitionDelay = 150 * parseInt(el.dataset.index % limit.value, 10) + 'ms'
  }

  const afterEnter = (el) => {
    el.style.transitionDelay = ''
  }

  watch(
    () => [props.menu, props.category, props.filter, props.sort, props.type],
    () => {
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
      posts.value = []
      onUpdatePage(1)
      getPosts(1)
    }
  )

  onMounted(() => {
    if (isAllMobileDevice.value && props.type === 'slide') POST_EL.value.style.overflowX = 'auto'
  })

  await getPosts(1)
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  ul {
      overflow-x: clip;
      -ms-overflow-style: none;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera*/
      }
    }

    .empty_posts {
      font-size: 1.4rem;
      color: var(--text3);
      text-transform: capitalize;
    }

  #list {
    display: flex;
    flex-direction: column;
  }

  #card {
    display: flex;
    width: 100%;
    flex-wrap: wrap;

    @include tablet_landscape {
      & .card_item:nth-child(3n + 0) {
        margin-right: 0;
      }
    }

    @include desktop {
      & .card_item:nth-child(3n + 0) {
        margin-right: 0;
      }
    }

    @include mobile_tablet {
      & .card_item:nth-child(2n + 0) {
        margin-right: 0;
      }
    }
  }

  #slide {
    display: flex;
    flex-direction: row;
    margin: 0 0 0rem;
    -ms-overflow-style: none;
    scrollbar-width: none;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    position: relative;
    z-index: 9;

    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }

    li {
      margin: 0 2.4rem 0 0;
    }

    li:last-of-type {
      margin: 0;
    }
  }

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

</style>
