<template>
  <button @click="prevPage" :disabled="idx <= 0">
    <i class="material-icons" :style="[idx > 0 ? { color: 'var(--point)', cursor: 'pointer' } : { color: '#ddd', cursor: 'default' }]">arrow_back_ios_new</i>
    <span>이전글</span>
  </button>
  <button @click="nextPage" :disabled="idx >= maxPostNum">
    <span>다음글</span>
    <i class="material-icons" :style="[idx < maxPostNum ? { color: 'var(--point)', cursor: 'pointer' } : { color: '#ddd', cursor: 'default' }]">arrow_forward_ios</i>
  </button>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'post',
  components: {},
  setup() {
    const router = useRouter()
    const store = useStore()

    const postNum = ref(router.currentRoute.value.params.postNum)
    const maxPostNum = ref(store.state.post.posts.length - 1)

    const post = computed({
      get: () => store.state.post.post || {},
      set: (val) => store.commit('post/SET_POST', val),
    })

    const idx = ref(store.state.post.posts.findIndex((posts) => posts._id === post.value._id))
    console.log('검색한 idx', idx.value)

    const prevPage = () => {
      if (idx.value - 1 >= 0) idx.value--
      router.push({ name: 'post', params: { menu: post.value.menu.owner, sub: post.value.menu.subject, postNum: idx.value } })
      store.commit('post/SET_POST', post.value)
    }

    const nextPage = () => {
      if (idx.value + 1 <= maxPostNum.value) idx.value++
      router.push({ name: 'post', params: { menu: post.value.menu.owner, sub: post.value.menu.subject, postNum: idx.value } })
      store.commit('post/SET_POST', post.value)
    }

    return { postNum, maxPostNum, post, prevPage, nextPage, idx }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  grid-row: 4 / 5;
  display: grid;
  grid-template-columns: auto 1fr auto;
  border-top: 1px solid var(--line);
  margin: 4.8rem 0;
  padding: 4.8rem 0 0;
  font-size: 1.4rem;
  font-weight: 500;

  button {
    display: grid;
    grid-template-columns: repeat(2, auto);
    align-items: center;
    color: var(--primary);
  }

  button:nth-child(1) {
    grid-column: 1 / 2;
  }

  button:nth-child(2) {
    grid-column: 2 / 3;
    justify-self: end;

    i {
      margin: 0 0 0 1.6rem;
    }
  }
}
</style>
