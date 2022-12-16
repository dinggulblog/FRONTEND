<template>
  <PopupModal ref="popup">
    <div class="wrap_account">
      <div class="account" ref="ACCOUNT_EL">
        <Form
          v-if="isNew"
          as="div"
          class="create_account"
          v-slot="{ handleSubmit }"
          :validation-schema="createAccountSchema"
        >
          <h2 v-text="'create account'"></h2>
          <form @submit="handleSubmit($event, onCreateAccount)">
            <TextInput
              name="email"
              type="email"
              label="이메일"
              placeholder="Email"
              spellcheck="false"
              success-message="올바른 이메일 주소입니다."
            />
            <TextInput name="password" type="password" label="비밀번호" placeholder="Password" />
            <TextInput
              name="passwordConfirmation"
              type="password"
              label="비밀번호 확인"
              placeholder="Type password again"
              success-message="비밀번호가 정상적으로 입력되었습니다."
            />
            <TextInput
              name="nickname"
              type="text"
              label="닉네임"
              placeholder="Nickname"
              spellcheck="false"
              success-message="사용할 수 있는 닉네임입니다."
            />
            <button type="submit" class="btn_submit">가입 완료</button>
          </form>
        </Form>

        <Form
          v-else-if="user"
          as="div"
          class="modify_account"
          v-slot="{ handleSubmit }"
          :validation-schema="updateAccountSchema"
        >
          <h2 v-text="'modify account'"></h2>
          <form @submit="handleSubmit($event, onUpdateAccount)">
            <TextInput
              name="email"
              type="email"
              label="이메일"
              :disabled="true"
              :value="user?.email"
              :placeholder="user?.email"
              spellcheck="false"
              success-message="이메일은 변경할 수 없습니다."
            />
            <TextInput name="currentPassword" type="password" label="현재 비밀번호" placeholder="Current Password" />
            <TextInput name="newPassword" type="password" label="새 비밀번호" placeholder="New Password" />
            <TextInput
              name="passwordConfirmation"
              type="password"
              label="새 비밀번호 확인"
              placeholder="Type password again"
              success-message="비밀번호가 정상적으로 입력되었습니다."
            />
            <TextInput
              name="nickname"
              type="text"
              label="닉네임"
              :value="user?.email"
              :placeholder="user?.nickname"
              spellcheck="false"
              success-message="사용할 수 있는 닉네임입니다."
            />
            <button type="submit" class="btn_submit">수정 완료</button>
          </form>
        </Form>

        <div class="wrap_btn_sign-out">
          <button v-if="!isNew" @click="onDeleteAccount" class="btn_sign-out">회원 탈퇴</button>
        </div>
      </div>
    </div>
  </PopupModal>
</template>

<script>
  import { ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStore } from 'vuex'
  import { Form } from 'vee-validate'
  import * as Yup from 'yup'
  import TextInput from '../../components/TextInput.vue'
  import PopupModal from '../../components/global/PopupModal.vue'

  export default {
    name: 'account',
    components: {
      Form,
      TextInput,
      PopupModal,
    },
    setup() {
      const route = useRoute()
      const { state, dispatch } = useStore()

      const user = computed(() => state.auth.user)
      const isNew = computed(() => !route.meta.requiredAuth)
      const ACCOUNT_EL = ref(null)

      const createAccountSchema = Yup.object().shape({
        email: Yup.string().required('이메일을 입력해 주세요.').email(),
        password: Yup.string()
          .required()
          .matches(
            /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*]{4,30}$/,
            '4~30자 영문 대 소문자, 숫자, 특수문자를 사용하세요.'
          ),
        passwordConfirmation: Yup.string().oneOf([Yup.ref('password')], '비밀번호가 일치하지 않습니다.'),
        nickname: Yup.string()
          .required('닉네임을 정해주세요.')
          .matches(/^[가-힣a-zA-Z\d\S]{2,15}$/, '한글과 영문 대 소문자를 사용하세요. (특수기호, 공백 사용 불가)'),
      })

      const updateAccountSchema = Yup.object().shape({
        email: Yup.string().default(user.value.email).email(),
        currentPassword: Yup.string().required(),
        newPassword: Yup.string()
          .nullable(true)
          .matches(
            /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*]{4,30}$/,
            '4~30자 영문 대 소문자, 숫자, 특수문자를 사용하세요.'
          ),
        passwordConfirmation: Yup.string().oneOf([Yup.ref('newPassword')], '비밀번호가 일치하지 않습니다.'),
        nickname: Yup.string()
          .default(user.value.nickname)
          .matches(/^[가-힣a-zA-Z\d\S]{2,15}$/, '한글과 영문 대 소문자를 사용하세요. (특수기호, 공백 사용 불가)'),
      })

      const onCreateAccount = async (values) => await dispatch('auth/createAccount', values)

      const onUpdateAccount = async (values) => await dispatch('auth/updateAccount', values)

      const onDeleteAccount = async (values) => await dispatch('auth/deleteAccount', values)

      return {
        user,
        isNew,
        ACCOUNT_EL,
        createAccountSchema,
        updateAccountSchema,
        onCreateAccount,
        onUpdateAccount,
        onDeleteAccount,
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .wrap_account {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    button {
      font-weight: 500;
      font-size: 1.3rem;
    }

    .account {
      padding: 4rem 0;
      border-radius: 3.2rem;

      h2 {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.4rem;
        color: var(--primary-dark);
        font-weight: 400;
        margin: 0 0 calc(4.8rem - 3.2rem);
        text-transform: capitalize;
      }
    }
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .btn_submit {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 4rem;
    color: #fff;
    background-color: var(--primary-dark);
    border-radius: 3.2rem;
    margin: 4.8rem 0 0;
  }

  .wrap_btn_sign-out {
    margin: 4.8rem 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .btn_sign-out {
      color: #aaa;
      text-decoration: underline;
    }
  }
</style>
