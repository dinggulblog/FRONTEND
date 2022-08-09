<template>
  <div class="page">
    <!-- Prev page button -->
    <button class="prev-btn" @click="onPrevPage">
      <i class="material-icons">arrow_back_ios_new</i>
      <span>PREV</span>
    </button>

    <!-- Page button lists -->
    <div class="pages">
      <div class="page-btns" ref="pageBtns">
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
    <button class="next-btn" @click="onNextPage">
      <span>NEXT</span>
      <i class="material-icons">arrow_forward_ios</i>
    </button>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watchEffect } from 'vue'

export default {
  props: {
    page: {
      type: Number,
      default: 1,
    },
    limit: {
      type: Number,
      default: 10,
    },
    maxPage: {
      type: Number,
      default: 1,
    },
  },
  setup(props, { emit }) {
    const { value: skip } = ref(5)
    const pageBtns = ref(null)
    const pages = ref(new Set([]))

    const onUpdatePage = (updatedPage) => {
      emit('updatePage', { updatedPage })
    }

    const onPrevPage = () => {
      if (props.page - skip < 1) return
      emit('updatePage', { updatedPage: props.page - skip })
    }

    const onNextPage = () => {
      if (props.page + skip < props.maxPage) return
      emit('updatePage', { updatedPage: props.page + skip })
    }

    watchEffect(() => {
      pages.value.clear()
      for (let i = 1; i < props.maxPage + 1; i++) pages.value.add(i)
    })

    // Touch scroll values & methods //
    let startX = 0
    let nowX = 0
    let listX = 0

    const onClick = (event) => {
      if (startX - nowX !== 0) event.preventDefault()
    }

    const mouseDown = (event) => {
      startX = event.clientX
    }

    const mouseMove = (event) => {
      nowX = event.clientX
      translate()
    }

    const translate = () => {
      pageBtns.value.style.transform = 'translateX(' + (listX + nowX - startX) + 'px)'
    }

    const getTranslateX = () => {
      return parseInt(getComputedStyle(pageBtns.value).transform.split(/[^\-0-9]+/g)[5])
    }

    const scrollEnd = () => {
      listX = getTranslateX()
      document.body.removeEventListener('mousedown', mouseDown)
      document.body.removeEventListener('mousemove', mouseMove)
      pageBtns.value.removeEventListener('click', onClick)

      if (listX > 0) {
        pageBtns.value.style.transform = 'translateX(' + 0 + 'px)'
        pageBtns.value.style.transition = 'all 0.25s ease'
      } else if (listX < pageBtns.value.clientWidth - pageBtns.value.scrollWidth) {
        pageBtns.value.style.transform = 'translateX(' + (pageBtns.value.clientWidth - pageBtns.value.scrollWidth) + 'px)'
        pageBtns.value.style.transition = 'all 0.25s ease'
      }
    }

    const addEvent = (event) => {
      startX = event.clientX
      event.preventDefault()
      listX = getTranslateX()

      document.body.addEventListener('mousedown', mouseDown)
      document.body.addEventListener('mousemove', mouseMove)
      document.body.addEventListener('mouseup', scrollEnd)
    }

    onMounted(() => {
      pageBtns.value.addEventListener('mousedown', addEvent)
      pageBtns.value.addEventListener('click', onClick)
    })

    onBeforeUnmount(() => {
      pageBtns.value.removeEventListener('mousedown', addEvent)
      pageBtns.value.removeEventListener('click', onClick)
    })

    return {
      skip,
      pageBtns,
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
  grid-template-columns: auto 1fr auto;
  margin: 4.8rem 0;
  color: var(--primary);
  font-size: 1.4rem;
  font-weight: 500;
  align-items: center;
  max-width: 100%;
  gap: 0 3rem;

  button.prev-btn {
    display: grid;
    grid-column: 1 / 2;
    grid-template-columns: repeat(2, auto);
    align-items: center;
    color: var(--point);
    cursor: pointer;
  }

  button.next-btn {
    display: grid;
    grid-column: 3 / 4;
    grid-template-columns: repeat(2, auto);
    align-items: center;
    color: var(--point);
    cursor: pointer;

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
    max-width: 100%;

    .page-btns {
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
}
</style>
