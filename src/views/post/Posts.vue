<template>
  <Toolbar
    :main="main"
    :sub="sub"
    :type="type"
    :categories="categories"
    @updateType="$store.commit('menu/SET_TYPE', $event)"
    @updateCategory="$store.commit('menu/SET_CATEGORY', $event)"
  />

  <div v-if="error">
    {{ error }}
  </div>

  <Suspense v-else>
    <template #default>
      <Posts v-if="type !== 'slide'" :type="type" :menu="currentMenus?.map(({ _id }) => _id)" :category="category" />
      <ul v-else>
        <li v-for="category in categories" :key="category">
          <Posts :type="type" :menu="currentMenus?.map(({ _id }) => _id)" :category="category" />
        </li>
      </ul>
    </template>

    <template #fallback>
      <span>게시물 로딩 중...</span>
    </template>
  </Suspense>
</template>

<script setup>
  import { ref, onErrorCaptured } from 'vue'
  import { mapState } from '../../common/vuex-helper.js'
  import Posts from '../../components/Posts.vue'
  import Toolbar from '../../components/Toolbar.vue'

  const props = defineProps({
    main: {
      type: String,
      required: true,
    },
    sub: {
      type: String,
      required: false
    },
  })
  
  const { type, category, categories, currentMenus } = mapState('menu')

  const error = ref(null)

  onErrorCaptured((err) => {
    error.value = err.message
    return true
  })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
