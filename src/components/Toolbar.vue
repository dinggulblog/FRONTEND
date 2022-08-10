<template>
  <div class="toolbar">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <ul>
        <li>
          <router-link :to="{ name: 'home' }"><i class="material-icons">home</i></router-link>
        </li>
        <li>
          <router-link :to="{ name: 'posts', params: { title } }">{{ title }}</router-link>
        </li>
        <li v-if="subject">
          <router-link :to="{ name: 'posts', params: { title, subject } }">{{ subject }}</router-link>
        </li>
      </ul>
    </div>

    <!-- Sort type change field -->
    <!--
    <div class="sort select" :value="state.selectedSortedBy">
      <h2>Sort By</h2>
      <div class="selector" @click.prevent="onToggle('sortedBy')" ref="categoryEl">
        <div class="label">
          <span>{{ state.selectedSortedBy }}</span>
        </div>
        <i class="material-icons arrow" :class="{ expanded: state.sortedByVisible }">expand_more</i>
        <div :class="{ hidden: !state.sortedByVisible }">
          <ul>
            <li :class="{ current: item.value === state.selectedSortedBy }" v-for="item in sortOptions" :key="item.key" @click="onSelect('sortedBy', item.value)">
              {{ item.value }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    -->

    <!-- View type buttons -->
    <div class="type-btn">
      <button @click="changeType('list')" :style="[type === 'list' ? { color: 'var(--point)' } : { color: 'var(--primary)' }]">
        <i class="material-icons">format_list_bulleted</i>
      </button>
      <button @click="changeType('album')" :style="[type === 'album' ? { color: 'var(--point)' } : { color: 'var(--primary)' }]">
        <i class="material-icons">grid_on</i>
      </button>
    </div>

    <!-- Category select box -->
    <div class="category select" ref="categoryEl" tabindex="0" @blur="closeCatBox">
      <div class="selector">
        <div class="label" @click="isVisible = !isVisible">
          <span>{{ category }}</span>
        </div>
        <i class="material-icons arrow" :class="{ expanded: isVisible }" @click="isVisible = !isVisible">expand_more</i>
        <div :hidden="!isVisible">
          <ul>
            <li @click="changeCategory('All')">전체보기</li>
            <li v-for="item in categories" :key="item" @click="changeCategory(item)">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  props: {
    type: {
      type: String,
      default: 'list',
    },
    category: {
      type: String,
    },
    categories: {
      type: Array,
    },
    title: {
      type: String,
    },
    subject: {
      type: String,
    },
  },
  emits: ['updatedToolbar'],
  setup(props, { emit }) {
    const isVisible = ref(false)
    const categoryEl = ref(null)

    const openCatBox = () => {
      isVisible.value = true
    }

    const closeCatBox = () => {
      isVisible.value = false
    }

    const changeType = (updatedType) => {
      emit('updatedToolbar', { updatedType })
    }

    const changeCategory = (updatedCategory) => {
      emit('updatedToolbar', { updatedCategory })
      closeCatBox()
    }

    return { isVisible, categoryEl, openCatBox, closeCatBox, changeType, changeCategory }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.toolbar {
  margin: 0 0 4.8rem;
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  font-size: 1.4rem;

  .breadcrumb {
    ul {
      display: flex;
      list-style: none;
      align-items: center;

      li {
        margin-right: 1rem;
        display: inherit;
        align-items: center;
        font-weight: 500;
        text-transform: uppercase;

        a {
          color: var(--sub);
        }
      }

      li:first-child {
        i {
          margin-right: 0;
          margin-top: 0.3rem;
        }
      }

      li:not(:first-child)::before {
        font-family: 'Material Icons';
        content: '\e5cc';
        width: 3.2rem;
        font-size: 2rem;
        color: var(--sub);
      }

      li:last-child a {
        color: var(--point);
      }
    }
  }

  .type-btn {
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
    padding: 0 0rem;
    border: 2px solid var(--point);
    border-radius: 2rem;

    &.select {
      padding: 0 0rem 0 0em;

      ul {
      }
    }
  }

  .select {
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
        right: 1rem;
        top: 0.8rem;
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
        width: 12.8rem;
        height: 4rem;
        display: flex;
        align-items: center;
        padding: 0 2rem;
        text-transform: capitalize;
      }
    }

    ul {
      width: 12.8rem;
      list-style-type: none;
      padding: 0;
      position: absolute;
      margin-top: 1.6rem;
      right: 0rem;
      z-index: 1;
      background: #fff;
      box-shadow: 0 0 2.4rem 0.3rem rgba(0, 0, 0, 0.15);
    }

    li {
      padding: 1.2rem 2.4rem;
      color: var(--primary);
      text-transform: capitalize;

      &:hover {
        background: #eaeaea;
        color: var(--point);
      }
    }
  }
}
</style>
