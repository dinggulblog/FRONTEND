<template>
  <div class="toolbar">
    <div class="sort select" :value="state.selectedSortedBy">
      <h2>Sort By</h2>
      <div class="selector" @click.prevent="onToggle('sortedBy')" ref="categoryEl">
        <div class="label">
          <span>{{ state.selectedSortedBy }}</span>
        </div>
        <i class="material-icons arrow" :class="{ expanded: state.sortedByVisible }">expand_more</i>
        <div :class="{ hidden: !state.sortedByVisible }">
          <ul>
            <li :class="{ current: item.value === state.selectedSortedBy }" v-for="item in sortOptions" :key="item.key" @click="onSelect('sortedBy', item.value)">{{ item.value }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="typeBtn">
      <button @click="typeSet('list')" :style="[type === 'list' ? { color: 'var(--point)' } : { color: 'var(--primary)' }]"><i class="material-icons">format_list_bulleted</i></button>
      <button @click="typeSet('album')" :style="[type === 'album' ? { color: 'var(--point)' } : { color: 'var(--primary)' }]"><i class="material-icons">grid_on</i></button>
    </div>

    <div class="category select" :value="state.selectedCategory">
      <div class="selector" @click.prevent="onToggle('category')" ref="sortedByEl">
        <div class="label">
          <span>{{ state.selectedCategory }}</span>
        </div>
        <i class="material-icons arrow" :class="{ expanded: state.categoryVisible }">expand_more</i>
        <div :class="{ hidden: !state.categoryVisible }">
          <ul>
            <li :class="{ current: item === state.selectedCategory }" v-for="item in categories" :key="item" @click="onSelect('category', item)">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onBeforeUnmount, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default {
  props: {
    type: String,
  },
  emits: ['updatedToolbar'],
  setup(type, { emit }) {
    const route = useRoute()
    const store = useStore()
    const storeMenus = store.state.menu.menus
    const curRouteParams = computed(() => route.params)
    const categories = computed(() => [...new Set(getCategories(storeMenus, curRouteParams.value))])

    const typeSet = (selectType) => {
      type = selectType
      emit('updatedToolbar', { type: type })
    }

    const getCategories = (menus, routeParams) => {
      let filtered = []
      if (routeParams.menu && routeParams.sub) {
        filtered = menus.filter((menu) => routeParams.menu === menu.owner && routeParams.sub === menu.subject)
      } else if (routeParams.menu) {
        filtered = menus.filter((menu) => routeParams.menu === menu.owner)
      }
      return filtered.map((elem) => elem.categories).flat()
    }

    //const category = ref() // posts
    //const sortedBy = ref() // posts

    const categoryEl = ref(null)
    const sortedByEl = ref(null)

    const sortOptions = ref([
      { key: 'createdAt', value: '날짜', order: false },
      { key: 'like', value: '좋아요', order: false },
      { key: 'comment', value: '댓글 수', order: false },
    ])

    const state = reactive({
      categoryVisible: false,
      sortedByVisible: false,
    })

    watchEffect(() => {
      if (curRouteParams.value) {
        state.selectedCategory = categories.value[0]
        state.selectedSortedBy = sortOptions.value[0].value
      }
    })

    const onToggle = (type) => {
      type === 'category' ? (state.categoryVisible = !state.categoryVisible) : (state.sortedByVisible = !state.sortedByVisible)
    }

    const onClose = (event) => {
      if (!categoryEl.value?.contains(event.target) && !sortedByEl.value?.contains(event.target)) {
        state.sortedByVisible = false
        state.categoryVisible = false
      }
    }

    const onSelect = (type, data) => {
      if (type === 'category') {
        state.selectedCategory = data
        emit('updatedToolbar', { category: state.selectedCategory })
      } else {
        state.selectedSortedBy = data
        //sortedBy.value = sortOptions.value.find((option) => option.value === state.selectedSortedBy)
        //sortedBy.value.order = !sortedBy.value.order
        emit('updatedToolbar', { sortedBy: state.selectedSortedBy })
      }
    }

    //category.value = state.selectedCategory
    //sortedBy.value = sortOptions.value.find((option) => option.value === state.selectedSortedBy)

    onMounted(() => document.addEventListener('click', onClose))
    onBeforeUnmount(() => document.addEventListener('click', onClose))

    return { categoryEl, sortedByEl, categories, sortOptions, state, onToggle, onSelect, typeSet }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.toolbar {
  margin: 0 0 4.8rem;
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;

  .sort {
    grid-column: 1 / 2;
    display: grid;
    grid-template-columns: auto auto;

    h2 {
      grid-column: 1 / 2;
      font-size: 1.4rem;
      color: var(--secondary);
      font-weight: 500;
      margin-right: 1.6rem;
    }

    .selector {
      grid-column: 2 / 3;
      width: 12rem;
    }
  }

  .typeBtn {
    grid-column: 3 / 4;
    display: grid;
    grid-template-columns: auto auto;

    button {
      display: grid;
      align-items: center;
      transition: all 0.3s ease;
    }
  }

  .category {
    justify-self: end;
    grid-column: 4 / 5;
    border: 2px solid var(--point);
    border-radius: 2rem;
    padding: 0 0rem;
    width: 12rem;

    &.select {
      padding: 0 1.6rem 0 2.2rem;

      ul {
        left: -2.3rem;
      }
    }
  }

  .select {
    height: 4rem;
    font-size: 1.4rem;
    display: grid;
    align-items: center;

    .selector {
      position: relative;
      z-index: 1;
      cursor: pointer;
      user-select: none;

      .arrow {
        position: absolute;
        right: 0;
        top: -0.2rem;
        transform: rotateZ(0deg) translateY(0px);
        transition: all 0.2s ease;
        margin: 0;
        color: var(--point);
      }

      .expanded {
        transform: rotateZ(180deg) translateY(0px);
      }

      .label {
        display: block;
        color: var(--point);
      }
    }

    ul {
      width: 12rem;
      list-style-type: none;
      padding: 0;
      position: absolute;
      margin-top: 1.6rem;
      left: -0.2rem;
      z-index: 1;
      background: #fff;
      box-shadow: 0 0 2.4rem 0.3rem rgba(0, 0, 0, 0.15);
    }

    li {
      padding: 1.2rem 2.4rem;
      color: var(--primary);

      &:hover {
        background: #eaeaea;
      }
    }

    .hidden {
      visibility: hidden;
    }
  }
}
</style>
