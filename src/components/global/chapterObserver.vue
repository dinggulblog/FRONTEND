<script setup>
  import { onMounted, onUnmounted, ref } from 'vue'

  const props = defineProps({
    elements: {
    },
  })

  /*
  const observedEl = ref()


  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      observedEl.value.current[entry.target.id] = entry;
      console.log(observedEl.value)
    })
  }

  const observer = new IntersectionObserver(callback, { threshold: 1.0 })
  */

  onMounted(() => {
    //const observeTarget = props.elements.forEach(el => observer.observe(el) )
    console.log(props.elements)
  })

  onUnmounted(() => {
    //observer.disconnect()
  })
</script>