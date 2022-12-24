<template>
  <div v-if="type === 'slide'" class="wrap_slide_toolbar">
    <div class="slide_category">
      <span class="category">{{ category }}</span>
    </div>
    <div class="slide_page">
      <span class="nowPage">{{ page }}</span>
      <span class="maxPage">{{ maxPage }}</span>
    </div>
  </div>

  <div class="posts">
    <div>
      <ul :id="type" ref="POST_EL">
        <template v-for="[key, value] in posts" :key="key">
          <template v-for="post in value" :key="post._id">
            <PostSlot :type="type" :post="post"></PostSlot>
          </template>
        </template>
        <div
          v-show="type !== 'slide'"
          :style="{ display: displayTrigger ? 'block' : 'none' }"
          ref="trigger"
          style="width: 100%"
        >
          이게 보이면 게시물 더 받아오기
        </div>
      </ul>
    </div>

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
  import { defineProps, ref, computed, watch, reactive, onMounted, onUnmounted } from 'vue'
  import { useStore } from 'vuex'
  import { useMedia } from '../../common/mediaQuery'
  import PostSlot from '../slots/PostSlot.vue'
  import Pagenation from '../Pagenation.vue'

  const { state, dispatch } = useStore()
  const props = defineProps({
    main: {
      type: String,
      required: true,
    },
    sub: {
      type: String,
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
  })

  const isMobile = useMedia('only screen and (max-width: 1023px)')

  let nowItem = 1
  let limit = 4

  const POST_EL = ref(null)
  const page = ref(1)
  const maxPage = ref(1)
  const posts = ref(new Map())
  const currentMenus = computed(() => state.menu.currentMenus?.map((menu) => menu._id))

  const query = reactive({
    skip: computed(() => (page.value === 1 ? 0 : page.value * 4)),
    limit: limit * 2,
    menu: currentMenus.value,
    category: props.category,
    hasThumbnail: props.type === 'slide' ? true : false,
  })

  const getPosts = async (payload) => {
    const { success, posts: Posts, maxPage: MaxPage } = await dispatch('post/getPosts', payload)
    if (success) {
      maxPage.value = MaxPage * 2

      if (page.value === 1) {
        posts.value.set(page.value, Posts.slice(0, limit))
        posts.value.set(page.value + 1, Posts.slice(limit))
      } else {
        posts.value.set(page.value + 1, Posts.slice(0, limit))
        posts.value.set(page.value + 2, Posts.slice(limit))
      }
    }
  }

  const onUpdatePage = (updatePage) => {
    page.value = updatePage
  }

  const onUpdatePageGetPosts = async (updatePage) => {
    page.value = updatePage
    if (page.value % 2 === 0) await getPosts(query)
  }

  const nextSlide = async () => {
    if (page.value === maxPage.value || !POST_EL.value) return

    nowItem = isMobile ? nowItem + limit / 2 : nowItem + limit
    const x = POST_EL.value.children.item(nowItem)?.getBoundingClientRect()?.left
    POST_EL.value.scrollTo({ left: x, behavior: 'smooth' })

    await onUpdatePageGetPosts(page.value + 1)
  }

  const prevSlide = () => {
    if (page.value === 1 || !POST_EL.value) return

    nowItem = isMobile ? nowItem - limit / 2 : nowItem - limit
    const x = POST_EL.value.children.item(nowItem)?.getBoundingClientRect()?.left
    POST_EL.value.scrollTo({ left: x, behavior: 'smooth' })

    onUpdatePage(page.value - 1)
  }

  watch(
    () => [props.main, props.sub, props.category],
    async () => {
      onUpdatePage(1)
      posts.value.clear()

      await getPosts(query)
    }
  )

  const trigger = ref(null)
  const displayTrigger = ref(false)

  const options = {
    threshold: 1.0,
  }

  const callback = (entries, observer) => {
    entries.forEach(async (entry) => {
      /* trigger.value가 보이지 않는다면 retrun */
      if (!entry.isIntersecting) {
        return
      }
      /* trigger.value가 보였다면 page + 1 이후 getPosts() */
      displayTrigger.value = true
      await onUpdatePageGetPosts(page.value + 1)
      displayTrigger.value = false
    })
  }

  const observer = new IntersectionObserver(callback, options)

  onMounted(() => {
    observer.observe(trigger.value)
  })

  onUnmounted(() => {
    observer.disconnect()
  })

  // Create Hook
  await getPosts(query)
</script>

<style lang="scss" rel="stylesheet/scss">
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

    & > li {
      margin: 0 2.4rem 0 0;
    }

    & > li:last-child {
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
