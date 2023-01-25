<template>
  <div id="header">
    <MyHeader />
  </div>

  <div class="content-container">
    <div id="content">
      <router-view />
    </div>
  </div>

  <div id="footer">
    <div class="wrap_contents">
      <p class="links">
        <a href="https://github.com/dinggulblog" target="_blank">
          <Ico size="lg" svg="github" class="ico_link" />dinggul project github
        </a>
      </p>
    </div>
  </div>

  <div class="btn_create" v-if="isLogin">
    <router-link :to="{ name: 'editor' }" class="a_create"><i class="material-icons">create</i></router-link>
  </div>

  <Dialog ref="DIALOG_EL"></Dialog>
  <ToastMessage ref="TOAST_EL"></ToastMessage>
</template>

<script>
  import { defineComponent, ref, computed, provide } from 'vue'
  import { useStore } from 'vuex'
  import MyHeader from './components/global/MyHeader.vue'

  export default defineComponent({
    name: 'app',
    components: {
      MyHeader,
    },
    setup() {
      const { state } = useStore()

      const DIALOG_EL = ref(null)
      const TOAST_EL = ref(null)

      const isLogin = computed(() => state.auth.isLogin)

      provide('DIALOG_EL', DIALOG_EL)
      provide('TOAST_EL', TOAST_EL)

      return { DIALOG_EL, TOAST_EL, isLogin }
    },
  })
</script>

<style lang="scss" rel="stylesheet/scss">
  @import './scss/common.scss';
  @import './scss/fade.scss';

  #header {
    position: sticky;
    top: 0;
    z-index: 999;
    background: #fff;
  }

  .content-container {
    display: flex;
    justify-content: center;

    #content {
      width: calc(120rem - 4.8rem);
      margin: 0 2.4rem;
      padding: 3.2rem 0 0;
      box-sizing: border-box;

      @include mobile {
        width: calc(100% - 4rem);
        margin: 0 2rem;
      }

      @include tablet {
        width: calc(100% - 12.8rem);
        margin: 0 6.4rem;
      }

      @include tablet_landscape {
        width: calc(100% - 6.4rem);
        margin: 0 3.2rem;
      }
    }
  }

  #footer {
    width: 100%;
    margin: 4.8rem 0 0;
    font-size: 1.2rem;
    color: #a5a5a5;
    letter-spacing: 0.1rem;
    border-top: 1px solid #e5e5e5;
    height: 8rem;
    display: flex;
    justify-content: center;
    align-items: center;

    .wrap_contents {
      width: calc(120rem - 4.8rem);
      text-transform: capitalize;
      display: flex;

      @include mobile {
        width: calc(100% - 4rem);
        margin: 0 2rem;
      }

      @include tablet {
        width: calc(100% - 12.8rem);
        margin: 0 6.4rem;
      }

      @include tablet_landscape {
        width: calc(100% - 6.4rem);
        margin: 0 3.2rem;
      }

      .links {
        a {
          color: var(--primary);
          display: flex;
          align-items: center;

          .ico_link {
            margin: 0 0.8rem 0 0;
          }
        }
      }
    }
  }

  .btn_create {
    position: absolute;
    bottom: 4.8rem;
    right: 4.8rem;
    z-index: 15;

    @include mobile {
      bottom: 2.4rem;
      right: 2.4rem;
    }

    .a_create {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 4.8rem;
      height: 4.8rem;
      color: #fff;
      background-color: var(--secondary);
      border-radius: 50%;
      box-shadow: 0 0.8rem 1.6rem rgba(0, 0, 0, 0.12);
    }
  }
</style>
