<template>
  <div class="toolbar">
    <div class="wrap_breadcrumb_sort_type">
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

      <!-- View type buttons -->
      <div class="type">
        <button v-for="view in views" :key="view.name" class="btn_type">
          <img :class="view.name" :src="view.url" />
        </button>
      </div>
    </div>

    <div class="categories">
      <ul>
        <li v-for="category in categories" :key="category" class="elem_category">{{ category }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { type } from 'os'
import { onMounted, onUpdated, ref } from 'vue'

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
    const views = [
      { name: 'list', url: require('../assets/icons/layout-column-line.svg') },
      { name: 'card', url: require('../assets/icons/layout-grid-line.svg') },
    ]

    const changeView = (event) => {
      emit('updatedType', event.target?.classList[0])
      document.querySelectorAll('.btn_type').forEach((elem) => elem.firstChild.classList.remove('on'))
      event.target?.classList.add('on')
    }

    const changeCategory = (event) => {
      emit('updatedCategory', event.target.innerText)
      document.querySelectorAll('.elem_category').forEach((elem) => elem.classList.remove('on'))
      event.target?.classList.add('on')
    }

    onMounted(() => {
      document.querySelectorAll('.btn_type').forEach((elem) => (elem.firstChild.classList.value === props.type ? elem.firstChild.classList.add('on') : null))
      document.querySelectorAll('.btn_type').forEach((elem) => elem.addEventListener('click', changeView))
      document.querySelectorAll('.elem_category').forEach((elem) => elem.addEventListener('click', changeCategory))
    })

    onUpdated(() => {
      document.querySelectorAll('.btn_type').forEach((elem) => (elem.firstChild.classList.value === props.type ? elem.firstChild.classList.add('on') : null))
      document.querySelectorAll('.btn_type').forEach((elem) => elem.addEventListener('click', changeView))
      document.querySelectorAll('.elem_category').forEach((elem) => elem.addEventListener('click', changeCategory))
    })

    return { views, changeView, changeCategory }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.toolbar {
  .wrap_breadcrumb_sort_type {
    display: flex;
    align-items: center;
    font-size: 1.4rem;
    margin: 0 0 4.8rem;

    .breadcrumb {
      flex-basis: 50%;
      ul {
        display: flex;
        list-style: none;
        align-items: center;

        li {
          margin-right: 1rem;
          display: flex;
          align-items: center;

          a {
            color: var(--text-light);
            letter-spacing: 0.04rem;
            text-transform: uppercase;
            font-weight: 500;
          }
        }

        li:first-child {
          i {
            margin-right: 0;
            margin-top: 0.3rem;
          }
        }

        li:last-child {
          a {
            color: var(--primary-dark);
          }
        }

        li:not(:first-child)::before {
          font-family: 'Material Icons';
          content: '\e5cc';
          width: 3.2rem;
          font-size: 2rem;
          color: var(--text-light);
        }
      }
    }

    .type {
      display: flex;
      align-items: center;
      flex-basis: 50%;
      justify-content: flex-end;

      button {
        display: flex;
        align-items: center;
        transition: all 0.3s ease;
        margin: 0 0 0 0.8rem;

        img {
          width: 2.4rem;
          height: 2.4rem;

          &.on {
            background-color: red;
          }
        }
      }
    }
  }

  .categories {
    width: 100%;
    margin: 4.8rem 0 3.2rem;

    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        flex: 0 0 auto;
        margin: 0 1.6rem 1.2rem 0;
        padding: 0 1.6rem;
        height: 3.8rem;
        line-height: 3.6rem;
        font-family: 'Noto Sans KR';
        font-size: 1.4rem;
        color: var(--text-light);
        border: 1px solid var(--border-dark);
        border-radius: 2.4rem;
        text-transform: capitalize;
        cursor: pointer;

        &:last-child {
          margin-right: 0;
        }

        &.on {
          color: var(--secondary-dark);
          border: 1px solid var(--secondary-dark);
        }
      }

      @include mobile_all {
        flex-wrap: nowrap;
        overflow-x: auto;
        overflow-y: hidden;
      }
    }
  }
}
</style>
