<template>
  <div class="container_bar">
    <div class="bar">
      <div class="wrap_left">
        <Button
          :class="isMobile ? 'btn_m-toggle' : 'btn_search'"
          size="md"
          :svg="isMobile ? 'menu' : searchState.isOpen ? 'close' : 'search'"
          customColor="#a5a5a5"
          customPadding="0"
          @click="isMobile ? onToggleGnbVisible() : onToggleSearchVisible()"
        >
        </Button>
      </div>

      <div class="logo">
        <router-link :to="{ name: 'home' }" class="a_logo">
          <img :src="LOGO" />
        </router-link>
      </div>

      <div class="wrap_right">
        <span class="a_login" v-if="!isMobile && !isLogin" @click="$refs.ACCOUNT_EL.open('login')">
          <Ico size="md" svg="lock" />
        </span>

        <div class="wrap_auth" v-else-if="!isMobile && profile.nickname">
          <div class="auth dropdown">
            <AuthorSlot :profile="profile" />
            <div class="auth_items dropdown_items">
              <ul>
                <li><span @click="$refs.ACCOUNT_EL.open('update')">Account</span></li>
                <li>
                  <router-link :to="{ name: 'profile', params: { nickname: profile.nickname } }">Profile</router-link>
                </li>
                <li><span @click="onLogout">Logout</span></li>
              </ul>
            </div>
          </div>
        </div>

        <Button
          v-else
          class="btn_search"
          size="md"
          :svg="searchState.isOpen ? 'close' : 'search'"
          customColor="#a5a5a5"
          customPadding="0"
          @click="onToggleSearchVisible"
        />
      </div>
    </div>
  </div>

  <Transition name="gnb_fade">
    <div class="container_gnb" v-if="gnbState.display">
      <div class="gnb">
        <Navigation
          @toggleGnbVisible="onToggleGnbVisible"
          @toggleSearchVisible="onToggleSearchVisible"
          @close="onClose"
          @openLoginModal="$refs.ACCOUNT_EL.open('login')"
          @openAccountModal="$refs.ACCOUNT_EL.open('update')"
          ref="GNB_EL"
        />
      </div>
    </div>
  </Transition>

  <Transition name="search_fade">
    <div class="container_searchForm" v-if="searchState.display">
      <SearchForm />
    </div>
  </Transition>

  <Account ref="ACCOUNT_EL"></Account>
</template>

<script>
  import { ref, reactive, computed } from 'vue'
  import { useStore } from 'vuex'
  import { useMedia } from '../../common/mediaQuery'
  import Navigation from './Navigation.vue'
  import SearchForm from './SearchForm.vue'
  import AuthorSlot from '../slotdata/AuthorSlot.vue'
  import Account from './Account.vue'
  import LOGO from '../../assets/logo.png'

  export default {
    components: {
      Navigation,
      SearchForm,
      AuthorSlot,
      Account,
    },
    setup() {
      const { state, dispatch } = useStore()

      const ACCOUNT_EL = ref(null)
      const GNB_EL = ref(null)
      const isMobile = useMedia('only screen and (max-width: 1199px)')
      const isLogin = computed(() => state.auth.isLogin)

      const profile = reactive({
        nickname: computed(() => state.auth.profile.nickname),
        avatar: computed(() => state.auth.profile.avatar),
      })

      const gnbState = reactive({
        isOpen: false,
        display: computed(() => (!isMobile.value ? true : gnbState.isOpen ? true : false)),
      })
      const searchState = reactive({
        isOpen: false,
        display: computed(() => (searchState.isOpen ? true : false)),
      })

      const onLogout = async () => {
        await dispatch('auth/logout')
      }

      const onClose = () => {
        gnbState.isOpen = false
        searchState.isOpen = false
      }

      const onToggleGnbVisible = () => {
        searchState.isOpen = false
        gnbState.isOpen = !gnbState.isOpen
      }

      const onToggleSearchVisible = () => {
        gnbState.isOpen = false
        searchState.isOpen = !searchState.isOpen
      }

      return {
        LOGO,
        ACCOUNT_EL,
        GNB_EL,
        isMobile,
        isLogin,
        profile,
        gnbState,
        searchState,
        onLogout,
        onClose,
        onToggleGnbVisible,
        onToggleSearchVisible,
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  /* gnb fade */
  .gnb_fade-enter-active {
    transition: opacity 0.5s ease;
  }
  .gnb_fade-enter-from,
  .gnb_fade-leave-to {
    opacity: 0;
  }

  .gnb_fade-enter-active {
    animation: gnbfadeIn 0.3s;
  }

  .gnb_fade-leave-active {
    animation: gnbfadeOut 0.3s;
  }

  @keyframes gnbfadeIn {
    from {
      transform: translateX(-4rem);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes gnbfadeOut {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-4rem);
    }
  }

  /* search fade */

  .search_fade-enter-active,
  .search_fade-leave-active {
    transition: opacity 0.5s ease;
  }
  .search_fade-enter-from,
  .search_fade-leave-to {
    opacity: 0;
  }

  .search_fade-enter-active {
    animation: searchfadeIn 0.3s;
  }

  .search_fade-leave-active {
    animation: searchfadeOut 0.3s;
  }

  @keyframes searchfadeIn {
    from {
      transform: translateY(-4rem);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes searchfadeOut {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-4rem);
    }
  }
  .container_bar {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 5;
    width: 100%;

    .bar {
      display: flex;
      flex-direction: row;
      align-items: center;
      min-width: calc(120rem - 4.8rem);
      max-width: calc(120rem - 4.8rem);
      height: 6.4rem;
      margin: 0 2.4rem;
      font-size: 1.4rem;
      color: var(--text-light);

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
        color: var(--text-light);
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

            &:deep(.author) {
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
    border-top: 1px solid #e5e5e5;

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
      height: 6.4rem;
      background-color: #fff;

      @include mobile_all {
        width: auto;
        height: auto;
      }

      @include mobile {
        width: 100%;
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
    background: #fff;
  }
</style>
