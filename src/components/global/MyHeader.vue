<template>
  <div class="container_bar">
    <div class="bar">
      <div class="wrap_left">
        <Button
          :class="isMobile ? 'btn_m-toggle' : 'btn_search'"
          :size="'md'"
          :svg="isMobile ? 'menu' : !isMobile && searchState ? 'close' : 'search'"
          :customColor="'#fff'"
          :customPadding="'0'"
          @click="isMobile ? onChangeDisply('gnb') : onChangeDisply('search')"
        >
        </Button>
      </div>

      <div class="logo">
        <router-link :to="{ name: 'home' }" class="a_logo">
          <img :src="LOGO" />
        </router-link>
      </div>

      <div class="wrap_right">
        <div class="wrap_auth" v-if="!isMobile && user.nickname">
          <router-link :to="{ name: 'editor' }" class="a_create">
            <Ico :size="'md'" :svg="'create'" />
          </router-link>
          <div class="auth dropdown">
            <AuthorSlot :user="user" />
            <div class="auth_items dropdown_items">
              <ul>
                <li><router-link :to="{ name: 'account' }">Account</router-link></li>
                <li>
                  <router-link :to="{ name: 'profile', params: { nickname: user.nickname } }">Profile</router-link>
                </li>
                <li><span @click="onLogout">Logout</span></li>
              </ul>
            </div>
          </div>
        </div>

        <router-link :to="{ name: 'login' }" class="a_login" v-else-if="!isMobile && !isLogin">
          <Ico :size="'md'" :svg="'lock'" />
        </router-link>

        <Button
          v-else-if="isMobile"
          class="btn_search"
          :size="'md'"
          :svg="searchState ? 'close' : 'search'"
          :customColor="'#fff'"
          :customPadding="'0'"
          @click="onChangeDisply('search')"
        />
      </div>
    </div>
  </div>

  <div class="container_gnb">
    <div class="gnb">
      <Navigation @onChangeDisply="onChangeDisply" />
    </div>
  </div>

  <div class="container_searchForm">
    <SearchForm />
  </div>
</template>

<script>
  import { ref, computed, onBeforeMount, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import { useMedia } from '../../common/mediaQuery'
  import Navigation from './Navigation.vue'
  import SearchForm from '../SearchForm.vue'
  import AuthorSlot from '../slots/AuthorSlot.vue'
  import LOGO from '../../assets/logo.png'

  export default {
    components: {
      Navigation,
      SearchForm,
      AuthorSlot,
    },
    setup() {
      const { state, dispatch } = useStore()
      const gnb = ref(null)
      const searchForm = ref(null)
      const mediaQuery = window.matchMedia('only screen and (max-width: 1023px')
      const isMobile = ref(mediaQuery.matches)
      const gnbState = ref(false)
      const searchState = ref(false)

      const isLogin = computed(() => state.auth.isLogin)
      const user = computed(() => state.auth.user)

      const onLogout = async () => await dispatch('auth/logout')

      const onChangeDisply = (param) => {
        if (param === 'gnb') {
          if (searchState.value) {
            searchState.value = !searchState.value
            searchForm.value.style.display = searchState.value ? 'flex' : 'none'
          }
          gnbState.value = !gnbState.value
          gnb.value.style.display = gnbState.value ? 'flex' : 'none'
        } else {
          if (gnbState.value) {
            gnbState.value = !gnbState.value
            gnb.value.style.display = gnbState.value ? 'flex' : 'none'
          }
          searchState.value = !searchState.value
          searchForm.value.style.display = searchState.value ? 'flex' : 'none'
        }
      }

      onBeforeMount(() => {
        mediaQuery.addEventListener('change', () => {
          isMobile.value = mediaQuery.matches
          if (!isMobile.value) {
            gnb.value.style.display = 'flex'
          } else if (isMobile.value && gnbState.value) {
            gnb.value.style.display = 'flex'
          } else {
            gnb.value.style.display = 'none'
          }
        })
      })

      onMounted(() => {
        gnb.value = document.querySelector('.container_gnb')
        searchForm.value = document.querySelector('.container_searchForm')
      })

      return { LOGO, isMobile, searchState, isLogin, user, onLogout, onChangeDisply }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .container_bar {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 5;
    width: 100%;
    background: var(--primary);

    .bar {
      display: flex;
      flex-direction: row;
      align-items: center;
      min-width: calc(120rem - 4.8rem);
      max-width: calc(120rem - 4.8rem);
      height: 6.4rem;
      margin: 0 2.4rem;
      font-size: 1.4rem;
      color: #fff;

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
        color: #fff;
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

            &::v-deep .author {
              flex-direction: row-reverse;

              .wrap_avatar {
                margin: 0 0 0 1.2rem;
              }
            }

            .auth_items {
              justify-content: center;
              padding: 5.6rem 0 0;

              ul {
                background-color: var(--border-light);
                box-shadow: 0 0.1rem 2rem rgba(0, 0, 0, 0.2);
                cursor: default;
              }

              li {
                width: 10rem;
                margin: 2.4rem 0;
                text-align: center;

                @include tablet_landscape {
                  width: 12rem;
                  margin: 3.2rem 0;
                }

                a,
                span {
                  font-size: 1.2rem;
                  font-weight: 400;
                  color: var(--text-light);
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
    position: relative;
    z-index: 3;
    width: 100%;
    box-shadow: 0 0.1rem 2rem rgba(0, 0, 0, 0.16);

    @include mobile-tablet {
      display: none;
      justify-content: flex-start;
      box-shadow: 0 0;
    }

    .gnb {
      display: flex;
      align-items: center;
      width: calc(120rem - 4.8rem);
      height: 4.8rem;
      background-color: #fff;

      @include mobile {
        width: calc(100% - 4rem);
        margin: 0 2rem;
      }

      @include mobile-tablet {
        width: auto;
        margin: 0;
      }

      @include tablet_landscape {
        width: calc(100% - 6.4rem);
        margin: 0 3.2rem;
      }
    }
  }

  .container_searchForm {
    display: none;
    justify-content: center;
    position: absolute;
    top: 0;
    z-index: 5;
    width: 100%;
    height: 16rem;
    margin: 6.4rem 0 0 0;
    background: var(--primary);
  }
</style>
