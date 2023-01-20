<template>
  <Info>
    <template #createdAt>
      <li>
        <span class="createdAt">{{ getTime(post.createdAt) }}</span>
      </li>
    </template>

    <template #category>
      <li>
        <span class="category">{{ post.category }}</span>
      </li>
    </template>
  </Info>
</template>

<script>
  import { ref, onMounted } from 'vue'
  import Info from '../slots/Info.vue'
  import { getTime } from '../../common/time.js'

  export default {
    name: 'InfoSlot',
    components: {
      Info,
    },
    props: {
      post: {
        type: Object,
        required: true,
      },
    },
    setup(props) {
      const createAt = ref(null)

      return { getTime }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss"></style>
