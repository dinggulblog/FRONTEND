<template>
  <div id="header">
    <MyHeader :isLogin="$store.state.auth.isLogin" />
  </div>

  <div class="content-container">
    <div id="content">
      <div>
        <router-view />
      </div>
    </div>
  </div>

  <div id="footer">
    <div class="wrap_contents">
      <p class="links">
        <a href="https://github.com/dinggulblog" target="_blank"> <Ico :size="'lg'" :svg="'github'" class="ico_link" />dinggul project github </a>
      </p>
    </div>
  </div>

  <div class="btn_create" v-if="$store.state.auth.isLogin">
    <router-link :to="{ name: 'editor' }" class="a_create"><Ico :size="'md'" :svg="'create'" /></router-link>
  </div>

  <Dialog ref="DIALOG_EL" />
  <Toast ref="TOAST_EL" />
  <Account ref="ACCOUNT_EL" />
  <Contact ref="CONTACT_EL" />
</template>

<script setup>
import { ref, provide } from 'vue'

const DIALOG_EL = ref(null)
const TOAST_EL = ref(null)
const ACCOUNT_EL = ref(null)
const CONTACT_EL = ref(null)

provide('DIALOG_EL', DIALOG_EL)
provide('TOAST_EL', TOAST_EL)
provide('ACCOUNT_EL', ACCOUNT_EL)
provide('CONTACT_EL', CONTACT_EL)
</script>

<style lang="scss" rel="stylesheet/scss">
@import './scss/common.scss';
@import './scss/fade.scss';

#header {
  position: sticky;
  top: 0;
  z-index: 997;
  background: var(--bg1);
}

.content-container {
  display: flex;
  justify-content: center;

  #content {
    position: relative;
    width: calc(120rem - 4.8rem);
    margin: 4.8rem 2.4rem;
    box-sizing: border-box;

    @include mobile {
      width: calc(100% - 4rem);
      margin: 4rem 2rem;
    }

    @include tablet {
      width: calc(100% - 12.8rem);
      margin: 4rem 6.4rem;
    }

    @include tablet_landscape {
      width: calc(100% - 6.4rem);
      margin: 4rem 3.2rem;
    }
  }
}

#footer {
  width: 100%;
  font-size: 1.2rem;
  color: #a5a5a5;
  letter-spacing: 0.05rem;
  border-top: 1px solid var(--border2);
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
        font-weight: 500;

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
    color: var(--text1);
    background-color: var(--primary);
    border-radius: 50%;
    box-shadow: var(--shadow1);
  }
}
</style>
