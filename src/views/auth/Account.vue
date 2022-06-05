<template>
  <div class="accountEditor">
    <Form @submit="onSubmit" :validation-schema="schema">
      <h2 v-text="type === 'sign-up' ? 'Create Account' : 'Modify Account'"></h2>
      <TextInput
        name="email"
        type="email"
        label="E-mail"
        placeholder="Email"
        success-message="올바른 이메일 주소입니다."
        :value="user?.email"
        :disabled="!isNew"
      />
      <TextInput v-show="!isNew" name="currentPassword" type="password" label="Current Password" placeholder="Current Password" />
      <TextInput name="password" type="password" label="Password" placeholder="Password" />
      <TextInput
        name="passwordConfirmation"
        type="password"
        label="Confirm Password"
        placeholder="Type it again"
        success-message="Password is verified."
      />
      <TextInput name="nickname" type="text" label="Name" placeholder="Name" />
      <button class="submit-btn" type="submit">Submit</button>
    </Form>
    <Dialog ref="Dialog"></Dialog>
  </div>
</template>

<script>
import { ref, computed, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Form } from 'vee-validate'
import * as Yup from 'yup'
import TextInput from '../../components/TextInput.vue'
import Dialog from '../../components/Dialog.vue'

export default {
  name: 'account',
  components: {
    Form,
    TextInput,
    Dialog,
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const user = computed(() => store.state.auth.user)
    const type = computed(() => route.params.type)
    const isNew = ref(type.value == 'sign-up' ? true : false)

    const Dialog = ref(null)

    onBeforeMount(async () => {
      try {
        if (sessionStorage.getItem('nickname')) {
          await store.dispatch('auth/getUserInfo', sessionStorage.getItem('nickname'))
        }
      } catch (error) {
        router.push({ name: 'login' })
      }
    })

    const schema = Yup.object().shape({
      email: Yup.string().required('닉네임을 정해주세요.').email(),
      password: Yup.string()
        .required('비밀번호를 입력해주세요')
        .min(4, '4~30자 영문 대 소문자, 숫자, 특수문자를 사용하세요.')
        .max(30, '4~30자 영문 대 소문자, 숫자, 특수문자를 사용하세요.'),
      passwordConfirmation: Yup.string()
        .required('비밀번호를 재입력 해주세요')
        .oneOf([Yup.ref('password'), null], '비밀번호가 일치하지 않습니다.'),
      nickname: Yup.string()
        .required('닉네임을 정해주세요.')
        .matches(/^[가-힣a-zA-Z\s]+$/, '한글과 영문 대 소문자를 사용하세요. (특수기호, 공백 사용 불가)'),
    })

    async function onSubmit(values) {
      try {
        if (type.value === 'sign-up') {
          delete values.currentPassword
          const data = await store.dispatch('auth/signUp', values)
          data ? router.push({ name: 'posts' }) : alert('Create account failed.')
        } else {
          const data = await store.dispatch('auth/editAccount', JSON.stringify(values))
          data ? router.push({ name: 'home' }) : alert('Edit account failed.')
        }
      } catch (err) {
        alert('Edit account failed.')
      }
    }

    const accountDelete = async () => {
      try {
        const ok = await Dialog.value.show({
          title: 'Delete Account',
          message: 'Are you sure you want to delete your account?',
          okButton: 'Delete',
        })
        if (ok) {
          const uid = store.state.user.userIdx || sessionStorage.getItem('user')
          const response = await store.dispatch('delAccount', uid)
          response.data ? router.push({ name: 'login' }) : alert('Cannot delete account(Server error).')
        }
      } catch (err) {
        console.log(err)
      }
    }

    return {
      user,
      type,
      isNew,
      Dialog,
      schema,
      onSubmit,
      accountDelete,
    }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.accountEditor {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

form {
  width: 35rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  h2 {
    color: #fff;
    font-size: 2.4rem;
    font-weight: 400;
    letter-spacing: 0.1em;
    margin: 0 0 3rem 0;
  }

  input {
    color: #fff;
  }
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 93px;
  background: var(--point);
  color: #fff;
  font-size: 16px;
  text-transform: uppercase;
  border: 0;
  font-weight: 700;
  letter-spacing: 0.2em;
}

a {
  color: var(--primary);
  font-size: 14px;
  font-weight: 900;
  text-transform: uppercase;
  text-decoration: none;
  letter-spacing: 0.2em;
  margin-top: 77px;

  i {
    font-weight: bold;
    position: relative;
    top: 0.5px;
    margin-right: 5px;
  }
}
</style>
