<template>
  <div class="nav">
    <nav>
      <ul v-for="menu in menus" :key="menu.owner">
        <li>
          <router-link v-if="menu.owner !== 'guest'" :to="{ name: 'posts', params: { menu: menu.owner, sub: '' }, query: { pageNum: 1 } }">
            <i class="material-icons">favorite</i> {{ menu.owner }}
          </router-link>
          <span v-else><i class="material-icons">favorite</i> {{ menu.owner }}</span>
          <ul v-for="subject in menu.subjects" :key="subject">
            <li>
              <router-link :to="{ name: 'posts', params: { menu: menu.owner, sub: subject }, query: { pageNum: 1 } }">
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
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'navigation',
  setup() {
    const store = useStore()
    const storeMenus = store.state.menu.menus
    const owners = []
    const menus = ref([])

    storeMenus.forEach((storeMenu) => {
      if (!owners.includes(storeMenu.owner)) owners.push(storeMenu.owner)
    })

    owners.forEach((owner) => menus.value.push({ owner }))

    for (const menu of storeMenus) {
      const idx = menus.value.findIndex((m) => m.owner === menu.owner)
      if (idx >= 0 && menus.value[idx].subjects) {
        menus.value[idx].subjects.push(menu.subject)
      } else {
        menus.value[idx].subjects = [menu.subject]
      }
    }

    return {
      menus,
    }
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
