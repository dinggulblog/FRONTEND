<template>
  <div class="home">
    <div class="recent_tranding">
      <h2 class="h2_recent_tranding">Tranding Posts</h2>
      <ul class="recent_tranding_sort_btns">
        <li>
          <Button class="btn_sort_view" :theme="trandingType === 'view' ? 'primary' : ''" @click="onChangeTrandingType('view')">조회수순</Button>
        </li>
        <li>
          <Button class="btn_sort_like" :theme="trandingType === 'like' ? 'primary' : ''" @click="onChangeTrandingType('like')">좋아요순</Button>
        </li>
      </ul>
      <Suspense>
        <template #default>
          <Posts :type="'recent'" :recent="true" v-model:sort="trandingType" />
        </template>
        <template #fallback>
          <ul :id="'recent'">
          <component v-for="skeleton in 6" :key="skeleton" :is="layouts['recent']"></component>
      </ul>
        </template>
      </Suspense>
    </div>

    <h2 class="h2_recent_review_sol">Recent Review Posts by SOL</h2>
    <Suspense>
      <template #default>
        <Posts :menu="slideSolMenu" :type="'slide'" :recent="true" />
      </template>
      <template #fallback>
        <ul :id="'slide'">
          <component v-for="skeleton in 4" :key="skeleton" :is="layouts['slide']"></component>
      </ul>
      </template>
    </Suspense>

    <h2 class="h2_recent_review_ming">Recent Review Posts by MING</h2>
    <Suspense>
      <template #default>
        <Posts :menu="slideMingMenu" :type="'slide'" :recent="true" />
      </template>
      <template #fallback>
        <ul :id="'slide'">
          <component v-for="skeleton in 4" :key="skeleton" :is="layouts['slide']"></component>
      </ul>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
  import { ref, onBeforeMount } from 'vue'
  import { useStore } from 'vuex'
  import Posts from '../components/Posts.vue'
  import slide from '../components/slots/Slide.vue'
  import recent from '../components/slots/Recent.vue'

  const { state } = useStore()
  const error = ref(null)
  const trandingType = ref('view')
  const slideSolMenu = ref(null)
  const slideMingMenu = ref(null)

  const onChangeTrandingType = (type) => {
    trandingType.value = type
  }

  const getSolMenu = (sub) => {
    slideSolMenu.value = state.menu.menus.sol.filter((main) => main.sub === sub)
  }

  const getMingMenu = (sub) => {
    slideMingMenu.value = state.menu.menus.ming.filter((main) => main.sub === sub)
  }

  const layouts = {
    slide: slide,
    recent: recent,
  }

  onBeforeMount(() => {
    getSolMenu('album')
    getMingMenu('album')
  })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .home {
    font-size: 1.4rem;
    color: var(--text3);

    h2 {
      margin: 6.4rem 0 3.2rem 0;
      color: var(--primary);

      &:first-child {
        margin: 0 0 3.2rem 0;
      }
    }

    &:deep(#recent) {
      display: flex;
      flex-wrap: wrap;
    }

    &:deep(.recent_item) {
      width: 56.4rem;
      margin-right: 2.4rem;

      @include tablet_landscape {
        width: calc(100% / 2 - 2.4rem);
        margin-right: 2.4rem;
      }

      @include tablet {
        width: 100%;
        margin-right: 0;
      }

      @include mobile {
        width: 100%;
        margin-right: 0;
      }

      &:nth-child(2n) {
        margin-right: 0;
      }
    }

    .recent_tranding_sort_btns {
      display: flex;
      margin-bottom: 3.2rem;

      li:first-child {
        margin-right: 0.8rem;
      }

      &:deep(.btn) {
        position: relative;

        &::after {
          padding-bottom: 2rem;
          border-bottom: solid 0.1rem var(--primary);
          content: '';
          inset: 0;
          position: absolute;
          transform: scaleX(0);
          transition: transform 0.25s ease-in;
          z-index: -1;
        }

        &:hover::after {
          transform: scaleX(1);
        }

      }

      .btn_sort_like {
        margin:0 0 0 0.4rem;
      }
    }
  }
</style>
