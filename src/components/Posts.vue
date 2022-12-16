<template>
  <div v-if="type === 'slide' && category">
    <p>카테고리 : {{ category }}</p>
    <p>현재 페이지는 ? {{ nowPage }}</p>
    <p>전체 페이지는 ? {{ totalPage }}</p>
  </div>
  <div class="posts">
    <div v-if="posts?.length">
      <ul :id="type">
        <template v-for="post in posts" :key="post._id">
          <PostSlot :type="type" :post="post" :isLike="post.likes?.includes(userId)"></PostSlot>
        </template>
      </ul>
    </div>

    <div v-else class="empty">
      <span>There is no posts.</span>
    </div>

    <div v-if="type === 'slide'" class="wrap_btn_slidePage">
      <Button
        v-if="nowPage !== 1"
        :class="'btn_prev'"
        :size="'md'"
        :svg="'arrow-left'"
        :bgColor="'primary'"
        :customColor="'#fff'"
        :customPadding="'0'"
        @click="prevSlide"
      />
      <Button
        v-if="posts?.length > nowItem + targetItem"
        :class="'btn_next'"
        :size="'md'"
        :svg="'arrow-right'"
        :bgColor="'primary'"
        :customColor="'#fff'"
        :customPadding="'0'"
        @click="nextSlide"
      />
    </div>

    <Pagenation v-if="type !== 'slide'" :page="page" :maxPage="maxPage" @updatePage="onUpdatePage" />
  </div>
</template>

<script>
  import { computed, toRefs, ref, onBeforeMount } from 'vue'
  import { useStore } from 'vuex'
  import { useMedia } from '../common/mediaQuery'
  import PostSlot from './slots/PostSlot.vue'
  import Pagenation from '../components/Pagenation.vue'

  export default {
    name: 'posts',
    components: {
      PostSlot,
      Pagenation,
    },
    props: {
      type: {
        type: String,
        default: 'List',
      },
      user: {
        type: Object,
        default: () => ({}),
      },
      category: {
        type: String,
      },
    },
    setup(props) {
      const { state, commit } = useStore()
      const { _id: userId } = toRefs(props.user)

      const posts = computed(() => state.post.posts)
      const page = computed(() => state.post.page)
      const maxPage = computed(() => state.post.maxPage)

      const onUpdatePage = (page) => commit('post/SET_PAGE', page)

      const nowPage = ref(1)
      const totalPage = ref()

      let nowItem = ref(1)
      let targetItem = ref(4)

      const nextSlide = (event) => {
        const container = event.currentTarget.parentNode.previousSibling.querySelector('#slide')
        const moveItem = event.currentTarget.parentNode.previousSibling.querySelector(
          `#slide :nth-child(${nowItem.value + targetItem.value})`
        )
        const x = moveItem.getBoundingClientRect().left
        container.scrollTo({ left: x, behavior: 'smooth' })
        nowItem.value = nowItem.value + targetItem.value
        nowPage.value = nowPage.value + 1
      }

      const prevSlide = (event) => {
        const container = event.currentTarget.parentNode.previousSibling.querySelector('#slide')
        const moveItem = event.currentTarget.parentNode.previousSibling.querySelector(
          `#slide :nth-child(${nowItem.value - targetItem.value})`
        )
        const x = moveItem.getBoundingClientRect().left
        container.scrollTo({ left: x, behavior: 'smooth' })
        nowItem.value = nowItem.value - targetItem.value
        nowPage.value = nowPage.value - 1
      }

      return {
        userId,
        posts,
        page,
        maxPage,
        nowPage,
        totalPage,
        nowItem,
        targetItem,
        onUpdatePage,
        nextSlide,
        prevSlide,
      }
    },
  }
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
    margin: 0 0 2.4rem;
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
</style>
