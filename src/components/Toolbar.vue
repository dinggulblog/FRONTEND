<template>
  <div class="toolbar">
    <div class="wrap_breadcrumb_sort_type">
      <div class="breadcrumb">
        <ul>
          <li>
            <router-link :to="{ name: 'home' }">
              <Ico :size="'md'" :svg="'home'" />
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'posts', params: { main: route.params.main } }">
              {{ route.params.main }}
            </router-link>
          </li>
          <li v-if="route.params.sub">
            <router-link :to="{ name: 'posts', params: { main: route.params.main, sub: route.params.sub } }">
              {{ route.params.sub }}
            </router-link>
          </li>
        </ul>
      </div>

      <div class="type">
        <button v-for="view in views" :key="view.name" ref="typeBtnsEl">
          <Ico :size="'md'" :svg="view.path" :class="view.name" />
        </button>
      </div>
    </div>

    <div class="categories">
      <ul ref="categoryEl">
        <li>전체</li>
        <li v-for="category in categories" :key="category">{{ category }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { computed, onMounted, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStore } from 'vuex'

  export default {
    props: {
      categories: {
        type: Array,
      },
    },
    setup(props, { emit }) {
      const { state } = useStore()
      const route = useRoute()
      const views = [
        {
          name: 'list',
          path: 'row',
        },
        {
          name: 'card',
          path: 'grid',
        },
      ]

      const type = computed(() => state.menu.type)
      const typeBtnsEl = ref(null)
      const categoryEl = ref(null)

      const addOnClass = (element) => {
        element?.classList?.add('on')
      }

      const removeOnClass = (elements = []) => {
        for (const elem of elements) {
          if (elem.tagName === 'LI') {
            elem.classList.remove('on')
          } else if (elem.tagName === 'BUTTON') {
            elem.firstChild.classList.remove('on')
          }
        }
      }

      const changeView = (event) => {
        if (event.currentTarget.firstChild.tagName === 'svg') {
          removeOnClass(typeBtnsEl.value)
          emit('updateType', event.currentTarget.firstChild.classList[0])
          addOnClass(event.currentTarget.firstChild)
        }
        console.log(event.currentTarget.firstChild.classList[0])
      }

      const changeCategory = (event) => {
        if (event.target.tagName === 'LI') {
          removeOnClass(categoryEl.value?.children)
          emit('updateCategory', event.target.innerText)
          addOnClass(event.target)
        }
      }

      const remountClass = () => {
        removeOnClass(typeBtnsEl.value)
        removeOnClass(categoryEl.value?.children)
        addOnClass(typeBtnsEl.value?.find((button) => button.firstChild.classList.value === type.value)?.firstChild)
        addOnClass(categoryEl.value?.firstChild)
      }

      watch(() => route.path, remountClass)

      onMounted(() => {
        typeBtnsEl.value.forEach((button) => button.addEventListener('click', changeView))
        categoryEl.value.addEventListener('click', changeCategory)
        remountClass()
      })

      return { route, views, typeBtnsEl, categoryEl }
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
            margin-right: 1rem;
            width: 24px;
            height: 24px;
            content: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='%23d0d0d0'><path d='M13.2,12L7.6,6.4l1.6-1.6l7.2,7.2l-7.2,7.2l-1.6-1.6L13.2,12z' /></svg>");
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
          margin: 0 0 0 1.2rem;
          color: var(--text-light);

          svg.on {
            fill: var(--primary-dark);
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
        margin: 0 0 1.2rem 0;
        li {
          flex: 0 0 auto;
          margin: 0 1.6rem 0 0;
          padding: 0.8rem 1.6rem;
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
