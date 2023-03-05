<template>
  <nav class="nav">
    <!-- Close button -->
    <div class="m_menu_close">
      <Button class="btn_close" :svg="'close'" :theme="'primary'" @click="emits('closeAll')" />
    </div>

    <!-- Login rink -->
    <div class="m_menu_login" v-if="!user.nickname"><Button class="btn_login" :theme="'primary'" @click="ACCOUNT_EL.open('login')">로그인</Button>이 필요합니다.</div>

    <!-- Account info -->
    <div class="wrap_auth" v-else>
      <div class="auth">
        <User :profile="user" />
      </div>

      <div class="auth_items">
        <ul>
          <li>
            <span @click="emits('closeAll'), ACCOUNT_EL.open('update')">Account</span>
          </li>
          <li>
            <router-link :to="{ name: 'profile', params: { nickname: user.nickname } }" @click="emits('closeAll')"> Profile </router-link>
          </li>
          <li v-if="$store.state.auth.isAdmin">
            <router-link :to="{ name: 'dashboard', params: { section: 'chart' } }">Dashboard</router-link>
          </li>
          <li><span @click="emits('logout')">Logout</span></li>
        </ul>
      </div>
    </div>

    <!-- Menu links -->
    <div class="wrap_nav_item">
      <ul>
        <li class="nav_item">
          <router-link :to="{ name: 'home' }" class="item_number" @click="emits('closeAll')">home</router-link>
        </li>
        <li v-for="(subMenus, main) in menus" :key="main" class="nav_item dropdown">
          <router-link :to="{ name: 'posts', params: { main } }" class="item_number" @click="emits('closeAll')">
            {{ main }}
          </router-link>
          <div class="wrap_nav_item_child dropdown_items">
            <ul class="nav_item_child">
              <li v-for="{ _id, sub } in subMenus" :key="_id">
                <router-link :to="{ name: 'posts', params: { main, sub } }" @click="emits('closeAll')">
                  {{ sub }}
                </router-link>
              </li>
            </ul>
          </div>
        </li>
        <li class="nav_item">
          <span @click="CONTACT_EL.open" class="item_number">Contact Us</span>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { inject, computed } from 'vue'
import { useStore } from 'vuex'
import User from '../User.vue'

const emits = defineEmits(['logout', 'closeAll'])

const { state } = useStore()

const CONTACT_EL = inject('CONTACT_EL')
const ACCOUNT_EL = inject('ACCOUNT_EL')

const menus = computed(() => state.menu.menus)
const user = computed(() => state.auth.user)
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.nav {
  @include mobile_all {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 32rem;
    height: 100vh;
    padding: 4.8rem 4.8rem;
    font-size: 1.6rem;
    color: var(--text1);
    background-color: var(--bg1);
    overflow-y: auto;

    a,
    button {
      font-size: 1.6rem;
    }
  }

  @include mobile {
    width: 100%;
  }

  a,
  span {
    font-size: 1.2rem;
    font-weight: 500;
    text-transform: uppercase;
    color: var(--text3);
    cursor: pointer;
    letter-spacing: 0.05rem;

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        color: var(--primary-light);
      }
    }

    &:active {
      color: var(--primary-dark);
    }

    @include mobile_all {
      margin: 0rem 0;
      font-size: 1.4rem;
    }
  }

  a.router-link-active {
    color: var(--primary);

    &:hover {
      color: var(--primary-light);
    }
  }

  .m_menu_close {
    display: none;

    @include mobile_all {
      display: flex;
      justify-content: flex-end;
      width: 100%;
    }

    @include mobile {
      justify-content: center;
    }
  }

  .m_menu_login {
    display: none;

    @include mobile_all {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 4rem 0;
      border-bottom: 1px solid var(--primary);

      .btn_login {
        text-decoration: underline;
        padding: 0;

        @media (hover: hover) and (pointer: fine) {
          &:hover {
            color: var(--primary-light);
          }
        }

        &:active {
          color: var(--primary-dark);
        }
      }
    }
  }

  .wrap_auth {
    display: none;

    @include mobile_all {
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: 4rem 0;
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
        color: var(--text3);
      }
    }

    .auth_items {
      ul > li {
        margin: 3.2rem 0 0 0;

        a,
        span {
          font-size: 1.4rem;
          font-weight: 500;
          text-transform: uppercase;
          color: var(--primary);
        }
      }
    }
  }

  .wrap_nav_item {
    ul {
      display: flex;
      flex-direction: row;
      width: calc(120rem - 4.8rem);
      counter-reset: number 0;

      @include mobile_all {
        width: 100%;
      }

      @include mobile_all {
        flex-direction: column;
      }
    }

    .nav_item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: calc(100% / 3);

      @include mobile_all {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        width: auto;
        margin: 4rem 0 0;
        background-color: transparent;
      }

      a {
        position: relative;
        z-index: 3;
        padding: 0.8rem;

        @include mobile_all {
          padding: 0;
        }
      }

      .wrap_nav_item_child {
        width: 100%;
        padding: 4.8rem 0 0;
        border-radius: 0 0 3.2rem 3.2rem;
        justify-content: center;

        @include mobile_all {
          opacity: 1;
          position: relative;
          top: 0;
          display: flex;
          margin: 3.2rem 0 0 0rem;
          border-radius: 0;
          box-shadow: 0 0;
          padding: 0;
        }

        ul.nav_item_child {
          display: flex;
          justify-content: center;
          border-radius: 3.2rem;
          background: var(--text1);
          padding: 0 2.4rem;
          border: 1px solid var(--border2);
          width: auto;

          @include mobile_all {
            padding: 0;
            background-color: transparent;
            box-shadow: 0 0;
            border-radius: 0;
            border: 0;
            margin: 0 0 0 4.8rem;
          }

          li {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 4.8rem;
            position: relative;

            @include mobile_all {
              display: block;
              height: auto;
              margin: 0 0 3.2rem 0;

              &:last-child {
                margin: 0;
              }
            }

            a {
              padding: 1.2rem;

              @include mobile_all {
                padding: 0;
              }
            }
          }
        }
      }
    }

    li.nav_item {
      position: relative;

      &:first-child::before {
        display: none;
      }

      &::before {
        content: '';
        position: absolute;
        left: 0;
        width: 0.1rem;
        height: 1.2rem;
        background-color: var(--border3);

        @include mobile_all {
          display: none;
        }
      }
    }

    .item_number {
      display: flex;
      flex-direction: row;
      align-items: center;

      &::before {
        @include mobile_all {
          counter-increment: number 1;
          content: counter(number, decimal-leading-zero);
          width: 4.8rem;
          font-size: 1.6rem;
          font-weight: 500;
          color: var(--primary);
        }
      }
    }
  }
}
</style>
