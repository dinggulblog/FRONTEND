<template>
  <div class="TextInput" :class="{ 'has-error': !!errorMessage, success: meta.valid }">
    <label :for="name">{{ label }}</label>
    <input
      :name="name"
      :id="name"
      :type="type"
      :value="inputValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="handleChange"
      @blur="handleBlur"
    />
    <p class="help-message" v-show="errorMessage || meta.valid">{{ errorMessage || successMessage }}</p>
  </div>
</template>

<script>
  import { useField } from 'vee-validate'

  export default {
    props: {
      type: {
        type: String,
        default: 'text',
      },
      value: {
        type: String,
        default: '',
      },
      name: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        required: true,
      },
      successMessage: {
        type: String,
        default: '',
      },
      placeholder: {
        type: String,
        default: '',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    setup(props) {
      const {
        value: inputValue,
        errorMessage,
        handleBlur,
        handleChange,
        meta,
      } = useField(props.name, undefined, {
        initialValue: props.value,
      })

      return {
        handleChange,
        handleBlur,
        errorMessage,
        inputValue,
        meta,
      }
    },
  }
</script>

<style scoped>
  .TextInput {
    font-size: 1.3rem;
    width: 100%;
    margin: 3.2rem 0 3.2rem;
    position: relative;
  }

  label {
    white-space: nowrap;
    color: var(--primary-dark);
  }

  input {
    padding: 0 0 1.6rem;
    margin: 1.6rem 0 0;
    outline: none;
    font-weight: 400;
    background: transparent;
    border-bottom: 0.1rem solid #e0e0e0;
    width: 100%;
    color: #999;
  }

  input::placeholder {
    color: #bbb;
  }

  .help-message {
    margin: 0;
    font-size: 1.2rem;
    position: absolute;
    top: 7.7rem;
  }

  .TextInput.has-error .help-message {
    color: var(--error);
  }

  .TextInput.success .help-message {
    color: var(--warning);
  }
</style>
