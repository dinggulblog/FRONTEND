<template>
  <div class="nav">
    <nav>
      <ul v-for="menu in menus" :key="menu.title">
        <li>
          <router-link v-if="menu.title !== 'guest'" :to="{ name: 'posts', params: { menu: menu.title, sub: '' }, query: { pageNum: 1 } }">
            <i class="material-icons">favorite</i> {{ menu.title }}
          </router-link>
          <span v-else><i class="material-icons">favorite</i> {{ menu.title }}</span>
          <ul v-for="subject in menu.subjects" :key="subject">
            <li>
              <router-link :to="{ name: 'posts', params: { menu: menu.title, sub: subject }, query: { pageNum: 1 } }">
                {{ subject }}
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'navigation',
  setup() {
    const store = useStore()
    const menus = computed(() => store.getters['menu/getFilteredMenus'])

    return { menus }
  },
}
</script>

<style lang="scss">
nav {
  font-size: 1.4rem;

  ul {
    list-style: none;
    font-weight: 700;
    margin: 0 0 4.6rem;
  }

  li a,
  span {
    color: var(--point);
    text-transform: uppercase;

    i {
      font-size: 1.4rem !important;
      position: relative;
      top: 0.2rem;
      margin-right: 1.6rem;
    }
  }

  ul > li > ul {
    margin: 2.4rem 0 0 0;
  }

  ul > li > ul > li {
    padding: 0 0 0 3.6rem;
    font-weight: 400;

    a {
      color: var(--primary);
      text-transform: capitalize;
    }
  }

  ul > li > ul > li:last-child(not) {
    margin: 0 0 2.4rem 0;
    padding: 0 0 0 3rem;
  }
}
</style>
