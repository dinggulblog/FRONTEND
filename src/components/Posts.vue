<template>
  <!-- Slide toolbar -->
  <div v-if="type === 'slide'" class="wrap_slide_toolbar">
    <div class="slide_category">
      <span class="category">{{ category }}</span>
    </div>
    <div class="slide_page">
      <span class="nowPage">{{ curPage }}</span>
      <span class="maxPage">{{ slicedMaxPage }}</span>
    </div>
  </div>

  <!-- List of Posts -->
  <div class="posts">
    <ul>
      <div :id="type" ref="POST_EL" style="overflow-x: auto">
        <transition-group
          name="fade"
          @before-enter="beforeEnter"
          @after-enter="afterEnter"
          @enter-cancelled="afterEnter"
        >
          <template v-for="(post, index) in posts" :key="index">
            <PostSlot :type="type" :post="post" :data-index="index" @commitPosts="onCommitPosts"></PostSlot>
          </template>
        </transition-group>
        <div
          ref="TRIGGER_EL"
          :style="type !== 'slide' ? { width: '100%' } : { width: '0', left: '-30px' }"
          style="height: 0; position: relative"
        ></div>
      </div>
    </ul>

    <!-- Slide buttons -->
    <div v-if="type === 'slide'" class="wrap_btn_slidePage">
      <Button
        v-show="curPage !== 1"
        class="btn_prev"
        size="md"
        svg="arrow-left"
        bgColor="primary"
        customColor="#fff"
        customPadding="0"
        @onClick="prevSlide"
      />
      <Button
        v-show="curPage < slicedMaxPage"
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
  import { defineProps, ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
  import { useStore } from 'vuex'
  import { useMedia } from '../common/mediaQuery'
  import PostSlot from './slotdata/PostSlot.vue'

  const props = defineProps({
    menu: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: 'list',
      validator: (value) => ['list', 'card', 'slide'].includes(value),
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
  const { commit, dispatch } = useStore()
  const isMobile = useMedia('only screen and (max-width: 1199px)')

  const POST_EL = ref(null)
  const TRIGGER_EL = ref(null)

  const posts = ref([])
  const page = ref(1)
  const curPage = ref(1)
  const maxPage = ref(1)
  const typeLimit = computed(() => (props.type === 'slide' ? 4 : 6))
  const limit = computed(() => (isMobile.value ? typeLimit.value : typeLimit.value * 2))
  const slicedMaxPage = computed(() => Math.ceil(maxPage.value / (limit.value / 2)))

  const skip = computed(() => (page.value === 1 ? 0 : page.value * (limit.value / 2)))
  const menu = computed(() => props.menu.map(({ _id }) => _id))
  const category = computed(() => props.category)
  const hasThumbnail = computed(() => props.type === 'slide')

  const query = reactive({
    limit,
    skip,
    menu,
    category,
    hasThumbnail,
    filter: computed(() => props.filter),
    userId: computed(() => props.userId),
  })

  const beforeEnter = (el) => {
    el.style.transitionDelay = 150 * parseInt(el.dataset.index % limit.value, 10) + 'ms'
  }

  const afterEnter = (el) => {
    el.style.transitionDelay = ''
  }

  const onCommitPosts = () => {
    commit('post/SET_POSTS', posts.value)
  }

  const onUpdatePage = (updatePage) => {
    if (maxPage.value < updatePage) return
    page.value = updatePage
  }

  const onUpdateCurrentPage = (updatePage) => {
    if (maxPage.value < updatePage) return
    curPage.value = updatePage
  }

  const slide = (element, index) => {
    if (!element) return

    const target = element?.querySelector(`li[data-index="${index}"]`)
    //const parent = element?.getBoundingClientRect()?.left

    if (target) {
      //const x = target.getBoundingClientRect().left - parent
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' })
      //element.style.transform = `translateX(-${x}px)`
      //element.style.transition = 'all 0.3s'
    }
  }

  const nextSlide = () => {
    if (curPage.value === slicedMaxPage.value) return

    onUpdateCurrentPage(curPage.value + 1)
    const index = curPage.value * (limit.value / 2) - 1
    slide(POST_EL.value, posts.value.length - 1 < index ? posts.value.length - 1 : index)
    //getPosts(page.value)
  }

  const prevSlide = () => {
    if (curPage.value === 1) return

    onUpdateCurrentPage(curPage.value - 1)
    const index = curPage.value * (limit.value / 2) - 1
    slide(POST_EL.value, posts.value.length - 1 < index ? posts.value.length - 1 : index)
  }

  const getPosts = async (newPage) => {
    if (newPage === 1 || newPage % 2 === 0) {
      const { success, posts: newPosts, maxPage: newMaxPage } = await dispatch('post/getPosts', query)
      if (!success) throw new Error('게시물을 받아오는 도중 에러가 발생하였습니다.')

      maxPage.value = newMaxPage || maxPage.value
      newPage === 1
        ? posts.value.splice(0, limit.value, ...newPosts)
        : posts.value.splice(newPage * (limit.value / 2), limit.value, ...newPosts)
    }
  }

  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      // TRIGGER_EL.value가 보이지 않는다면 retrun
      if (!entry.isIntersecting) return

      console.log('아ㅣ무말')

      onUpdatePage(page.value === 1 ? page.value + 1 : page.value + 2)
      getPosts(page.value)
    })
  }

  const observer = new IntersectionObserver(callback, { threshold: 1.0 })

  watch(
    isMobile,
    (newIsMobile, prevIsMobile) => {
      if (newIsMobile && !prevIsMobile) {
        // PC -> Mobile로 갈 때
        onUpdatePage(page.value * 2 - 1)
        onUpdateCurrentPage(curPage.value * 2 - 1)
      } else if (!newIsMobile && prevIsMobile) {
        // Mobile -> PC로 갈 때
        posts.value = []
        onUpdatePage(1)
        onUpdateCurrentPage(1)
        getPosts(1)
      }

      const index = curPage.value * (limit.value / 2) - 1
      slide(POST_EL.value, posts.value.length - 1 < index ? posts.value.length - 1 : index)
    },
    { flush: 'post' }
  )

  watch(
    () => [props.menu, props.category, props.filter],
    () => {
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
      posts.value = []
      onUpdatePage(1)
      onUpdateCurrentPage(1)
      getPosts(1)
    }
  )

  onMounted(() => {
    observer.observe(TRIGGER_EL.value)
  })

  onUnmounted(() => {
    observer.disconnect()
  })

  await getPosts(1)
</script>

<style lang="scss" rel="stylesheet/scss">
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

    .wrap_btn_slidePage {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;

      .btn_prev,
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

      .btn_prev {
        left: -1.6rem;
      }

      .btn_next {
        margin-left: auto;
        left: 1.6rem;
      }
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
    overflow: -moz-scrollbars-none;
    scrollbar-width: none;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;

    li {
      margin: 0 2.4rem 0 0;
    }

    li:last-child {
      margin: 0;
    }
  }

  .wrap_slide_toolbar {
    display: flex;
    margin: 6.4rem 0 4rem;

    .slide_category,
    .slide_page {
      width: 50%;
    }

    .slide_category {
      font-size: 1.6rem;
      color: var(--primary-dark);
      letter-spacing: 0.2rem;
      text-transform: uppercase;
      position: relative;

      .category {
        padding-left: 1.6rem;
      }

      .category::before {
        content: '';
        position: absolute;
        width: 0.1rem;
        height: 1.6rem;
        background-color: var(--primary-dark);
        top: 0.6rem;
        left: 0;
      }
    }

    .slide_page {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 1.4rem;
      font-weight: 500;

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
