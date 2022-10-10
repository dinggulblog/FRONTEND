<template>
  <nav class="nav">
    <div class="m_menu_close">
      <button class="btn_close" @click="onChangeDisplay('view')">
        <i class="material-icons">close</i>
      </button>
    </div>

    <div class="m_menu_login" v-if="!user.email"><router-link :to="{ name: 'login' }" class="a_login" @click="onChangeDisplay('view')">로그인</router-link>이 필요합니다.</div>

    <div class="wrap_auth" v-else>
      <div class="auth">
        <img class="avatar" src="../assets/4.jpg" alt="user_avatar" />
        <span class="nickname">{{ user.nickname }} 님</span>
      </div>

      <div class="auth_items">
        <ul>
          <li><router-link :to="{ name: 'account' }">Account</router-link></li>
          <!--
                <li><router-link :to="{ name: 'profile', params: { nickname: user.nickname } }">Profile</router-link></li>
                -->
          <li><button @click="onLogout">Logout</button></li>
        </ul>
      </div>
    </div>

    <div class="wrap_nav_item">
      <router-link :to="{ name: 'home' }" class="nav_item">home</router-link>
      <ul v-for="title in getters['menu/getTitles']" :key="title" class="nav_item dropdown">
        <li>
          <router-link :to="{ name: 'posts', params: { title } }">{{ title }} </router-link>
          <div class="wrap_nav_item_child dropdown_items">
            <ul v-for="subject in getters['menu/getSubjects'](title)" :key="subject" class="nav_item_child">
              <li>
                <router-link :to="{ name: 'posts', params: { title, subject } }">
                  {{ subject }}
                </router-link>
              </li>
            </ul>
          </div>
        </li>
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
  @include mobile-tablet {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: fixed;
    top: 0;
    width: 32rem;
    height: 100vh;
    padding: 4.8rem 4.8rem 0;
    font-size: 1.6rem;
    color: var(--text-light);
    background-color: #efefef;
    overflow-y: auto;
    -ms-overflow-style: none;
    counter-reset: number 0;

    a,
    button {
      font-size: 1.6rem;
    }

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
    letter-spacing: 0.2rem;
    font-weight: 500;
    text-transform: uppercase;
    color: var(--text-light);

    @include mobile_all {
      margin: 0rem 0;
      font-size: 1.6rem;
    }
  }

  a.router-link-active {
    color: var(--primary-dark);
  }

  .m_menu_close {
    display: none;

    @include mobile-tablet {
      display: flex;
      justify-content: flex-end;
      width: 100%;
      margin: 4.8rem 0 0;
    }

    @include mobile {
      justify-content: center;
    }

    .btn_close i {
      font-size: 3.2rem;
      color: var(--primary);
    }
  }

  .m_menu_login {
    display: none;

    @include mobile-tablet {
      display: block;
      margin: 0 0 1.6rem;
      padding: 4.8rem 0;
      border-bottom: 1px solid var(--primary);

      a {
        text-decoration: underline;
        color: var(--primary);
      }
    }
  }

  .wrap_auth {
    display: none;

    @include mobile-tablet {
      display: flex;
      flex-direction: column;
      width: 100%;
      margin: 0 0 1.6rem;
      padding: 4.8rem 0;
      border-bottom: 1px solid var(--primary);
    }

    .auth {
      display: flex;
      align-items: center;

      .avatar {
        width: 4.8rem;
        height: 4.8rem;
        margin: 0 1.6rem 0 0;
        border-radius: 50%;
      }

      .nickname {
        font-size: 1.6rem;
        font-family: 'Noto Sans KR';
        color: var(--text-light);
      }
    }

    .auth_items {
      ul > li {
        margin: 2.4rem 0 0 0;

        a,
        button {
          font-size: 1.6rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.2rem;
          color: var(--primary-dark);
        }
      }
    }
  }

  .wrap_nav_item {
    display: flex;
    flex-direction: row;
    width: calc(120rem - 4.8rem);

    @include mobile-tablet {
      flex-direction: column;
    }

    @include tablet_landscape {
      width: 100%;
    }

    @include mobile {
      width: 100%;
    }

    .nav_item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: calc(100% / 4);

      @include mobile-tablet {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        width: auto;
        margin: 3.2rem 0 4.8rem;

        &::before {
          counter-increment: number 1;
          content: counter(number, decimal-leading-zero);
          margin: 0 3.2rem 0 0;
          font-size: 1.6rem;
          font-weight: 500;
          color: var(--primary-dark);
        }
      }

      ul {
        @include mobile-tablet {
          display: flex;
          flex-direction: row;
        }

        li {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 4.8rem;
          padding: 2.4rem;

          @include mobile-tablet {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            height: auto;
            padding: 0;
            background-color: transparent;
          }

          a.router-link-active {
            color: var(--primary-dark);
          }
        }
      }
      .wrap_nav_item_child {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        margin: 3.1rem 0 0;
        border-radius: 0 0 3.2rem 3.2rem;
        box-shadow: 0 0.1rem 2rem rgba(0, 0, 0, 0.16);

        @include mobile-tablet {
          opacity: 1;
          position: relative;
          top: 0;
          display: flex;
          margin: 3.2rem 0 0 3.2rem;
          border-left: 1px solid var(--primary);
          border-radius: 0;
          box-shadow: 0 0;
        }

        ul {
          display: flex;
          justify-content: center;
          width: 100%;
          background-color: #fff;

          @include mobile-tablet {
            margin: 0 0 3.2rem;
            padding: 0 0 0 2.4rem;
            background-color: #efefef;
          }

          &:hover {
            background-color: var(--border-light);
          }

          &:last-child {
            border-radius: 0 0 3.2rem 3.2rem;

            @include mobile-tablet {
              margin-bottom: 0;
            }
          }

          li {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
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
      }
    }

    ul.nav_item > li {
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
    }
  }

  /* only mobile menu - user */
}
</style>
