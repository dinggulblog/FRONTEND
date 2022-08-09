<template>
  <div class="nav">
    <nav>
      <ul v-for="title in getters['menu/getTitles']" :key="title">
        <li>

          <!-- Title menu link -->
          <router-link :to="{ name: 'posts', params: { title } }">
            <i class="material-icons">favorite</i> {{ title }}
          </router-link>

          <!-- Sub menu link -->
          <ul v-for="subject in getters['menu/getSubjects'](title)" :key="subject">
            <li>
              <router-link :to="{ name: 'posts', params: { title, subject } }">
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
import { useStore } from 'vuex'

export default {
  name: 'navigation',
  setup() {
    const { getters } = useStore()

    return { getters }
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
