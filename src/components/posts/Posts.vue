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
        v-show="page < maxPage"
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

  <Pagenation v-if="type !== 'slide'" :page="page" :maxPage="maxPage" @updatePage="onUpdatePage" />
</template>

<script setup>
  import { defineProps, ref, computed, watch } from 'vue'
  import { useStore } from 'vuex'
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

  let nowItem = 1
  let limit = 4

  const POST_EL = ref(null)
  const page = ref(1)
  const maxPage = ref(1)
  const posts = ref(new Map())
  const currentMenus = computed(() => state.menu.currentMenus?.map((menu) => menu._id))

  const getPosts = async (payload) => {
    const { success, posts: Posts, maxPage: MaxPage } = await dispatch('post/getPosts', payload)
    if (success) {
      maxPage.value = MaxPage
      posts.value.set(page.value, Posts)
    }
  }

  const onUpdatePage = async (updatePage) => {
    page.value = updatePage
    await getPosts({
      page: page.value,
      limit: limit,
      menu: currentMenus.value,
      category: props.category,
      hasThumbnail: props.type === 'slide' ? true : false,
    })
  }

  const nextSlide = async () => {
    if (page.value === maxPage.value || !POST_EL.value) return
    nowItem = nowItem + limit
    await onUpdatePage(page.value + 1)

    const x = POST_EL.value.children.item(nowItem)?.getBoundingClientRect()?.left
    POST_EL.value.scrollTo({ left: x, behavior: 'smooth' })
  }

  const prevSlide = async () => {
    if (page.value === 1 || !POST_EL.value) return
    nowItem = nowItem - limit
    await onUpdatePage(page.value - 1)

    const x = POST_EL.value.children.item(nowItem)?.getBoundingClientRect()?.left
    POST_EL.value.scrollTo({ left: x, behavior: 'smooth' })
  }

  watch(
    () => [props.main, props.sub, props.category],
    async () => {
      page.value = 1
      posts.value.clear()

      await getPosts({
        page: page.value,
        limit: limit,
        menu: currentMenus.value,
        category: props.category,
        hasThumbnail: props.type === 'slide' ? true : false,
      })
    }
  )

  // Create Hook
  await getPosts({
    page: page.value,
    limit: limit,
    menu: currentMenus.value,
    category: props.category,
    hasThumbnail: props.type === 'slide' ? true : false,
  })
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
