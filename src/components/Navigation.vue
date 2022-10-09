<template>
  <nav class="nav">
    <div class="m-menu-closeBtn">
      <button class="btn_close" @click="onChangeDisplay('view')">
        <i class="material-icons">close</i>
      </button>
    </div>
    <router-link :to="{ name: 'home' }" class="nav__item">home</router-link>
    <ul v-for="title in getters['menu/getTitles']" :key="title" class="nav__item">
      <li>
        <router-link :to="{ name: 'posts', params: { title } }">{{ title }} </router-link>

        <div class="nav__item__childs">
          <ul v-for="subject in getters['menu/getSubjects'](title)" :key="subject" class="nav__item__child">
            <li>
              <router-link :to="{ name: 'posts', params: { title, subject } }">
                {{ subject }}
              </router-link>
            </li>
          </ul>
        </div>
      </li>
    </ul>

    <div class="user">
      <div class="auth">
        <img class="auth__avatar auth--avatar" src="../assets/4.jpg" alt="auth-avatar" />
        <span class="auth__nickname">{{ user.nickname }} 님</span>
      </div>

      <ul class="auth__items">
        <li><router-link :to="{ name: 'account' }">Account</router-link></li>
        <!--
                <li><router-link :to="{ name: 'profile', params: { nickname: user.nickname } }">Profile</router-link></li>
                -->
        <li><button @click="onLogout">Logout</button></li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'

export default {
  name: 'navigation',
  emits: ['onChangeDisplay'],
  setup(props, { emit }) {
    const store = useStore()
    const { getters } = useStore()
    const route = useRoute()
    const path = computed(() => route.path)
    const param = computed(() => route.currentRoute)
    const user = computed(() => store.state.auth.user)

    const onChangeDisplay = (state) => {
      emit('onChangeDisplay', { state })
    }

    return { getters, path, param, user, onChangeDisplay }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: calc(120rem - 4.8rem);

  @include mobile-tablet {
    flex-direction: column;
    align-items: flex-start;
    width: 32rem;
    height: 100vh;
    background-color: #efefef;
    position: fixed;
    top: 0;
    padding: 4.8rem 4.8rem 0;
    counter-reset: number 0;
    overflow-y: auto;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  @include tablet_landscape {
    width: 100%;
  }

  @include mobile {
    width: 100%;
  }

  a {
    font-size: 1.2rem;
    color: var(--text-light);
    text-transform: uppercase;
    letter-spacing: 0.2rem;
    font-weight: 500;

    @include mobile_all {
      font-size: 1.6rem;
      margin: 0rem 0;
    }
  }

  a.router-link-active {
    color: var(--primary-dark);
  }

  .m-menu-closeBtn {
    display: none;

    @include mobile-tablet {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      margin: 4.8rem 0 3.2rem 0;
    }

    @include mobile {
      justify-content: center;
    }

    .btn_close i {
      font-size: 3.2rem;
      color: var(--primary);
    }
  }

  @include mobile-tablet {
    .nav__item::before {
      counter-increment: number 1;
      content: counter(number, decimal-leading-zero);
      margin: 0 3.2rem 0 0;
      font-size: 1.6rem;
      color: var(--primary-dark);
      font-weight: 500;
    }
  }

  &__item {
    width: calc(100% / 4);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    @include mobile-tablet {
      display: flex;
      width: auto;
      justify-content: flex-start;
      align-items: flex-start;
      margin: 3.2rem 0 0;
    }

    ul {
      @include mobile-tablet {
        display: flex;
        flex-direction: row;
      }
    }

    li {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 4.8rem;
      padding: 2.4rem;

      @include mobile-tablet {
        background-color: transparent;
        padding: 0;
        height: auto;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
      }

      a.router-link-active {
        color: var(--primary-dark);
      }
    }

    &__childs {
      width: 100%;
      position: absolute;
      top: 4.8rem;
      z-index: 100;
      flex-direction: column;
      box-shadow: 0 0.1rem 2rem rgba(0, 0, 0, 0.16);
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition-property: opacity, visibility;
      transition-duration: 0.5s;
      border-radius: 0 0 3.2rem 3.2rem;

      @include mobile-tablet {
        opacity: 1;
        box-shadow: 0 0;
        position: relative;
        top: 0;
        display: flex;
        border-left: 1px solid var(--primary);
        border-radius: 0;
        margin: 3.2rem 0 0 3.2rem;
      }

      ul {
        width: 100%;
        display: flex;
        justify-content: center;
        background-color: #fff;

        @include mobile-tablet {
          margin: 0 0 3.2rem;
          padding: 0 0 0 2.4rem;
          background-color: #efefef;
        }

        &:hover {
          background-color: var(--border-light);
        }

        li {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 6.4rem;

          @include mobile-tablet {
            display: block;
            height: auto;
          }

          a {
            padding: 1.2rem;

            @include mobile-tablet {
              padding: 0;
            }
          }
        }
      }

      ul:last-child {
        border-radius: 0 0 3.2rem 3.2rem;

        @include mobile-tablet {
          margin-bottom: 0;
        }
      }
    }
  }

  ul.nav__item > li {
    &::before {
      content: '';
      position: absolute;
      left: 0;
      width: 0.01rem;
      height: 1.2rem;
      background-color: var(--border-dark);

      @include mobile-tablet {
        display: none;
      }
    }

    &:hover .nav__item__childs {
      visibility: visible;
      opacity: 1;
      transition-duration: 0.5s;
    }
  }

  /* only mobile menu - user */
  .user {
    display: none;

    @include mobile-tablet {
      width: 100%;
      margin: 4.8rem 0 0;
      display: flex;
      flex-direction: column;
      border-top: 1px solid var(--primary);
    }

    .auth {
      display: flex;
      align-items: center;
      margin: 4.8rem 0 3.2rem;

      &__avatar {
        width: 4.8rem;
        height: 4.8rem;
        border-radius: 50%;
        margin: 0 1.6rem 0 0;
      }

      &__nickname {
        font-size: 1.6rem;
        color: var(--text-light);
        font-family: 'Noto Sans KR';
      }

      &__items > li {
        margin: 0 0 3.2rem 0;

        a,
        button {
          font-size: 1.6rem;
          color: var(--primary-dark);
          text-transform: uppercase;
          font-weight: 500;
          letter-spacing: 0.2rem;
        }
      }
    }
  }
}
</style>
