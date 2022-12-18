<template>
  <PopupModal ref="POPUP_EL">
    <Button class="btn_close" size="md" svg="close" customColor="var(--primary)" customPadding="0" @click="close" />

    <div class="wrap_account">
      <div class="account" ref="ACCOUNT_EL">
        <!-- Sign-up Form -->
        <Form
          v-if="form === 'create'"
          as="div"
          class="create_account"
          v-slot="{ handleSubmit }"
          :validation-schema="createAccountSchema"
        >
          <h2>create account</h2>

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

        <!-- Update Form -->
        <Form
          v-else-if="form === 'update'"
          as="div"
          class="update_account"
          v-slot="{ handleSubmit }"
          :validation-schema="updateAccountSchema"
        >
          <h2>modify account</h2>

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

            <div class="wrap_btn_sign-out" v-if="form === 'update'">
              <button @click="onDeleteAccount" class="btn_sign-out">회원 탈퇴</button>
            </div>
          </form>
        </Form>

        <!-- Login Form -->
        <Form v-else as="div" class="login" v-slot="{ handleSubmit }" :validation-schema="loginSchema">
          <h2>member login</h2>

          <form @submit="handleSubmit($event, onLogin)" class="login_form">
            <TextInput name="email" type="email" label="이메일" placeholder="User ID (Email)" spellcheck="false" />
            <TextInput name="password" type="password" label="비밀번호" placeholder="Password" />
            <button type="submit" class="btn_submit">로그인</button>
          </form>

          <div class="wrap_find_account" v-if="form === 'login'">
            <p>이메일 또는 비밀번호를 잊으셨나요?</p>
            <button class="btn_find-account">계정 찾기</button>
          </div>

          <div class="wrap_sign-up" v-if="form === 'login'">
            <button @click="form = 'create'" class="btn_create-account">회원가입</button>
          </div>
        </Form>
      </div>
    </div>
  </PopupModal>
</template>

<script>
  import { ref, computed } from 'vue'
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
      const { state, dispatch } = useStore()

      const user = computed(() => state.auth.user)
      const form = ref('login')
      const POPUP_EL = ref(null)
      const ACCOUNT_EL = ref(null)

      const loginSchema = Yup.object().shape({
        email: Yup.string().required('이메일을 입력해 주세요.').email(),
        password: Yup.string().required('패스워드를 입력해 주세요.'),
      })

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

      const onLogin = async (values) => {
        const { success } = await dispatch('auth/login', values)
        if (success) close()
      }

      const onCreateAccount = async (values) => {
        const { success } = await dispatch('auth/createAccount', values)
        if (success) close()
      }

      const onUpdateAccount = async (values) => {
        const { success } = await dispatch('auth/updateAccount', values)
        if (success) close()
      }

      const onDeleteAccount = async (values) => {
        if (confirm('계정 탈퇴를 진행하시겠습니까?')) {
          await dispatch('auth/deleteAccount', values)
        }
      }

      const open = (type) => {
        form.value = type
        POPUP_EL.value?.open()
      }

      const close = () => {
        POPUP_EL.value?.close()
      }

      return {
        user,
        form,
        POPUP_EL,
        ACCOUNT_EL,
        loginSchema,
        createAccountSchema,
        updateAccountSchema,
        onLogin,
        onCreateAccount,
        onUpdateAccount,
        onDeleteAccount,
        open,
        close,
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .btn_close {
    margin: 2rem 0;
  }
  .wrap_account {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 0 2rem;

    /* account */

    .account {
      /* common */
      width: 100%;

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

      button {
        font-weight: 500;
        font-size: 1.3rem;
      }

      form {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 1.3rem;
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

      /* end common */

      .update_account {
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
      }

      /* login */
      .login {
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

          .btn_find-account {
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

          .btn_create-account {
            font-size: 1.4rem;
            color: var(--primary-dark);
          }
        }
      }
    }
  }
</style>
