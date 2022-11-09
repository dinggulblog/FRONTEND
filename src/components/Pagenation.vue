<template>
  <div class="page" :style="{ gridTemplateColumns: `auto 800px auto` }">

    <!-- Prev page button -->
    <button class="prev-btn" @click="onPrevPage" :style="page - skip < 1 ? { color: 'var(--sub)' } : { color: 'var(--point)' }">
      <i class="material-icons">arrow_back_ios_new</i>
      <span>PREV</span>
    </button>

    <!-- Page button lists -->
    <div class="pages">
      <div class="page-btns">
        <button
          v-for="p in pages"
          v-text="p"
          :key="p"
          :style="p === page ? { color: 'var(--point)', fontWeight: 'bold', borderBottom: '2px solid', borderColor: 'var(--point)' } : { color: 'var(--sub)' }"
          @click="onUpdatePage(p)"
        ></button>
      </div>
    </div>

    <!-- Next page button -->
    <button class="next-btn" @click="onNextPage" :style="maxPage < (pageStart + 1) * skip + 1 ? { color: 'var(--sub)' } : { color: 'var(--point)' }">
      <span>NEXT</span>
      <i class="material-icons">arrow_forward_ios</i>
    </button>

  </div>
</template>

<script>
import { ref, watchEffect } from 'vue'

export default {
  props: {
    page: {
      type: Number, // 현재 보고 있는 페이지
      default: 1,
    },
    maxPage: {
      type: Number, // Maht.ceil(총 게시물 갯수 / limit)
      default: 1,
    },
  },
  setup(props, { emit }) {
    const pageStart = ref(0)
    const skip = ref(5) // Next or Prev button 눌렀을 때 넘어가는 페이지 단위
    const pages = ref(new Set([]))

    const onUpdatePage = (page) => {
      emit('updatePage', page)
    }

    const onPrevPage = () => {
      if (props.page < skip.value + 1) return
      resetPages(--pageStart.value, props.maxPage)
      onUpdatePage(pageStart.value * skip.value + 1)
    }

    const onNextPage = () => {
      if (props.maxPage < (pageStart.value + 1) * skip.value + 1) return
      resetPages(++pageStart.value, props.maxPage)
      onUpdatePage(pageStart.value * skip.value + 1)
    }

    const resetPages = (start, max) => {
      const offset = Math.min(max, skip.value * (start + 1))

      pages.value.clear()
      for (let i = skip.value * start; i < offset; i++) pages.value.add(i + 1)
    }

    // maxPage가 바뀌면 실행(route가 변경된 경우)
    watchEffect(() => {
      onUpdatePage(1)
      resetPages((pageStart.value = 0), props.maxPage)
    })

    return {
      pageStart,
      skip,
      pages,
      onUpdatePage,
      onPrevPage,
      onNextPage,
    }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  display: grid;
  margin: 4.8rem 0 0;
  color: var(--primary);
  font-size: 1.4rem;
  font-weight: 500;
  align-items: center;

  button.prev-btn {
    display: grid;
    grid-column: 1 / 2;
    grid-template-columns: repeat(2, auto);
    align-items: center;
    color: var(--point);
    cursor: pointer;
    justify-content: end;
  }

  button.next-btn {
    display: grid;
    grid-column: 3 / 4;
    grid-template-columns: repeat(2, auto);
    align-items: center;
    color: var(--point);
    cursor: pointer;
    justify-content: start;

    i {
      margin-left: 1.5rem;
      margin-right: 0;
    }
  }

  div.pages {
    grid-column: 2 / 3;
    display: grid;
    align-items: center;
    padding: 2rem 0;
    overflow: hidden;
    position: relative;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;

    .page-btns {
      overflow: hidden;
      button {
        margin: 0 1.6rem;
        width: 2.5rem;
        height: 2.5rem;
      }

      button:hover {
        transform: translateY(-0.5rem);
        transition: all 0.3s ease;
      }
    }
  }
}
</style>
