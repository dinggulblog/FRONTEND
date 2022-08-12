<template>
  <div class="nav">
    <nav>
      <ul v-for="title in getters['menu/getTitles']" :key="title">
        <li>
          <!-- Title menu link -->
          <router-link :to="{ name: 'posts', params: { title } }"> <i class="material-icons">favorite</i> {{ title }} </router-link>

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
    <!--
    <ul class="quickMoveBtns" v-if="path.startsWith('/posts')">
      <li @click="quickMovePrevList"><i class="material-symbols-outlined">apps</i></li>
      <li><i class="material-symbols-outlined">favorite</i></li>
      <li @click="quickMoveTop"><i class="material-symbols-outlined">expand_circle_down</i></li>
    </ul>
    -->
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  name: 'navigation',
  setup() {
    const { getters } = useStore()
    const route = useRoute()
    const path = computed(() => route.path)
    const param = computed(() => route.currentRoute)

    return { getters, path, param }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.nav {
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

  .quickMoveBtns {
    display: flex;
    flex-direction: column;
    align-items: center;
    li {
      margin: 2rem 0;
      list-style: none;
      color: var(--point);
      cursor: pointer;

      i {
        font-size: 2.6rem;
      }
      .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 48;
      }
    }

    li:nth-child(3) > i {
      transform: rotate(180deg);
    }
  }
}
</style>
