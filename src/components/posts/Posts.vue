<template>
  <!-- Slide toolbar -->
  <div v-if="type === 'slide'" class="wrap_slide_toolbar">
    <div class="slide_category">
      <span class="category">{{ category }}</span>
    </div>
    <div class="slide_page">
      <span class="nowPage">{{ page + 1 }}</span>
      <span class="maxPage">{{ maxPage || 1 }}</span>
    </div>
  </div>

  <!-- List of Posts -->
  <div class="posts">
    <div>
      <ul :id="type" ref="POST_EL">
        <transition-group
          name="fade"
          @before-enter="beforeEnter"
          @after-enter="afterEnter"
          @enter-cancelled="afterEnter"
        >
          <template v-for="[key, value] in posts" :key="key">
            <template v-for="(post, index) in value" :key="post._id">
              <PostSlot :type="type" :post="post" @commitPosts="onCommitPosts" :data-index="index"></PostSlot>
            </template>
          </template>
        </transition-group>
        <div v-show="type !== 'slide'" ref="TRIGGER_EL" style="width: 100%">이게 보이면 게시물 더 받아오기</div>
      </ul>
    </div>

    <!-- Slide buttons -->
    <div v-if="type === 'slide'" class="wrap_btn_slidePage">
      <Button
        v-show="page !== 0"
        class="btn_prev"
        size="md"
        svg="arrow-left"
        bgColor="primary"
        customColor="#fff"
        customPadding="0"
        @click="prevSlide"
      />
      <Button
        v-show="maxPage > page + 1"
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
  import { defineProps, ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
  import { useStore } from 'vuex'
  import { useMedia } from '../../common/mediaQuery'
  import PostSlot from '../slots/PostSlot.vue'

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
  const isMobile = useMedia('only screen and (max-width: 1023px)')
  const options = {
    threshold: 1.0,
  }

  let nowItem = 1
  let limit = 4
  const page = ref(0)
  const maxPage = ref(1)
  const posts = ref(new Map())
  const POST_EL = ref(null)
  const TRIGGER_EL = ref(null)
  const isShowTrigger = ref(false)

  const query = reactive({
    limit: isMobile.value ? limit : limit * 2,
    menu: computed(() => state.menu.currentMenus?.map((menu) => menu._id)),
    skip: computed(() => (isMobile.value ? page.value * 2 : page.value * 4)),
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

  const onUpdatePage = async (updatePage) => {
    page.value = updatePage
    if (updatePage % 2 === 0) getPosts({ payload: query, currentPage: updatePage })
  }

  const nextSlide = async () => {
    if (page.value + 1 === maxPage.value || !POST_EL.value) return
    nowItem = isMobile.value ? nowItem + limit / 2 : nowItem + limit
    const parentX = POST_EL.value.getBoundingClientRect()?.left
    const x = POST_EL.value.children.item(nowItem)?.getBoundingClientRect()?.left - parentX
    POST_EL.value.scrollBy({ left: x, behavior: 'smooth' })
    onUpdatePage(page.value + 1)
  }

  const prevSlide = async () => {
    if (page.value === 0 || !POST_EL.value) return
    nowItem = isMobile.value ? nowItem - limit / 2 : nowItem - limit
    const parentX = POST_EL.value.getBoundingClientRect()?.left
    const x = POST_EL.value.children.item(nowItem)?.getBoundingClientRect()?.left - parentX
    POST_EL.value.scrollBy({ left: x, behavior: 'smooth' })
    onUpdatePage(page.value - 1)
  }

  const getPosts = async ({ payload, currentPage }) => {
    const { success, posts: newPosts, maxPage: newMaxPage } = await dispatch('post/getPosts', payload)
    console.log(newPosts, newMaxPage)
    if (success && Array.isArray(newPosts)) {
      maxPage.value = newMaxPage
      posts.value.set(currentPage + 1, newPosts.slice(0, limit))
      posts.value.set(currentPage + 2, newPosts.slice(limit))
    }
  }

  const callback = (entries, observer) => {
    entries.forEach(async (entry) => {
      // TRIGGER_EL.value가 보이지 않는다면 retrun
      if (!entry.isIntersecting) {
        return
      }
      // TRIGGER_EL.value가 보였다면 page+2(page가 1일때만 +1)
      isShowTrigger.value = true
      onUpdatePage(page.value + 2)
      isShowTrigger.value = false
    })
  }

  const observer = new IntersectionObserver(callback, options)

  await getPosts({ payload: query, currentPage: 0 })

  watch(
    () => [query.menu, props.category],
    () => {
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
      posts.value.clear()
      onUpdatePage(0)
    }
  )

  onMounted(() => {
    observer.observe(TRIGGER_EL.value)
  })

  onUnmounted(() => {
    observer.disconnect()
  })
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
    overflow-x: auto;
    margin: 0 0 9.6rem;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    scrollbar-width: none;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    white-space: nowrap;

    &::-webkit-scrollbar {
      display: none;
    }

    li {
      margin: 0 2.4rem 0 0;
    }

    li:nth-last-child(2) {
      margin: 0;
    }
  }

  .wrap_slide_toolbar {
    display: flex;
    margin: 0 0 4rem;

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
