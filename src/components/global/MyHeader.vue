<template>
  <div class="container_bar">
    <div class="bar">
      <div class="wrap_left">
        <Button
          :class="isMobile ? 'btn_m-toggle' : 'btn_search'" 
          :svg="isMobile ? 'menu' : isOpenSearch ? 'close' : 'search'"
          @click="isMobile ? onToggleGnb() : push({ name: 'search' })"
        />
      </div>

      <div class="logo">
        <router-link :to="{ name: 'home' }" class="a_logo">
          <img :src="LOGO" />
        </router-link>
      </div>

      <div class="wrap_right">
        <Button v-if="!isMobile && !isLogin" :class="'btn_login'" :svg="'lock'" @click="ACCOUNT_EL.open('login')"/>

        <div class="wrap_auth" v-else-if="!isMobile && user.nickname">
          <div class="auth dropdown">
            <User :profile="user" />
            <div class="auth_items dropdown_items">
              <ul>
                <li>
                  <span @click="ACCOUNT_EL.open('update')">Account</span>
                </li>
                <li>
                  <router-link :to="{ name: 'profile', params: { nickname: user.nickname } }">Profile</router-link>
                </li>
                <li>
                  <span @click="onLogout">Logout</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Button v-else class="btn_search" :svg="isOpenSearch ? 'close' : 'search'" @click="onToggleSearch" />
      </div>
    </div>
  </div>

  <Transition name="fade_left">
    <div class="container_gnb" v-if="!isMobile || isOpenGnb">
      <div class="gnb">
        <Navigation @logout="onLogout" @closeAll="onCloseAll" />
      </div>
    </div>
  </Transition>

  <Transition name="fade_down">
    <div class="container_searchForm" v-if="isOpenSearch">
      <SearchForm />
    </div>
  </Transition>
</template>

<script setup>
  import { inject, ref, computed } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  import { useMedia } from '../../common/mediaQuery'
  import Navigation from './Navigation.vue'
  import User from '../User.vue'
  import LOGO from '../../assets/logo.png'

  const props = defineProps({
    isLogin: {
      type: Boolean,
      default: false,
    },
  })

  const { state, dispatch } = useStore()
  const { push } = useRouter()

  const ACCOUNT_EL = inject('ACCOUNT_EL')

  const isOpenGnb = ref(false)
  const isOpenSearch = ref(false)
  const isMobile = useMedia('only screen and (max-width: 1199px)')

  const user = computed(() => state.auth.user)

  const onLogout = async () => {
    await dispatch('auth/logout')
  }

  const onCloseGnb = () => {
    isOpenGnb.value = false
  }

  const onCloseSearch = () => {
    isOpenSearch.value = false
  }

  const onCloseAll = () => {
    onCloseGnb()
    onCloseSearch()
  }

  const onToggleGnb = () => {
    isOpenGnb.value = !isOpenGnb.value
  }

  const onToggleSearch = () => {
    isOpenSearch.value = !isOpenSearch.value
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .fade_left-leave-active {
    transition: opacity 0s;
  }

  .container_bar {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 0 0 0;
    border-bottom: 1px solid var(--border2);

    .bar {
      display: flex;
      flex-direction: row;
      align-items: center;
      min-width: calc(120rem - 4.8rem);
      max-width: calc(120rem - 4.8rem);
      height: 6.4rem;
      margin: 0 2.4rem;
      font-size: 1.4rem;
      color: var(--text3);

      @include mobile_all {
        font-size: 1.6rem;
      }

      @include mobile {
        min-width: calc(100% - 4rem);
        margin: 0 2rem;
      }

      @include tablet {
        min-width: calc(100% - 9.6rem);
        margin: 0 4.8rem;
      }

      @include tablet_landscape {
        min-width: calc(100% - 6.4rem);
        margin: 0 3.2rem;
      }

      a {
        color: var(--text3);
      }

      .logo {
        display: flex;
        flex-basis: 60%;
        flex-shrink: 2;
        justify-content: center;
        .a_logo {
          font-size: 2.4rem;

          img {
            width: 14rem;
          }
        }
      }
      .wrap_left {
        display: flex;
        flex-basis: 20%;
        flex-shrink: 1;
      }
      .wrap_right {
        display: flex;
        flex-shrink: 1;
        flex-basis: 20%;
        justify-content: flex-end;
        align-items: center;

        .ico_lock {
          cursor: pointer;
        }

        .wrap_auth {
          display: flex;
          align-items: center;
          .a_create {
            @include mobile_all {
              display: none;
            }
          }
          .auth {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin: 0 0 0 4.8rem;

            &:deep(.user-info) {
              flex-direction: row-reverse;

              .wrap_avatar {
                margin: 0 0 0 1.2rem;
              }
            }

            .auth_items {
              padding: 4rem 0 0;

              ul {
                background-color: var(--bg2);
                box-shadow: var(--shadow1);
                border-radius: 1.2rem;
                cursor: default;
                position: relative;
                z-index: 999;
              }

              li {
                width: 10rem;
                margin: 2rem 0;
                text-align: center;

                @include tablet_landscape {
                  width: 12rem;
                  margin: 3.2rem 0;
                }

                a,
                span {
                  font-size: 1.2rem;
                  font-weight: 400;
                  color: var(--text3);
                  cursor: pointer;

                  @include tablet_landscape {
                    font-size: 1.6rem;
                  }
                }
              }
            }
          }
        }

        .a_create,
        .a_login {
          display: flex;
          align-items: center;
        }
      }
    }
  }

  .container_gnb {
    display: flex;
    justify-content: center;
    width: 100%;
    border-bottom: 1px solid var(--border2);

    @include mobile_all {
      display: flex;
      justify-content: flex-start;
      box-shadow: 0 0;
      position: fixed;
      top: 0;
    }

    .gnb {
      display: flex;
      align-items: center;
      width: calc(120rem - 4.8rem);
      height: 4.8rem;
      background-color: var(--bg1);

      @include mobile_all {
        width: auto;
        height: auto;
        border-right: 1px solid var(--border2);
      }

      @include mobile {
        width: 100%;
        border: 0;
      }
    }
  }

  .container_searchForm {
    display: flex;
    justify-content: center;
    position: absolute;
    top: 0;
    z-index: 5;
    width: 100%;
    height: 16rem;
    margin: 6.4rem 0 0 0;
    background: var(--bg1);
  }
</style>
