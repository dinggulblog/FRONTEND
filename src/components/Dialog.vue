<template>
  <popup-modal ref="popup">
    <div class="massage">
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
    </div>

    <div class="btns">
      <button @click="_cancel">{{ cancelButton }}</button>
      <button @click="_confirm">{{ okButton }}</button>
    </div>
  </popup-modal>
</template>

<script>
import PopupModal from './PopupModal.vue'

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
.massage {
  padding: 0 4.8rem;

  h2 {
    margin-top: 0.8rem;
    font-weight: 500;
    font-size: 2rem;
    text-align: center;
  }

  p {
    margin-top: 2.4rem;
    text-align: left;
  }
}

.btns {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 3.2rem;
  padding: 0 4rem;

  button {
    width: 9.8rem;
    height: 4rem;
    border-radius: 2rem;
    display: grid;
    place-content: center;
    border: 0;
    font-weight: 500;
    font-size: 1.2rem;
  }

  button:nth-child(1) {
    color: var(--primary);
  }

  button:nth-child(2) {
    color: #fff;
    background: var(--point);
  }
}
</style>
