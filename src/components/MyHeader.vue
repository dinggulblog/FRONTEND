<template>
  <div class="header">
    <div class="headerWrap">
      <div class="search">
        <i class="material-icons">search</i>
        <input type="text" placeholder="Search for here" v-model="search" />
      </div>

      <router-link class="logo" :to="{ name: 'home' }">DINGGUL</router-link>

      <div class="user">
        <router-link :to="{ name: 'editor' }"><i class="material-icons">create</i>New post </router-link>

        <span></span>

        <div class="drop" v-if="user">
          <button class="btn">{{ user }}</button>
          <div class="profile"></div>

          <div class="menu">
            <ul>
              <li>
                <router-link :to="{ name: 'account' }">Account</router-link>
              </li>
              <li @click="onLogout">Logout</li>
            </ul>
          </div>
        </div>
        <router-link :to="{ name: 'login' }" v-else><i class="material-icons">person</i></router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    const route = useRoute()
    const user = computed(() => store.state.auth.user.nickname)
    const isAuthRoute = computed(() => route.path.startsWith('/auth'))
    const search = ref('')

    const onLogout = () => {
      store.dispatch('auth/logout')
    }
    return { isAuthRoute, user, search, onLogout }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.header {
  display: grid;
  background: var(--point);
  height: 6.4rem;
  grid-template-columns: 1fr minmax(auto, 128rem) 1fr;
}

.headerWrap {
  display: grid;
  color: #fff;
  font-size: 1.4rem;
  grid-column: 2 / 3;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;

  .search {
    font-weight: 400;
    display: grid;
    grid-template-columns: auto 1fr;

    input {
      color: #fff;

      &::placeholder {
        color: #fff;
      }
    }
  }

  .logo {
    display: grid;
    justify-content: center;
    color: #fff;
    font-size: 2rem;
    letter-spacing: 0.2em;
    font-family: 'Roboto Condensed', sans-serif;
    text-transform: uppercase;
  }

  .user {
    display: grid;
    justify-content: end;
    grid-template-columns: repeat(3, auto);

    a {
      z-index: 500;
      color: #fff;
      display: grid;
      grid-template-columns: repeat(2, auto);
      place-items: center;
    }

    span {
      border-left: 1px solid #fff;
      height: 1.6rem;
      margin: 0.9rem 4rem 0;
    }

    .drop {
      position: relative;
      z-index: 300;
      display: grid;
      justify-content: end;
      grid-template-columns: repeat(2, auto);
      cursor: pointer;

      button {
        color: #fff;
      }

      .profile {
        background: #fff;
        border-radius: 50%;
        width: 3.2rem;
        height: 3.2rem;
        margin-left: 1.4rem;
        background: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnI3Ftw4ttKq1OERD38V3Z6Y65RvY9pSwkIw&usqp=CAU');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
      }

      .menu {
        visibility: hidden;
        opacity: 0;
        transition-property: opacity, visibility;
        transition-duration: 0.5s;
        position: absolute;
        padding-top: 5.2rem;
        right: 0;
      }

      .menu ul {
        display: inline;
      }

      .menu li {
        display: grid;
        place-items: center;
        padding: 1.5rem 3rem;
        margin-bottom: 0.1rem;
        color: #fff;
        font-size: 1.2rem;
        border-radius: 3%;
        background: var(--point);

        a {
          color: #fff;
        }
      }
    }

    .drop:hover .menu {
      visibility: visible;
      opacity: 1;
      transition-duration: 0.5s;
    }
  }
}
</style>
