<template>
 
  <!-- Slide toolbar -->
  <div class="wrap_slide_toolbar" v-if="!recent">
    <div class="slide_category">
      <span class="category">{{ category }}</span>
    </div>
    <div class="slide_page" v-if="!isMobileDevices">
      <span class="nowPage">{{ slidePage }}</span>
      <span class="maxPage">{{ slideMaxPage }}</span>
    </div>
  </div>

  <!-- Slide button -->
  <div class="wrap_btn_slidePage">
    <Button
      v-if="slidePage !== 1"
      class="btn_old"
      :svg="'arrow-left'"
      @click="prevSlide"
      aria-label="prevSlide"
    />
    <Button
      v-if="slidePage !== slideMaxPage"
      class="btn_next"
      :svg="'arrow-right'"
      @click="nextSlide"
      aria-label="nextSilde"
    />
  </div>

</template>

<script setup>
  import { inject, ref, toRefs, computed, watch } from 'vue'

  const props = defineProps({
    category: {
      type: String,
      default: '전체',
    },
    maxCount: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 10,
    },
    target: {
      type: Object
    },
    recent: {
      type: Boolean,
      default: false,
    },
  })
  const { maxCount, limit, target } = toRefs(props)

  const isDesktop = inject('isDesktop')
  const isMobileDevices = inject('isMobileDevices')

  const slidePage = ref(1) // 현재 보고 있는 페이지
  const slideIndex = ref(0) // 슬라이드 인덱스
  const slideLimit = computed(() => (isDesktop.value ? limit.value / 2 : limit.value / 4)) // 한 번의 슬라이드에 넘길 게시물 갯수
  const slideMaxPage = computed(() => Math.ceil(maxCount.value / slideLimit.value))        // 슬라이드 가능한 페이지 상한값
  const slideRest = computed(() => slideMaxPage.value * slideLimit.value - maxCount.value) // 슬라이드 마지막 페이지에 모자란 게시물 갯수

  const onUpdateSlidePage = (updatePage) => {
    if (slideMaxPage.value < updatePage) return
    slidePage.value = updatePage
  }

  const slide = (idx) => {
    const child = target.value.querySelector(`li[data-index="${idx}"]`)
    if (!child) return

    const parent = target.value.getBoundingClientRect().left
    const x = child.getBoundingClientRect().left - parent

    target.value.style.transform = `translateX(-${x}px)`
    target.value.style.transition = 'all 0.3s'
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
    slideIndex.value = idx
    slide(slideIndex.value)
  }

  // Slide index is - ... 12, 8, 4, 0
  const prevSlide = () => {
    if (slidePage.value === 1) return

    onUpdateSlidePage(slidePage.value - 1)
    //const idx = slidePage.value !== 1 ? (slidePage.value - 1) * slideLimit.value - slideRest.value : 0
    const idx = (slidePage.value - 1) * slideLimit.value
    slideIndex.value = idx
    slide(slideIndex.value)
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
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .wrap_slide_toolbar {
    display: flex;
    margin: 0 0 4rem;

    .slide_category {
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
          top: 0.15rem;
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

  .wrap_btn_slidePage {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 28.5rem;
      display: flex;
      align-items: center;

      @include mobile {
        height: 26rem;
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
        top:-3.2rem;
        z-index: 10;
        background: var(--primary);
        color:#fff;

        @include mobile {
          top:-5rem;
        }
      }

      .btn_old {
        left: -1.6rem;
      }

      .btn_next {
        margin-left: auto;
        left: 1.6rem;
      }
    }
</style>
