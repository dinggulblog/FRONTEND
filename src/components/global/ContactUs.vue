<template>
  <PopupModal ref="POPUP_EL">
    <div id="contact-us">
      <Button class="btn_close" :svg="'close'" :theme="'primary'" @click="close" />

      <div class="wrap_contact-us">
        <div class="contact-us">
          <Form as="div" class="contact-us_form" v-slot="{ handleSubmit }" :validation-schema="contactUsSchema">
            <h2>contact us</h2>

            <form @submit="handleSubmit($event, onSendMail)" id="contact">
              <TextInput
                name="email"
                type="email"
                placeholder="답변 받으실 이메일"
                spellcheck="false"
                success-message="올바른 이메일 주소입니다."
              />

              <TextInput name="subject" type="text" placeholder="제목" spellcheck="false" />

              <TextArea
                name="content"
                :placeholder="isLogin ? '메시지를 적어주세요.' : '로그인한 유저만 이용할 수 있습니다.'"
              />

              <Button type="submit" class="btn_submit" :content="'보내기'" :shape="'fill-round-full'" :theme="'primary'" />
              
            </form>
          </Form>
        </div>
      </div>
    </div>
  </PopupModal>
</template>

<script setup>
  import { ref, computed, inject, defineExpose } from 'vue'
  import { useStore } from 'vuex'
  import { Form } from 'vee-validate'
  import * as Yup from 'yup'
  import PopupModal from '../slots/PopupModal.vue'

  const { state, dispatch } = useStore()

  const isLogin = computed(() => state.auth.isLogin)

  const form = ref(null)

  const POPUP_EL = ref(null)
  const TOAST_EL = inject('TOAST_EL')

  const contactUsSchema = Yup.object().shape({
    email: Yup.string().required('이메일을 입력해 주세요.').email(),
    subject: Yup.string().required('제목을 입력해주세요.'),
    content: Yup.string(),
  })

  const onSendMail = async (values) => {
    const { success, error } = await dispatch('mail/createMail', values)

    if (!success) {
      return TOAST_EL.value.open('error', error)
    } else {
      close()
    }
  }

  const open = () => {
    if (!isLogin.value) {
      close()
      TOAST_EL.value.open('error', '로그인한 유저만 이용 가능합니다.')
    } else {
      POPUP_EL.value?.open()
    }
  }

  const close = () => {
    POPUP_EL.value?.close()
  }

  defineExpose({ open, close })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #contact-us {
    width: 48rem;
    box-shadow: var(--shadow1);
    background: var(--bg1);
    padding: 3.2rem;
    border-radius: 3.2rem;
    overflow-y: auto;

    @include mobile {
      width: 100%;
      height: 100%;
      border-radius: 0;
    }
  }
  .wrap_contact-us {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    /* account */

    .contact-us {
      /* common */
      width: 100%;

      h2 {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.4rem;
        color: var(--primary);
        font-weight: 400;
        margin: 0 0 4.8rem;
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

        &:deep(.TextInput) {
          margin: 0 0 4.8rem;

          .help-message {
            top: 4.8rem;
          }
        }

        &:deep(input) {
          margin: 0;
        }

        &:deep(.TextArea > textarea) {
          width: 100%;
          min-height: 40rem;
          resize: none;
          border-bottom: 1px solid var(--border2);
          color: var(--text4);

          &::placeholder {
            color: var(--text2);
          }
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
        margin: 4.8rem 0 0;

        @media (hover: hover) and (pointer: fine) {
          &:hover {
            background-color: var(--primary-light);
          }
        }

        &:active {
          background-color: var(--primary-dark);
        }
      }

      /* end common */
    }
  }
</style>
