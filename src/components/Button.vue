<template>
  <button ref="btnEl" :class="className">{{ content }}</button>
</template>

<script>
import { onMounted, ref } from 'vue'

const colors = ['primary', 'secondary', 'primary-dark', 'secondary-dark']

export default {
  name: 'Button',
  props: {
    className: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      default: 'button',
    },
    size: {
      type: String,
      default: 'md',
    },
    full: {
      type: Boolean,
      default: false,
    },
    fill: {
      type: Boolean,
      default: true,
    },
    stroke: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'primary-dark',
    },
    textColor: {
      type: String,
      default: '#fff',
    },
  },
  setup(props) {
    const btnEl = ref(null)

    onMounted(() => {
      if (props.size === 'md') {
        btnEl.value.style.width = '10.8rem'
        btnEl.value.style.height = '4rem'
        btnEl.value.style.fontSize = '1.2rem'
      }

      if (props.full) btnEl.value.style.width = '100%'

      if (props.fill) {
        if (colors.includes(props.color)) {
          btnEl.value.style.backgroundColor = `var(--${props.color})`
        } else {
          btnEl.value.style.backgroundColor = `${props.color}`
        }
        btnEl.value.style.color = `${props.textColor}`
      }

      if (props.stroke) {
        btnEl.value.style.border = '0.2rem solid'
        if (colors.includes(props.color)) {
          btnEl.value.style.borderColor = `var(--${props.color})`
        } else btnEl.value.style.borderColor = `${props.color}`
      }

      if (props.rounded) btnEl.value.style.borderRadius = '2rem'
    })

    return { btnEl }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
button {
  font-weight: 500;
}
</style>
