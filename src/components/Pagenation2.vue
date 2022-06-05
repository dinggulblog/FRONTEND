<template>
  <div class="page">
    <button class="prevBtn" @click="prevPage" :disabled="firstPageNum === 1" :style="firstPageNum !== 1 ? { color: 'var(--point)', cursor: 'pointer' } : { color: '#ddd', cursor: 'default' }">
      <i class="material-icons">arrow_back_ios_new</i>
      <span>이전</span>
    </button>

    <div class="pageList">
      <div class="pageBtn" ref="list">
        <router-link :to="{ name: 'posts', params: { menu: curRouteParams.menu, sub: curRouteParams.sub }, query: { pageNum: nowPageNum } }">
          <button
            v-for="page in pageList"
            :key="page"
            :style="page === nowPageNum ? { color: 'var(--point)', fontWeight: 'bold', borderBottom: '2px solid', borderColor: 'var(--point)' } : { color: 'var(--sub)' }"
            @click="nowPage(page)"
          >
            {{ page }}
          </button>
        </router-link>
      </div>
    </div>

    <button
      class="nextBtn"
      @click="nextPage"
      :disabled="totalPageNum === lastPageNum"
      :style="totalPageNum !== lastPageNum ? { color: 'var(--point)', cursor: 'pointer' } : { color: '#ddd', cursor: 'default' }"
    >
      <span>다음</span>
      <i class="material-icons">arrow_forward_ios</i>
    </button>
  </div>
</template>

<script>
import { ref, onMounted, computed, onUnmounted, onBeforeMount, nextTick } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'post',
  components: {},
  setup() {
    const route = useRoute()
    const curRouteParams = computed(() => route.params)

    const nowPageNum = ref(1)
    const nowPage = (page) => {
      nowPageNum.value = page
    }

    const totalPageNum = ref()
    const pageViewNum = ref(48)

    const PageGroupNum = ref(Math.ceil(nowPageNum.value / pageViewNum.value))

    const firstPageNum = ref(1)
    const lastPageNum = ref(PageGroupNum.value * pageViewNum.value)

    const pageList = ref([])
    const pageListSet = () => {
      for (let i = firstPageNum.value; i <= lastPageNum.value; i++) {
        pageList.value.push(i)
      }
    }
    pageListSet()

    const prevPage = () => {
      lastPageNum.value = lastPageNum.value - pageViewNum.value
      firstPageNum.value = lastPageNum.value - pageViewNum.value + 1

      pageList.value = []
      pageListSet()
    }

    const nextPage = () => {
      firstPageNum.value = lastPageNum.value + 1
      lastPageNum.value = lastPageNum.value + pageViewNum.value
      totalPageNum.value = lastPageNum.value

      pageList.value = []
      pageListSet()
    }

    const list = ref(null)
    let listScrollWidth = 0
    let listClientWidth = 0

    let startX = 0
    let nowX = 0
    let listX = 0

    onBeforeMount(() => {
      nextTick(() => {
        listScrollWidth = list.value.scrollWidth
        listClientWidth = list.value.clientWidth
      })
    })

    onMounted(() => {
      list.value.addEventListener('mousedown', addEvent)
    })

    onUnmounted(() => {
      //list.value.removeEventListener('mousedown', addEvent)
      document.removeEventListener('mouseup', scrollend)
    })

    const addEvent = (event) => {
      startX = event.clientX
      event.preventDefault()
      listX = getTranslateX()
      list.value.addEventListener('click', onClick)
      document.addEventListener('mousedown', mousedown)
      document.addEventListener('mousemove', mousemove)
      document.addEventListener('mouseup', scrollend)
    }

    const getTranslateX = () => {
      return parseInt(getComputedStyle(list.value).transform.split(/[^\-0-9]+/g)[5])
    }

    const mousedown = (event) => {
      startX = event.clientX
    }

    const mousemove = (event) => {
      nowX = event.clientX
      translate()
    }

    const translate = () => {
      list.value.style.transform = 'translateX(' + (listX + nowX - startX) + 'px)'
    }

    const scrollend = () => {
      listX = getTranslateX()
      document.removeEventListener('mousedown', mousedown)
      document.removeEventListener('mousemove', mousemove)
      list.value.removeEventListener('click', onClick)

      if (listX > 0) {
        list.value.style.transform = 'translateX(' + 0 + 'px)'
        list.value.style.transition = 'all 0.25s ease'
      } else if (listX < listClientWidth - listScrollWidth) {
        list.value.style.transform = 'translateX(' + (listClientWidth - listScrollWidth) + 'px)'
        list.value.style.transition = 'all 0.25s ease'
      }
    }

    const onClick = (event) => {
      if (startX.value - nowX.value !== 0) {
        event.preventDefault()
      }
    }

    return {
      prevPage,
      nextPage,
      nowPageNum,
      pageList,
      nowPage,
      lastPageNum,
      firstPageNum,
      totalPageNum,
      list,
      curRouteParams,
    }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  display: grid;
  grid-template-columns: auto 1fr auto;
  margin: 4.8rem 0;
  color: var(--primary);
  font-size: 1.4rem;
  font-weight: 500;
  align-items: center;
  max-width: 100%;
  gap: 0 3rem;

  button.prevBtn {
    grid-column: 1 / 2;
    display: grid;
    grid-template-columns: repeat(2, auto);
    align-items: center;
  }

  div.pageList {
    grid-column: 2 / 3;
    display: grid;
    align-items: center;
    padding: 2rem 0;
    overflow: hidden;
    position: relative;
    max-width: 100%;

    .pageBtn {
      transform: translateX(0px);
      width: 100%;
      position: absolute;
      white-space: nowrap;
      transition: all 1s ease;

      button {
        transition: all 0.3s ease;
        margin: 0 1.5rem;
        width: 2.5rem;
        height: 2.5rem;
      }

      button:hover {
        transform: translateY(-0.5rem);
        transition: all 0.3s ease;
      }
    }
  }

  button.nextBtn {
    grid-column: 3 / 4;
    display: grid;
    grid-template-columns: repeat(2, auto);
    align-items: center;

    i {
      margin-left: 1.5rem;
    }
  }
}
</style>
