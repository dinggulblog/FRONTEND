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
      initialValue: inputValue,
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
  position: relative;
  font-size: 1.4rem;
  color: #fff;
  width: 100%;
}

label {
  display: block;
  margin-top: 38px;
  white-space: nowrap;
  font-weight: 500;
}

input {
  border-bottom: 1px solid #fff;
  padding: 0 0 1.8rem;
  margin: 3.2rem 0;
  outline: none;
  font-weight: 400;
  background: transparent;
  width: 100%;
}

input::placeholder {
  font-size: 1, 4rem;
  color: var(--sub);
  font-weight: 400;
}

.help-message {
  position: absolute;
  bottom: 0;
  margin: 0;
  font-size: 1.2rem;
  font-weight: 400;
}

.TextInput.has-error .help-message {
  color: #f23648;
}

.TextInput.success .help-message {
  color: var(--warn);
}
</style>
