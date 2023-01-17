<template>
  <div class="home">
    <div class="recent_tranding">
      <h2 class="h2_recent_tranding">Tranding Posts</h2>
      <Suspense>
        <template #default>
          <Posts :menu="state.menu.menus.sol" :type="'recent'" :recent="true" />
        </template>
        <template #fallback>
          <span>게시물 로딩 중...</span>
        </template>
      </Suspense>
    </div>

    <h2 class="h2_recent_review_sol">Recent Review Posts by SOL</h2>
    <Suspense>
      <template #default>
        <Posts :menu="slideSolMenu" :type="'slide'" :recent="true" />
      </template>
      <template #fallback>
        <span>게시물 로딩 중...</span>
      </template>
    </Suspense>

    <h2 class="h2_recent_review_ming">Recent Review Posts by SOL</h2>
    <Suspense>
      <template #default>
        <Posts :menu="slideSolMenu" :type="'slide'" :recent="true" />
      </template>
      <template #fallback>
        <span>게시물 로딩 중...</span>
      </template>
    </Suspense>
  </div>
</template>

<script>
  import Posts from '../components/Posts.vue'
  import { defineComponent, ref, onBeforeMount, onErrorCaptured } from 'vue'
  import { useStore } from 'vuex'

  export default defineComponent({
    name: 'home',
    components: {
      Posts,
    },
    setup() {
      const { state } = useStore()
      const error = ref(null)
      const slideSolMenu = ref(null)
      const slideMingMenu = ref(null)

      const getSolMenu = (sub) => {
        slideSolMenu.value = state.menu.menus.sol.filter((main) => main.sub === sub)
      }

      const getMingMenu = (sub) => {
        slideMingMenu.value = state.menu.menus.ming.filter((main) => main.sub === sub)
      }

      onBeforeMount(() => {
        getSolMenu('album')
      })

      return { state, slideSolMenu }
    },
  })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .home {
    font-size: 1.4rem;
    color: var(--text-dark);

    h2 {
      margin: 6.4rem 0 3.2rem 0;
      color: var(--primary-dark);

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
  }
</style>
