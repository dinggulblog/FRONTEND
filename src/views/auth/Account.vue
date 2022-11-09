<template>
  <div class="accountEditor">
    <Form v-if="isNew" as="div" v-slot="{ handleSubmit }" :validation-schema="createAccountSchema" >
      <h2 v-text="'Create Account'"></h2>
      <form @submit="handleSubmit($event, onCreateAccount)">
        <TextInput name="email" type="email" label="E-mail" placeholder="Email" spellcheck="false" success-message="올바른 이메일 주소입니다." />
        <TextInput name="password" type="password" label="Password" placeholder="Password" />
        <TextInput name="passwordConfirmation" type="password" label="Confirm Password" placeholder="Type password again" success-message="비밀번호가 정상적으로 입력되었습니다." />
        <TextInput name="nickname" type="text" label="Nickname" placeholder="Nickname" spellcheck="false" success-message="사용할 수 있는 닉네임입니다." />
        <button type="submit" class="submit-btn">Submit</button>
      </form>
    </Form>

    <Form v-else as="div" v-slot="{ handleSubmit }" :validation-schema="updateAccountSchema">
      <h2 v-text="'Modify Account'"></h2>
      <form @submit="handleSubmit($event, onUpdateAccount)">
        <TextInput name="email" type="email" label="E-mail" :disabled="true" :placeholder="user?.email" spellcheck="false" success-message="이메일은 변경할 수 없습니다." />
        <TextInput name="currentPassword" type="password" label="Current Password" placeholder="Current Password" />
        <TextInput name="password" type="password" label="New Password" placeholder="New Password" />
        <TextInput name="passwordConfirmation" type="password" label="Confirm Password" placeholder="Type password again" success-message="비밀번호가 정상적으로 입력되었습니다." />
        <TextInput name="nickname" type="text" label="Nickname" :placeholder="user?.nickname" spellcheck="false" success-message="사용할 수 있는 닉네임입니다." />
        <button type="submit" class="submit-btn">Submit</button>
      </form>
    </Form>

    <button v-if="!isNew" @click="onDeleteAccount" class="sign-out-btn">Sign Out</button>
    <Dialog ref="Dialog"></Dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
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
    const Dialog = ref(null)
    const route = useRoute()
    const { state, dispatch } = useStore()

    const user = computed(() => state.auth.user)
    const isNew = computed(() => !route.meta.requiredAuth)

    const createAccountSchema = Yup.object().shape({
      email: Yup.string()
        .required('이메일을 입력해 주세요.')
        .email(),
      password: Yup.string()
        .required()
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*]{4,30}$/, '4~30자 영문 대 소문자, 숫자, 특수문자를 사용하세요.'),
      passwordConfirmation: Yup.string()
        .oneOf([Yup.ref('password')], '비밀번호가 일치하지 않습니다.'),
      nickname: Yup.string()
        .required('닉네임을 정해주세요.')
        .matches(/^[가-힣a-zA-Z\d\S]{2,15}$/, '한글과 영문 대 소문자를 사용하세요. (특수기호, 공백 사용 불가)'),
    })

    const updateAccountSchema = Yup.object().shape({
      email: Yup.string()
        .default(user.value?.email ?? '')
        .email(),
      currentPassword: Yup.string()
        .required(),
      newPassword: Yup.string()
        .nullable(true)
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*]{4,30}$/, '4~30자 영문 대 소문자, 숫자, 특수문자를 사용하세요.'),
      passwordConfirmation: Yup.string()
        .oneOf([Yup.ref('password')], '비밀번호가 일치하지 않습니다.'),
      nickname: Yup.string()
        .default(user.value?.nickname ?? '')
        .matches(/^[가-힣a-zA-Z\d\S]{2,15}$/, '한글과 영문 대 소문자를 사용하세요. (특수기호, 공백 사용 불가)'),
    })

    const onCreateAccount = async (values) => await dispatch('auth/createAccount', values)

    const onUpdateAccount = async (event, values) => {
      await dispatch('auth/updateAccount', values)
    }

    const onDeleteAccount = async () => {
      const ok = await Dialog.value.show({
        title: 'Delete Account',
        message: 'Are you sure you want to delete your account?',
        okButton: 'Delete',
      })
      if (ok) {
        await dispatch('auth/deleteAccount')
      }
    }

    return {
      Dialog,
      user,
      isNew,
      createAccountSchema,
      updateAccountSchema,
      onCreateAccount,
      onUpdateAccount,
      onDeleteAccount
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
  color: rgb(255, 0, 0);
  font-size: 1.6rem;
  text-transform: uppercase;
  border: 0;
  font-weight: 700;
  letter-spacing: 0.2em;
}

.sign-out-btn {
  width: 100%;
  color: #fff;
  text-transform: uppercase;
  padding: 2rem 0;
  font-size: 1.6rem;
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
