<template>
  <div class="TextInput" :class="{ 'has-error': !!errorMessage, success: meta.valid }" :style="(type !== 'checkbox' && type !== 'radio') ? { flexDirection : 'column-reverse' } :{ flexDirection : 'row' }">
    <p class="help-message" v-if="errorMessage || meta.valid && (type !== 'checkbox' && type !== 'radio')">{{ errorMessage || successMessage }}</p>
    <input
      spellcheck="false"
      :name="name"
      :id="label"
      :type="type"
      :value="inputValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :checked="checked"
      @input="handleChange"
      @blur="handleBlur"
    />
    <label :for="label">{{ label }}</label>
  </div>
</template>

<script setup>
  import { watch } from 'vue';
  import { useField } from 'vee-validate'
  import { debounce } from '../../common/util.js';

  const props = defineProps({
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
      default: '',
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
    checked: {
      type: Boolean,
      default: false,
    },
  })

  const emits = defineEmits(['callback'])

  const {
    value: inputValue,
    errorMessage,
    handleBlur,
    handleChange,
    meta,
  } = useField(props.name, undefined, {
    initialValue: props.value,
  })

  watch(inputValue, debounce(() => emits('callback', inputValue.value), 250))
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .TextInput {
    font-size: 1.4rem;
    margin: 3.2rem 0 3.2rem;
    display: flex;
    flex-direction: column-reverse;
    position: relative;

    label {
      white-space: nowrap;
      color: var(--primary);
    }

    input:not([type="checkbox"]):not([type="radio"]) {
      padding: 0 0 1.6rem;
      margin: 1.6rem 0 0;
      outline: none;
      font-weight: 400;
      background: transparent;
      border-bottom: 0.1rem solid var(--border2);
      width: 100%;
      color: var(--text4);
    }

    input[type="checkbox"] {
      margin:0 0.4rem 0;
      display: flex;
      justify-content: center;
    }

    input::placeholder {
      color: var(--text2);
    }

    .help-message {
      margin: 0;
      font-size: 1.2rem;
      position: absolute;
      top: 7.7rem;
    }

    &.has-error .help-message {
      color: var(--error);
    }

    &.success .help-message {
      color: var(--warning);
    }


    &.checkbox {
      display: flex;
      line-height: 1.5;
      margin: 0 1.2rem 0 0;
      
      label {
        color:var(--text4);
        font-size:1.2rem;
      }
    }
  }
</style>
