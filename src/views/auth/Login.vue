<template>
  <div class="wrap_login">
    <div class="login">
      <h2>member login</h2>
      <form v-on:submit.prevent="submitForm">
        <label>이메일</label>
        <input type="email" id="email" placeholder="User ID (Email)" spellcheck="false" onfocus="this.placeholder=''" onblur="this.placeholder='User ID (Email)'" v-model="email" />
        <label>비밀번호</label>
        <input type="password" id="password" placeholder="Password" onfocus="this.placeholder=''" onblur="this.placeholder='Password'" v-model="password" />
        <button type="submit" class="btn_submit" @click="onLogin">로그인</button>
      </form>

      <div class="wrap_find_account">
        <p>이메일 또는 비밀번호를 잊으셨나요?</p>
        <a class="btn_find-account">계정 찾기</a>
      </div>

      <div class="wrap_sign-up">
        <router-link :to="{ name: 'signUp' }">회원가입</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'login',
  setup() {
    const { dispatch } = useStore()

    const email = ref('')
    const password = ref('')

    const onLogin = async () => await dispatch('auth/login', { email: email.value, password: password.value })

    return { email, password, onLogin }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.wrap_login {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.login {
  width: calc(30.4rem + 6.4rem + 0.2rem);
  border-radius: 3.2rem;
  border: 1px solid #ddd;
  padding: 6.4rem 3.2rem;

  button {
    font-weight: 500;
    font-size: 1.3rem;
  }

  h2 {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.4rem;
    color: var(--primary-dark);
    margin: 0 0 3.2rem;
    font-weight: 400;
    letter-spacing: 0.1rem;
    text-transform: capitalize;
  }

  form {
    display: flex;
    flex-direction: column;
    font-size: 1.3rem;

    label {
      color: var(--primary-dark);
      margin: 1.6rem 0 0;
    }

    input {
      padding: 0 0 1.6rem;
      margin: 1.6rem 0;
      outline: none;
      font-weight: 400;
      background: transparent;
      border-bottom: 0.1rem solid #e0e0e0;
      width: 100%;
      color: #999;

      &::placeholder {
        color: #bbb;
      }
    }

    .btn_submit {
      margin: 1.6rem 0 0;
      width: 100%;
      height: 4rem;
      border-radius: 3.2rem;
      background-color: var(--primary-dark);
      color: #fff;
    }
  }

  .wrap_find_account {
    margin: 4.8rem 0 3.2rem;
    display: flex;
    flex-direction: column;
    align-items: center;

    p {
      font-size: 1.2rem;
      color: #aaa;
      margin: 0 0 1.6rem;
    }

    a {
      font-size: 1.4rem;
      color: var(--primary-dark);
      text-decoration: underline;
    }
  }

  .wrap_sign-up {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    border-top: 0.1rem solid #ddd;
    padding: 3.2rem 0 0;

    a {
      font-size: 1.4rem;
      color: var(--primary-dark);
    }
  }
}
</style>
