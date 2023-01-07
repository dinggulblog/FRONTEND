<template>
  <popup-modal ref="popup">
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
  </popup-modal>
</template>

<script>
  import PopupModal from '../slots/PopupModal.vue'

  export default {
    name: 'Dialog',
    components: {
      PopupModal,
    },
    data: () => ({
      title: undefined,
      message: undefined,
      okButton: 'Sure',
      cancelButton: 'Cancle',

      resolvePromise: undefined,
      rejectPromise: undefined,
    }),

    methods: {
      show(opts = {}) {
        this.title = opts.title
        this.message = opts.message
        if (opts.cancelButton) {
          this.okButton = opts.okButton
          this.cancelButton = opts.cancelButton
        }
        this.$refs.popup.open()

        return new Promise((resolve, reject) => {
          this.resolvePromise = resolve
          this.rejectPromise = reject
        })
      },

      _confirm() {
        this.$refs.popup.close()
        this.resolvePromise(true)
      },

      _cancel() {
        this.$refs.popup.close()
        this.resolvePromise(false)
      },
    },
  }
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
