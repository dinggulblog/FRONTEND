<template>
  <div class="accountEditor">
    <Form @submit="onSubmit" :validation-schema="schema">
      <h2 v-text="isNew ? 'Create Account' : 'Modify Account'"></h2>
      <TextInput
        name="email"
        type="email"
        label="E-mail"
        :disabled="!isNew"
        :placeholder="user.email ? user.email : 'Email'"
        :success-message="user.email ? '이메일은 변경할 수 없습니다.' : '올바른 이메일 주소입니다.'"
      />
      <TextInput v-show="!isNew" name="currentPassword" type="password" label="Current Password" placeholder="Current Password" />
      <TextInput
        name="password"
        type="password"
        :label="user.isActive ? 'New Password' : 'Password'"
        :placeholder="user ? 'New Password' : 'Password'"
      />
      <TextInput
        name="passwordConfirmation"
        type="password"
        label="Confirm Password"
        placeholder="Type password again"
        success-message="비밀번호가 정상적으로 입력되었습니다."
      />
      <TextInput
        name="nickname"
        type="text"
        label="Nickname"
        :placeholder="user.nickname ? user.nickname : 'Nickname'"
        success-message="사용할 수 있는 닉네임입니다."
      />
      <button class="submit-btn" type="submit">Submit</button>
    </Form>
    <Dialog ref="Dialog"></Dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
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
    const isNew = computed(() => !route.meta.requiredAuth)
    const Dialog = ref(null)

    const schema = Yup.object().shape({
      email: Yup.string()
        .required('닉네임을 정해주세요.')
        .default(user.value ? user.value.email : '')
        .email(),
      password: Yup.string()
        .required('비밀번호를 입력해주세요')
        .min(4, '4~30자 영문 대 소문자, 숫자, 특수문자를 사용하세요.')
        .max(30, '4~30자 영문 대 소문자, 숫자, 특수문자를 사용하세요.')
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*]{4,30}$/, '4~30자 영문 대 소문자, 숫자, 특수문자를 사용하세요.'),
      passwordConfirmation: Yup.string()
        .required('비밀번호를 재입력 해주세요')
        .oneOf([Yup.ref('password'), null], '비밀번호가 일치하지 않습니다.'),
      nickname: Yup.string()
        .required('닉네임을 정해주세요.')
        .default(user.value ? user.value.nickname : '')
        .matches(/^[가-힣a-zA-Z\d\S]{2,15}$/, '한글과 영문 대 소문자를 사용하세요. (특수기호, 공백 사용 불가)'),
    })

    async function onSubmit(values) {
      try {
        if (isNew.value) {
          delete values.currentPassword
          const data = await store.dispatch('auth/signUp', values)

          if (!data) {
            throw new Error('Create account failed.')
          }
        } else {
          values.email = values.email ? values.email : user.value.email
          values.nickname = values.nickname ? values.nickname : user.value.nickname

          if (values.password) {
            values.newPassword = values.password
            delete values.password
            delete values.passwordConfirmation
          }

          const { status } = await store.dispatch('auth/editAccount', values)

          if (status === 200) {
            store.dispatch('auth/logout')
          } else {
            throw new Error('Edit account failed.')
          }
        }
        router.push({ name: 'home' })
      } catch (err) {
        alert(err.message)
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
          const { status } = await store.dispatch('delAccount', sessionStorage.getItem('nickname'))

          if (status === 200) {
            store.dispatch('auth/logout')
            router.push({ name: 'login' })
          } else {
            throw new Error('Cannot delete account(Server error)')
          }
        }
      } catch (err) {
        alert(err.message)
      }
    }

    return {
      user,
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
