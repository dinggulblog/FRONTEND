<template>
  <PopupModal ref="POPUP_EL">
    <div id="dialog">
      <div class="massage">
        <h2>{{ title }}</h2>
        <p>{{ message }}</p>
      </div>

      <div class="btns">
        <button @click="_cancel">{{ cancelButton }}</button>
        <button @click="_confirm">{{ okButton }}</button>
      </div>
    </div>
  </PopupModal>
</template>

<script setup>
import { defineExpose, ref } from 'vue'
import PopupModal from '../slots/PopupModal.vue'

const POPUP_EL = ref(null)
const title = ref(null) 
const message = ref(null)
const okButton = ref('OK')
const cancelButton = ref('Cancel')

let resolvePromise = undefined
let rejectPromise = undefined

const show = (opts = {}) => {
  title.value = opts.title
  message.value = opts.message

  cancelButton.value = opts.cancelButton ? opts.cancelButton : cancelButton.value
  okButton.value = opts.okButton ? opts.okButton : okButton.value

  POPUP_EL.value.open()

  return new Promise((resolve, reject) => {
    resolvePromise = resolve
    rejectPromise = reject
  })
}

const _confirm = () => {
  POPUP_EL.value.close()
  resolvePromise(true)
}

const _cancel = () => {
  POPUP_EL.value.close()
  resolvePromise(false)
}

defineExpose({ show })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #dialog {
    max-width: 37rem;
    box-shadow: 0 0 2.4rem 0.3rem rgba(0, 0, 0, 0.05);
    background: #fff;
    padding: 3.2rem 2.4rem;
    border-radius: 3.2rem;

    @include mobile {
      max-width: 30rem;
    }

    .massage {
      padding: 0 1.2rem;

      h2 {
        font-weight: 500;
        font-size: 2rem;
        text-align: center;
        color: var(--secondary-dark);

        @include mobile {
          font-size: 1.8rem;
        }
      }

      p {
        margin-top: 2.4rem;
        text-align: left;
        font-size: 1.4rem;
        color: var(--text-light);

        @include mobile {
          font-size: 1.6rem;
        }
      }
    }

    .btns {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      margin-top: 3.2rem;

      button {
        width: 9.8rem;
        height: 4rem;
        display: grid;
        place-content: center;
        border: 0;
        font-weight: 500;
        font-size: 1.2rem;
        border-radius: 3.2rem;

        @include mobile {
          font-size: 1.6rem;
        }
      }

      button:nth-child(1) {
        color: var(--secondary-dark);
        border: 2px solid var(--secondary);
        margin: 0 1.2rem 0 0;
      }

      button:nth-child(2) {
        color: #fff;
        background-color: var(--secondary-dark);
      }
    }
  }
</style>
