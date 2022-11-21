<template>
  <nav class="nav">
    <!-- Close button -->
    <div class="m_menu_close">
      <button class="btn_close" @click="onChangeDisply('gnb')">
        <i class="material-icons">close</i>
      </button>
    </div>

    <!-- Login rink -->
    <div class="m_menu_login" v-if="!user._id">
      <router-link :to="{ name: 'login' }" class="a_login" @click="onChangeDisplay('view')"> 로그인 </router-link>
      이 필요합니다.
    </div>

    <!-- Account info -->
    <div class="wrap_auth" v-else>
      <div class="auth">
        <img class="avatar" src="../../assets/4.jpg" alt="user_avatar" />
        <span class="nickname">{{ user.nickname }} 님</span>
      </div>

      <div class="auth_items">
        <ul>
          <li><router-link :to="{ name: 'account' }">Account</router-link></li>
          <li><router-link :to="{ name: 'profile', params: { nickname: user.nickname } }">Profile</router-link></li>
          <li><button @click="onLogout">Logout</button></li>
        </ul>
      </div>
    </div>

    <!-- Menu links -->
    <div class="wrap_nav_item">
      <ul>
        <li class="nav_item"><router-link :to="{ name: 'home' }" class="item_number">home</router-link></li>
        <li v-for="(subMenus, main) in menus" :key="main" class="nav_item dropdown">
          <router-link :to="{ name: 'posts', params: { main } }" class="item_number">{{ main }}</router-link>
          <div class="wrap_nav_item_child dropdown_items">
            <ul class="nav_item_child">
              <li v-for="{ _id, sub } in subMenus" :key="_id">
                <router-link :to="{ name: 'posts', params: { main, sub } }">{{ sub }}</router-link>
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

  export default {
    setup(props, { emit }) {
      const { state, dispatch } = useStore()

      const menus = computed(() => state.menu.groupedMenus)
      const user = computed(() => state.auth.user)

      const onLogout = async () => await dispatch('auth/logout')

      const onChangeDisply = (param) => {
        emit('onChangeDisply', param)
      }

      return { menus, user, onLogout, onChangeDisply }
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
        width: 100%;
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
          margin: 3.2rem 0 0 0;

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
      ul {
        display: flex;
        flex-direction: row;
        width: calc(120rem - 4.8rem);
        counter-reset: number 0;

        @include mobile_all {
          width: 100%;
        }

        @include mobile-tablet {
          flex-direction: column;
        }
      }

      .nav_item {
        display: flex;
        justify-content: center;
        align-items: center;
        width: calc(100% / 4);

        @include mobile-tablet {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          width: auto;
          margin: 4.8rem 0 0;
          background-color: transparent;
        }

        a {
          position: relative;
          z-index: 3;
          padding: 0.8rem;

          @include mobile-tablet {
            padding: 0;
          }
        }

        .wrap_nav_item_child {
          width: 100%;
          padding: calc(3.2rem + 0.8rem) 0 0;
          border-radius: 0 0 3.2rem 3.2rem;

          @include tablet_landscape {
            padding: calc(3.4rem + 0.8rem) 0 0;
          }

          @include mobile-tablet {
            opacity: 1;
            position: relative;
            top: 0;
            display: flex;
            margin: 3.2rem 0 0 3.6rem;
            border-left: 1px solid var(--primary);
            border-radius: 0;
            box-shadow: 0 0;
            padding: 0;
          }

          ul {
            display: flex;
            flex-direction: column;
            justify-content: center;
            background-color: #fff;
            width: 100%;
            box-shadow: 0 0.2rem 2rem rgba(0, 0, 0, 0.16);
            border-radius: 0 0 3.2rem 3.2rem;

            @include mobile-tablet {
              padding: 0 0 0 3.2rem;
              background-color: transparent;
              box-shadow: 0 0;
              border-radius: 0 0;
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
                margin: 0 0 3.2rem 0;
              }

              a {
                padding: 1.2rem;

                @include mobile-tablet {
                  padding: 0;
                }
              }

              &:hover {
                background-color: #ededed;
                @include mobile-tablet {
                  background-color: transparent;
                }
              }

              &:last-child {
                border-radius: 0 0 3.2rem 3.2rem;

                @include mobile-tablet {
                  margin-bottom: 0;
                  border-radius: 0;
                }
              }
            }
          }
        }
      }

      li.nav_item {
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

      .item_number {
        display: flex;
        flex-direction: row;

        &::before {
          @include mobile-tablet {
            counter-increment: number 1;
            content: counter(number, decimal-leading-zero);
            margin: 0 3.2rem 0 0;
            font-size: 1.6rem;
            font-weight: 500;
            color: var(--primary-dark);
          }
        }
      }
    }
  }
</style>
