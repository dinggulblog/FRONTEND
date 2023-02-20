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
      <ul :id="type">
          <component v-for="skeleton in 9" :key="skeleton" :is="layouts[type]"></component>
      </ul>
    </template>
  </Suspense>
</template>

<script setup>
  import { ref, onErrorCaptured } from 'vue'
  import { mapState } from '../../common/vuex-helper.js'
  import Posts from '../../components/Posts.vue'
  import Toolbar from '../../components/Toolbar.vue'
  import card from '../../components/slots/Card.vue'
  import list from '../../components/slots/List.vue'
  import slide from '../../components/slots/Slide.vue'
  import recent from '../../components/slots/Recent.vue'

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

  const layouts = {
    card: card,
    list: list,
    slide: slide,
    recent: recent,
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>




</style>
