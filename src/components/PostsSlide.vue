<template>
  <!-- Slide toolbar -->
  <div class="wrap_slide_toolbar">
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
    <Posts :type="'slide'" :menu="menu" :category="category" :userId="userId"/>
    
    <!-- Slide buttons -->
    <div class="wrap_btn_slidePage">
      <Button
        v-show="slidePage !== 1 && !isAllMobileDevice"
        class="btn_old"
        :size="'md'"
        :svg="'arrow-left'"
        @click="prevSlide"
      />
      <Button
        v-show="slidePage < slideMaxPage && !isAllMobileDevice"
        class="btn_next"
        :svg="'arrow-right'"
        @click="nextSlide"
      />
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive, computed, watch, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import { useMedia } from '../common/mediaQuery'
  import Posts from './Posts.vue'
  const props = defineProps({
    menu: {
      type: Array,
      default: () => [],
    },
    category: {
      type: String,
      default: '전체',
    },
    userId: {
      type: String,
      required: false,
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

  const maxCount = ref(1) // 전체 게시물 갯수
  const limit = computed(() => (props.recent ? 6 : 12)) // 한 번의 요청에 받아올 게시물 갯수


  /* Slide 변수 */
  const slidePage = ref(1) // 현재 보고 있는 페이지
  const slideIndex = ref(0) // 슬라이드 인덱스
  const slideLimit = computed(() => (isDesktop.value ? limit.value / 2 : limit.value / 4)) // 한 번의 슬라이드에 넘길 게시물 갯수
  const slideMaxPage = computed(() => Math.ceil(maxCount.value / slideLimit.value)) // 슬라이드 가능한 페이지 상한값
  const slideRest = computed(() => slideMaxPage.value * slideLimit.value - maxCount.value) // 슬라이드 마지막 페이지에 모자란 게시물 갯수
  /* Slide 변수 끝 */

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

  onMounted(() => {
    getDevice()
  })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
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
        background: var(--primary);
        color:#fff;
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
      color: var(--text3);
      text-transform: capitalize;
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
      color: var(--primary);
      text-transform: uppercase;
      position: relative;

      .category {
        padding-left: 1.6rem;

        &::before {
          content: '';
          position: absolute;
          width: 0.1rem;
          height: 1.6rem;
          background-color: var(--primary);
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
        color: var(--primary);
      }

      .maxPage {
        color: var(--text2);

        &::before {
          content: '/';
          margin: 0 0.8rem;
        }
      }
    }
  }
</style>
