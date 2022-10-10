<template>
  <div class="container_bar">
    <div class="bar">
      <div class="wrap_left">
        <button :class="isMobile ? 'btn_m-toggle' : 'btn_search'">
          <i class="material-icons" @click="onChangeDisplay(isMobile ? 'onMobileBar' : 'onSearchForm')">{{ isMobile ? 'menu' : displayState.display === 'onSearchForm' ? 'close' : 'search' }}</i>
        </button>
      </div>

      <div class="logo">
        <router-link :to="{ name: 'home' }" class="a_logo">DINGGUL</router-link>
      </div>

      <div class="wrap_right">
        <div class="wrap_auth" v-if="!isMobile && user.email">
          <router-link :to="{ name: 'editor' }" class="a_create"><i class="material-icons">create</i></router-link>
          <div class="auth dropdown">
            <span class="nickname">{{ user.nickname }} 님</span>
            <img class="avatar" src="../assets/4.jpg" alt="user_avatar" />
            <div class="auth_items dropdown_items">
              <ul>
                <li><router-link :to="{ name: 'account' }">Account</router-link></li>
                <!--
                <li><router-link :to="{ name: 'profile', params: { nickname: user.nickname } }">Profile</router-link></li>
                -->
                <li><button @click="onLogout">Logout</button></li>
              </ul>
            </div>
          </div>
        </div>

        <router-link :to="{ name: 'login' }" class="a_login" v-if="!isMobile && !user.email"><i class="material-icons">person</i></router-link>

        <button class="btn_search" v-if="isMobile" @click="onChangeDisplay('onSearchForm')">
          <i class="material-icons">{{ displayState.display === 'onSearchForm' ? 'close' : 'search' }}</i>
        </button>
      </div>
    </div>
  </div>

  <div class="container_gnb" v-if="!isMobile || displayState.display === 'onMobileBar'" :style="[displayState.display === 'onMobileBar' || displayState.display === 'view' ? { display: 'flex' } : { display: 'none' }]">
    <div class="gnb">
      <Navigation @onChangeDisplay="onChangeDisplay" />
    </div>
  </div>

  <div class="container_searchForm" v-if="displayState.display === 'onSearchForm'" :style="[displayState.display === 'onSearchForm' ? { display: 'flex' } : { display: 'none' }]">
    <SearchForm />
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Navigation from '../components/Navigation.vue'
import SearchForm from '../components/SearchForm.vue'

export default {
  components: {
    Navigation,
    SearchForm,
  },
  setup() {
    const store = useStore()
    const router = useRouter()

    const mediaQuery = window.matchMedia('only screen and (max-width: 1023px')
    const isMobile = ref(mediaQuery.matches)
    const displayState = reactive({
      display: 'view',
    })

    onMounted(() => {
      mediaQuery.addEventListener('change', () => {
        isMobile.value = mediaQuery.matches
      })
    })

    const user = computed(() => store.state.auth.user)
    const searchText = ref('')

    const onLogout = async () => {
      const response = await store.dispatch('auth/logout')
      response.success ? router.push({ name: 'home' }) : alert(response.message)
    }

    const onChangeDisplay = async (state) => {
      displayState.display !== state ? (displayState.display = state) : (displayState.display = 'view')
      console.log('ㅋ', displayState.display)
    }

    return { isMobile, displayState, user, searchText, onLogout, onChangeDisplay }
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
    width: calc(120rem - 4.8rem);
    height: 6.4rem;
    margin: 0 2.4rem;
    font-size: 1.4rem;
    color: #fff;

    @include mobile_all {
      font-size: 1.6rem;
    }

    @include mobile {
      width: calc(100% - 4rem);
      margin: 0 2rem;
    }

    @include tablet {
      width: calc(100% - 6.4rem);
      margin: 0 4.8rem;
    }

    @include tablet_landscape {
      width: calc(100% - 6.4rem);
      margin: 0 3.2rem;
    }

    i {
      font-size: 2rem;
      color: #fff;

      @include mobile_all {
        font-size: 2.4rem;
      }
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
        flex-direction: row;
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
          .nickname {
            font-family: 'Noto Sans KR';
          }
          .avatar {
            width: 3.2rem !important;
            height: 3.2rem !important;
            margin-left: 1.6rem;
            border-radius: 50%;
          }
          .auth_items {
            display: flex;
            justify-content: center;
            padding: 4.8rem 0 0;

            ul {
              background-color: var(--border-light);
              box-shadow: 0 0.1rem 2rem rgba(0, 0, 0, 0.16);
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
              button {
                font-size: 1.2rem;
                font-weight: 400;
                color: var(--text-light);

                @include tablet_landscape {
                  font-size: 1.6rem;
                }
              }
            }
          }
        }
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
