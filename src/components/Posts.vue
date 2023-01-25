<template>
  <!-- Slide toolbar -->
  <div v-if="type === 'slide' && !recent" class="wrap_slide_toolbar">
    <div class="slide_category">
      <span class="category">{{ category }}</span>
    </div>
    <div class="slide_page" v-if="!isAllMobileDevice">
      <span class="nowPage">{{ slidePage }}</span>
      <span class="maxPage">{{ slideMaxPage }}</span>
    </div>
  </div>

  <!-- List of Posts -->
  <div class="posts">
    <ul>
      <div :id="type" ref="POST_EL">
        <template v-if="posts?.length">
          <TransitionGroup
            name="fade"
            @before-enter="beforeEnter"
            @after-enter="afterEnter"
            @enter-cancelled="afterEnter"
          >
            <template v-for="(post, index) in posts" :key="index">
              <PostSlot :type="type" :post="post" :data-index="index" @commitPosts="onCommitPosts"></PostSlot>
            </template>
          </TransitionGroup>
          <Observer v-model:page="page" @updatePage="onUpdatePage"></Observer>
        </template>
        <p v-else class="empty_posts">no posts yet</p>
      </div>
    </ul>

    <!-- Slide buttons -->
    <div v-if="type === 'slide'" class="wrap_btn_slidePage">
      <Button
        v-show="slidePage !== 1 && !isAllMobileDevice"
        class="btn_old"
        size="md"
        svg="arrow-left"
        bgColor="primary"
        customColor="#fff"
        customPadding="0"
        @onClick="prevSlide"
      />
      <Button
        v-show="slidePage < slideMaxPage && !isAllMobileDevice"
        class="btn_next"
        size="md"
        svg="arrow-right"
        bgColor="primary"
        customColor="#fff"
        customPadding="0"
        @onClick="nextSlide"
      />
    </div>
  </div>
</template>

<script setup>
  import { defineProps, ref, reactive, computed, watch, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import { useMedia } from '../common/mediaQuery'
  import PostSlot from './slotdata/PostSlot.vue'
  import Observer from './global/Observer.vue'

  const props = defineProps({
    menu: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: 'list',
      validator: (value) => ['list', 'card', 'slide', 'recent'].includes(value),
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
  const { commit, dispatch } = useStore()

  //const isAllMobile = useMedia('only screen and (max-width: 1199px)')
  const isAllMobileDevice = ref(false)
  const isDesktop = useMedia('(min-width: 1200px)')
  const isTabletLandScape = useMedia('(min-width: 1024px) and (max-width: 1199px)')
  const isTablet = useMedia('(min-width: 768px) and (max-width: 1023px)')
  const isMobile = useMedia('(min-width: 0px) and (max-width: 767px)')

  const MOBILE_LIST =
    /Android|Mobile|iP(hone|od|ad)|BlackBerry|I EMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/
  const POST_EL = ref(null)

  const posts = ref([]) // 게시물 배열
  const page = ref(1) // 현재까지 받아온 페이지
  const maxCount = ref(1) // 전체 게시물 갯수

  const limit = computed(() => (props.type === 'slide' ? 8 : props.recent ? 6 : 12)) // 한 번의 요청에 받아올 게시물 갯수
  const maxPage = computed(() => Math.ceil(maxCount.value / limit.value)) // 요청 가능한 페이지의 상한값
  const skip = computed(() => (page.value - 1) * limit.value)
  const menu = computed(() => props.menu.map(({ _id }) => _id))
  const category = computed(() => props.category)
  const hasThumbnail = computed(() => props.type === 'slide' && !props.recent)

  /* Slide 변수 */
  const slidePage = ref(1) // 현재 보고 있는 페이지
  const slideIndex = ref(0) // 슬라이드 인덱스
  const slideLimit = computed(() => (isDesktop.value ? limit.value / 2 : limit.value / 4)) // 한 번의 슬라이드에 넘길 게시물 갯수
  const slideMaxPage = computed(() => Math.ceil(maxCount.value / slideLimit.value)) // 슬라이드 가능한 페이지 상한값
  const slideRest = computed(() => slideMaxPage.value * slideLimit.value - maxCount.value) // 슬라이드 마지막 페이지에 모자란 게시물 갯수
  /* Slide 변수 끝 */

  // 게시물 요청 쿼리
  const query = reactive({
    limit,
    skip,
    menu,
    category,
    hasThumbnail: false,
    filter: computed(() => props.filter),
    userId: computed(() => props.userId),
    sort: computed(() => props.sort),
  })

  const onUpdatePage = (updatePage) => {
    if (maxPage.value < updatePage || props.recent) return
    page.value = updatePage
    getPosts(page.value)
  }

  const onUpdateSlidePage = (updatePage) => {
    if (slideMaxPage.value < updatePage) return
    slidePage.value = updatePage
  }

  const slide = (idx) => {
    const target = POST_EL.value?.querySelector(`li[data-index="${idx}"]`)
    if (!target) return

    const parent = POST_EL.value.getBoundingClientRect().left
    const x = target.getBoundingClientRect().left - parent

    POST_EL.value.style.transform = `translateX(-${x}px)`
    POST_EL.value.style.transition = 'all 0.3s'
  }

  const updateIndex = (idx) => {
    slideIndex.value = idx
  }

  // Slide index is - (0) 4 8 12 ...
  const nextSlide = () => {
    if (slidePage.value === slideMaxPage.value) return

    onUpdateSlidePage(slidePage.value + 1)

    const idx = !isDesktop.value
      ? (slidePage.value - 1) * slideLimit.value
      : slidePage.value !== slideMaxPage.value
      ? (slidePage.value - 1) * slideLimit.value
      : (slidePage.value - 1) * slideLimit.value - slideRest.value
    updateIndex(idx)
    slide(slideIndex.value)
  }

  // Slide index is - ... 12, 8, 4, 0
  const prevSlide = () => {
    if (slidePage.value === 1) return

    onUpdateSlidePage(slidePage.value - 1)
    //const idx = slidePage.value !== 1 ? (slidePage.value - 1) * slideLimit.value - slideRest.value : 0
    const idx = (slidePage.value - 1) * slideLimit.value
    updateIndex(idx)
    slide(slideIndex.value)
  }

  const getPosts = async (getPage) => {
    const { success, posts: newPosts, maxCount: newMaxCount } = await dispatch('post/getPosts', query)
    if (!success) throw new Error('게시물을 받아오는 도중 에러가 발생하였습니다.')

    if (newMaxCount) maxCount.value = props.recent ? limit.value : newMaxCount
    posts.value.splice((getPage - 1) * limit.value, limit.value, ...newPosts)
  }

  const onCommitPosts = () => {
    commit('post/SET_POSTS', posts.value)
  }

  const beforeEnter = (el) => {
    el.style.transitionDelay = 150 * parseInt(el.dataset.index % limit.value, 10) + 'ms'
  }

  const afterEnter = (el) => {
    el.style.transitionDelay = ''
  }

  const getDevice = () => {
    isAllMobileDevice.value = navigator.userAgent.match(MOBILE_LIST) === null ? false : true
    if (isAllMobileDevice.value && props.type === 'slide') POST_EL.value.style.overflowX = 'auto'
  }

  watch(
    isDesktop,
    (newIsDesktop, oldIsDesktop) => {
      if (!newIsDesktop && oldIsDesktop) {
        // PC -> Mobile로 갈 때
        onUpdateSlidePage(slidePage.value * 2 - 1)
        slide(slideIndex.value)
      } else if (newIsDesktop && !oldIsDesktop) {
        // Mobile -> PC로 갈 때
        onUpdateSlidePage(Math.ceil(slidePage.value / 2))
        slide(slideIndex.value)
      }
    },
    { flush: 'post' }
  )

  watch(
    [isTabletLandScape, isTablet, isMobile],
    ([newIsTabletLandScape, newIsTablet, newIsMobile], [, ,]) => {
      // Mobile 안에서 바뀔 때
      if (newIsTabletLandScape || newIsTablet || newIsMobile) slide(slideIndex.value)
    },
    { flush: 'post' }
  )

  watch(
    () => [props.menu, props.category, props.filter, props.sort],
    () => {
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
      posts.value = []
      onUpdatePage(1)
      onUpdateSlidePage(1)
      getPosts(1)
    }
  )

  await getPosts(1)

  onMounted(() => {
    getDevice()
  })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-leave-active {
    transition: opacity 0s;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .fade-enter-active {
    animation: fadeIn 0.3s;
  }

  @keyframes fadeIn {
    from {
      transform: translateY(4rem);
    }
    to {
      transform: translateY(0);
    }
  }

  .posts {
    position: relative;

    ul {
      overflow-x: clip;
      -ms-overflow-style: none;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera*/
      }
    }

    .wrap_btn_slidePage {
      position: absolute;
      top: -4rem;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;

      @include tablet {
        top: -4.5rem;
      }

      @include mobile {
        top: -6rem;
      }

      .btn_old,
      .btn_next {
        border-radius: 50%;
        width: 3.2rem;
        height: 3.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 10;
      }

      .btn_old {
        left: -1.6rem;
      }

      .btn_next {
        margin-left: auto;
        left: 1.6rem;
      }
    }

    .empty_posts {
      font-size: 1.4rem;
      color: var(--text-light);
      text-transform: capitalize;
    }
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

  .wrap_slide_toolbar {
    display: flex;
    margin: 6.4rem 0 4rem;

    .slide_category {
      display: flex;
      align-items: center;
      width: 30%;
      font-size: 1.6rem;
      color: var(--primary-dark);
      text-transform: uppercase;
      position: relative;

      .category {
        padding-left: 1.6rem;

        &::before {
          content: '';
          position: absolute;
          width: 0.1rem;
          height: 1.6rem;
          background-color: var(--primary-dark);
          top: 0.6rem;
          left: 0;
        }
      }
    }

    .slide_page {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 1.4rem;
      font-weight: 500;
      width: 100%;

      .nowPage {
        color: var(--primary-dark);
      }

      .maxPage {
        color: #c7c7c7;

        &::before {
          content: '/';
          margin: 0 0.8rem;
        }
      }
    }
  }
</style>
