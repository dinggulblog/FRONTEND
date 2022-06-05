<template>
  <div class="login">
    <div class="loginWrap">
      <div>
        <h2>You need to <span>sign in</span> to use our service</h2>
      </div>

      <form v-on:submit.prevent="submitForm">
        <div class="form">
          <input type="email" id="email" placeholder="ID" onfocus="this.placeholder=''" onblur="this.placeholder='User ID (Email)'" v-model="email" />

          <input
            type="password"
            id="password"
            placeholder="Password"
            onfocus="this.placeholder=''"
            onblur="this.placeholder='Password'"
            v-model="password"
            @keydown.enter="onLogin()"
          />

          <button type="submit" @click="onLogin()">Sign In</button>
        </div>
      </form>

      <router-link :to="{ name: 'account', params: { type: 'sign-up' } }">
        <button class="signUp" type="submit">Sign Up</button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'login',
  setup() {
    const router = useRouter()
    const store = useStore()
    const email = ref('')
    const password = ref('')

    const onLogin = async () => {
      try {
        const { data } = await store.dispatch('auth/login', { email: email.value, password: password.value })
        data ? router.push({ name: 'home' }) : alert('아이디가 존재하지 않거나, 아이디와 비밀번호가 일치하지 않습니다.')
      } catch (err) {
        console.log(err)
        alert('Login failed. Please retry login.')
      }
    }

    return { email, password, onLogin }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
}

.loginWrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  width: 540px;
  height: 420px;
  border-top: 8px solid;
  border-color: var(--point);

  h2 {
    font-style: italic;
    font-size: 20px;
    color: #b3b3b3;
    font-weight: 500;
    margin-bottom: 47px;

    span {
      color: var(--point);
      font-weight: 500;
      font-style: normal;
    }
  }

  .form {
    display: grid;
    gap: 5px;
    grid-template-columns: 207px 140px;
    grid-template-rows: repeat(2, 45px);

    input {
      padding: 12px 10px 10px;
      border: 1px solid #d8d8d8;
      font-size: 14px;
      color: #959595;
      font-weight: 500;
    }

    input:nth-child(1) {
      grid-row: 1 / 2;
      grid-column: 1 / 2;
    }

    input:nth-child(2) {
      grid-row: 2 / 3;
      grid-column: 1 / 2;
    }

    button {
      grid-row: 1 / 3;
      grid-column: 2 / 4;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      background: var(--point);
      border: 0;
      color: #fff;
      font-size: 16px;
      font-weight: 700;
    }
  }

  .signUp {
    margin-top: 47px;
    border: 0;
    text-transform: uppercase;
    text-decoration: underline;
    font-size: 18px;
    color: var(--point);
    font-weight: 700;
    letter-spacing: 0.1em;
  }

  input::placeholder {
    font-size: 14px;
    color: #cbcbcb;
    font-weight: 500;
  }
}

.back {
  color: var(--primary);
  font-size: 14px;
  font-weight: 900;
  text-transform: uppercase;
  text-decoration: none;
  letter-spacing: 0.2em;
  margin-top: 50px;
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    font-weight: bold;
    margin-right: 10px;
    position: relative;
    top: -0.7px;
  }
}
</style>
