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
      <Posts v-if="type !== 'slide'" :menu="currentMenus" :type="type" :category="category" />
      <ul v-else class="ul_slide">
        <li v-for="category in categories" :key="category">
          <Posts :type="'slide'" :menu="currentMenus" :category="category" />
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
  .ul_slide > li:first-child > .wrap_slide_toolbar {
    margin-top: 0;
  }

  .ul_slide > li {
    position: relative;
  }
</style>
