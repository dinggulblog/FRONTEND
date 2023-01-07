<template>
  <!-- Slide toolbar -->
  <div v-if="type === 'slide'" class="wrap_slide_toolbar">
    <div class="slide_category">
      <span class="category">{{ category }}</span>
    </div>
    <div class="slide_page">
      <span class="nowPage">{{ page }}</span>
      <span class="maxPage">{{ maxPage }}</span>
    </div>
  </div>

  <!-- List of Posts -->
  <div class="posts">
    <ul style="overflow: hidden">
      <div :id="type" ref="POST_EL">
        <transition-group
          name="fade"
          @before-enter="beforeEnter"
          @after-enter="afterEnter"
          @enter-cancelled="afterEnter"
        >
          <template v-for="[key, value] in posts" :key="key">
            <template v-for="(post, index) in value" :key="post._id">
              <PostSlot
                :type="type"
                :post="post"
                :data-index="index"
                :page-index="key"
                @commitPosts="onCommitPosts"
              ></PostSlot>
            </template>
          </template>
        </transition-group>
      </div>
    </ul>

    <div v-show="type !== 'slide'" ref="TRIGGER_EL" style="width: 100%">이게 보이면 게시물 더 받아오기</div>

    <!-- Slide buttons -->
    <div v-if="type === 'slide'" class="wrap_btn_slidePage">
      <Button
        v-show="page !== 1"
        class="btn_prev"
        size="md"
        svg="arrow-left"
        bgColor="primary"
        customColor="#fff"
        customPadding="0"
        @click="prevSlide"
      />
      <Button
        v-show="maxPage > page"
        class="btn_next"
        size="md"
        svg="arrow-right"
        bgColor="primary"
        customColor="#fff"
        customPadding="0"
        @click="nextSlide"
      />
    </div>
  </div>
</template>

<script setup>
  import { defineProps, ref, reactive, computed, watch, onMounted, onBeforeUnmount, onUnmounted } from 'vue'
  import { useStore } from 'vuex'
  import { useMedia } from '../common/mediaQuery'
  import PostSlot from './slotdata/PostSlot.vue'

  const props = defineProps({
    type: {
      type: String,
      default: 'list',
      validator: (value) => ['list', 'card', 'slide'].includes(value),
    },
    category: {
      type: String,
      default: '전체',
    },
  })
  const { state, commit, dispatch } = useStore()
  const isAllMobile = useMedia('only screen and (max-width: 1199px)')
  const isTablet = useMedia('only screen and (max-width: 1023px)')
  const isMobile = useMedia('only screen and (max-width: 767px)')
  const options = {
    threshold: 1.0,
  }

  let limit = isAllMobile.value ? 2 : 4

  const page = ref(1)
  const maxPage = ref(1)
  const posts = ref(new Map())

  const POST_EL = ref(null)
  const TRIGGER_EL = ref(null)

  const query = reactive({
    limit: limit,
    menu: computed(() => state.menu.currentMenus?.map((menu) => menu._id)),
    skip: computed(() => (page.value === 1 ? 0 : isAllMobile.value ? page.value * 2 : page.value * 4)),
    category: computed(() => props.category),
    hasThumbnail: computed(() => props.type === 'slide'),
  })

  const beforeEnter = (el) => {
    el.style.transitionDelay = 200 * parseInt(el.dataset.index, 10) + 'ms'
  }

  const afterEnter = (el) => {
    el.style.transitionDelay = ''
  }

  const onCommitPosts = () => {
    commit('post/SET_POSTS', posts.value)
  }

  const onUpdatePage = (updatePage) => {
    page.value = updatePage
  }

  const nextSlide = () => {
    if (page.value === maxPage.value || !POST_EL.value) return
    const target = POST_EL.value.querySelector(`li[page-index="${page.value + 1}"]`)
    const parent = POST_EL.value.getBoundingClientRect()?.left
    const x = target?.getBoundingClientRect()?.left - parent
    //POST_EL.value.scrollTo({ left: x * page.value, behavior: 'smooth' })
    POST_EL.value.style.transform = `translateX(-${x}px)`
    POST_EL.value.style.transition = 'all 0.3s'
    onUpdatePage(page.value + 1)
  }

  const prevSlide = () => {
    if (page.value === 1 || !POST_EL.value) return
    const target = POST_EL.value.querySelector(`li[page-index="${page.value - 1}"]`)
    const parent = POST_EL.value.getBoundingClientRect()?.left
    const x = target?.getBoundingClientRect()?.left - parent
    //POST_EL.value.scrollBy({ left: x, behavior: 'smooth' })
    POST_EL.value.style.transform = `translateX(-${x}px)`
    POST_EL.value.style.transition = 'all 0.3s'
    onUpdatePage(page.value - 1)
  }

  const getPosts = async (page) => {
    const { success, posts: newPosts, maxPage: newMaxPage } = await dispatch('post/getPosts', query)
    if (!success) throw new Error('게시물을 받아오는 도중 에러가 발생하였습니다.')

    maxPage.value = newMaxPage ? newMaxPage : maxPage.value

    if (page === 1) {
      posts.value.set(page, newPosts.slice(0, limit))
      posts.value.set(page + 1, newPosts.slice(limit))
    } else {
      posts.value.set(page + 1, newPosts.slice(0, limit))
    }
    console.log(posts.value)
  }

  const callback = (entries, observer) => {
    entries.forEach(async (entry) => {
      if (!entry.isIntersecting) return // TRIGGER_EL.value가 보이지 않는다면 retrun

      onUpdatePage(page.value + 1) // TRIGGER_EL.value가 보였다면 page+2(page가 1일때만 +1)
    })
  }

  const observer = new IntersectionObserver(callback, options)

  const stop = watch(page, (newPage, prevPage) => {
    if (newPage === 1 || newPage > prevPage) getPosts(newPage)
  })

  watch([isAllMobile, isTablet, isMobile], () => {
    const target = POST_EL.value.querySelector(`li[page-index="${page.value}"]`)
    const parent = POST_EL.value.getBoundingClientRect()?.left
    const x = target?.getBoundingClientRect()?.left - parent
    POST_EL.value.style.transform = `translateX(-${x}px)`
  })

  watch(
    () => [query.menu, props.category],
    () => {
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
      posts.value.clear()
      onUpdatePage(1)
    }
  )

  onMounted(() => {
    observer.observe(TRIGGER_EL.value)
  })

  onBeforeUnmount(() => {
    stop()
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

    &::-webkit-scrollbar {
      display: none;
    }

    li {
      margin: 0 2.4rem 0 0;
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
