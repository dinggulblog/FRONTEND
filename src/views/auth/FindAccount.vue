<template>
  <div class="find_account">
    <Form as="div" class="find_form" v-slot="{ handleSubmit }" :validation-schema="findSchema">
      <h2>find account</h2>

      <p>
        로그인에 문제가 있는 계정의 이메일을 입력해 주세요.<br />
        암호 재설정과 관련된 안내사항을 보내드립니다.
      </p>

      <form @submit="handleSubmit($event, onSendEmail)">
        <TextInput
          name="email"
          type="email"
          label="이메일"
          placeholder="Email"
          spellcheck="false"
          success-message="올바른 이메일 주소입니다."
        />

        <Button type="submit" class="btn_submit" :content="'보내기'" :shape="'fill-round-full'" :theme="'primary'" />
      </form>
    </Form>
  </div>
</template>

<script setup>
  import { inject } from 'vue'
  import { useStore } from 'vuex'
  import { Form } from 'vee-validate'
  import * as Yup from 'yup'
  import TextInput from '../../components/ui/TextInput.vue'

  const { dispatch } = useStore()
  const TOAST_EL = inject('TOAST_EL')
  const CONTACT_EL = inject('CONTACT_EL')

  const findSchema = Yup.object().shape({
    email: Yup.string().required('이메일을 입력해 주세요.').email(),
  })

  const onSendEmail = async (values) => {
    const { success, error } = await dispatch('auth/createResetLink', { email: values.email })

    if (!success) {
      return TOAST_EL.value.open('error', error)
    } else {
      return TOAST_EL.value.open('success', '전송되었습니다. 해당 이메일의 메일을 확인하세요.')
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .find_account {
    display: flex;
    flex-direction: column;
    align-items: center;

    .find_form {
      padding: 3.2rem;

      @include mobile {
        padding: 0;
      }

      h2 {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.4rem;
        color: var(--primary);
        font-weight: 400;
        text-transform: capitalize;
      }

      p {
        font-size: 1.4rem;
        color: var(--text3);
        margin: 3.2rem 0 0;

        strong {
          text-decoration: underline;
          color: var(--primary);
        }
      }

      form {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 1.3rem;
        width: 37rem;

        @include mobile {
          width: 100%;
        }
      }

      .btn_submit {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 4rem;
        color: var(--text1);
        background-color: var(--primary);
        border-radius: 3.2rem;
        margin: 2.4rem 0 0;
        font-weight: 500;
        font-size: 1.3rem;

        @media (hover: hover) and (pointer: fine) {
          &:hover {
            background-color: var(--primary-light);
          }
        }

        &:active {
          background-color: var(--primary-dark);
        }
      }
    }
  }
</style>
