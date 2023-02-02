<template>
  <component :is="isMobile ? BottomSheet : Dropbox" ref="DROPBOX_EL">
    <li v-for="(value, key) in dropboxItems" :key="key">
      <span @click="value">{{ key }}</span>
    </li>
  </component>
</template>

<script setup>
  import { defineProps, defineExpose, ref, onMounted, onUnmounted } from 'vue'
  import { useMedia } from '../../common/mediaQuery'
  import Dropbox from '../ui/Dropbox.vue'
  import BottomSheet from '../ui/BottomSheet.vue'

  const props = defineProps({
    dropboxItems: {
      type: Object,
      required: true,
    },
  })

  const isMobile = useMedia('only screen and (max-width: 1023px)')
  const DROPBOX_EL = ref(null)

  const onToggle = () => {
    DROPBOX_EL.value.toggle()
  }

  const onClose = (event) => {
    if (
      isMobile &&
      DROPBOX_EL.value.isVisible &&
      !event.target.matches('.btn_dropbox > svg') &&
      !event.target.matches('.btn_dropbox > svg > path') &&
      !event.target.matches('.window') &&
      !event.target.matches('.window > ul') &&
      !event.target.matches('.window > ul > li')
    ) {
      DROPBOX_EL.value.close()
    }
  }

  onMounted(() => {
    document.body.addEventListener('click', onClose)
  })

  onUnmounted(() => {
    document.body.removeEventListener('click', onClose)
  })

  defineExpose({ onToggle })
</script>
