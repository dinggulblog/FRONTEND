<template>
  <div class="TextArea">
    <label :for="name">{{ label }}</label>
    <textarea
      :name="name"
      :id="name"
      :value="inputValue"
      :placeholder="placeholder"
      @input="handleChange"
      @blur="handleBlur"
    />
  </div>
</template>

<script setup>
  import { defineProps } from 'vue'
  import { useField } from 'vee-validate'

  const props = defineProps({
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
    },
    placeholder: {
      type: String,
      default: '',
    },
  })

  const {
    value: inputValue,
    handleBlur,
    handleChange,
    meta,
  } = useField(props.name, undefined, {
    initialValue: props.value,
  })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .TextArea {
    font-size: 1.4rem;
    width: 100%;
    position: relative;

    label {
      white-space: nowrap;
      color: var(--primary);
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
  }
</style>
