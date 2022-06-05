<template>
  <div class="editor">
    <textarea
      :placeholder="placeholder"
      @focus="placeholder = ''"
      @blur="placeholder = [curRouteParams.menu === 'guest' ? '방명록을 작성해보세요' : '코멘트를 작성해보세요']"
      :style="[curRouteParams.menu === 'guest' ? { minHeight: '18rem' } : { minHeight: '10.6rem' }]"
    ></textarea>

    <div class="btns">
      <div class="toggle">
        <button class="material-icons" v-text="isPrivate ? 'toggle_on' : 'toggle_off'" :style="[isPrivate ? { color: 'var(--point)' } : { color: '#E5E5E5' }]" @click="isPrivate = !isPrivate"></button>
        <span v-text="isPrivate ? 'Secret' : 'Public'" :style="[isPrivate ? { color: 'var(--point)' } : { color: '#B5B5B5' }]"></span>
      </div>
      <button class="submit">Comment</button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'app',
  components: {},
  setup() {
    const route = useRoute()
    const curRouteParams = computed(() => route.params)
    const isPrivate = ref(false)
    const placeholder = ref(curRouteParams.value.menu === 'guest' ? '방명록을 작성해보세요' : '코멘트를 작성해보세요')

    return { isPrivate, curRouteParams, placeholder }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.editor {
  display: grid;
  grid-template-rows: repeat(2, auto);

  textarea {
    background: var(--formBg);
    color: var(--primary);
    font-size: 1.4rem;
    border: 0;
    border-radius: 1.8rem;
    padding: 2.4rem;
    resize: vertical;

    &::placeholder {
      color: var(--primary);
    }
  }

  .btns {
    display: grid;
    grid-template-columns: auto 1fr auto;
    margin-top: 2.4rem;

    .toggle {
      grid-column: 1 / 2;
      display: grid;
      grid-template-columns: repeat(2, auto);
      align-items: center;

      button {
        grid-column: 1 / 2;
        font-size: 4.8rem;
        transition: all 300ms linear;
      }

      span {
        grid-column: 2 / 3;
        font-size: 1.2rem;
        font-weight: 500;
        margin-left: 0.8rem;
      }
    }

    button.submit {
      grid-column: 3 / 4;
      width: 10.8rem;
      height: 4rem;
      place-content: center;
      background: var(--point);
      color: #fff;
      font-weight: 500;
      font-size: 1.2rem;
      border-radius: 2rem;
    }
  }
}
</style>
