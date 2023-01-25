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
      return { getTime }
    },
  }
</script>