<template>
  <div class="searchForm__inner">
    <div class="searchForm">
      <input class="searchForm__text" type="text" :placeholder="'검색어를 입력해주세요'" />
      <div class="searchForm__btn">
        <button type="submit" class="btn_search">
          <i class="material-icons">search</i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  name: 'navigation',
  setup() {
    const { getters } = useStore()
    const route = useRoute()
    const path = computed(() => route.path)
    const param = computed(() => route.currentRoute)

    return { getters, path, param }
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.searchForm__inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(120rem - 4.8rem);

  @include mobile {
    width: calc(100% - 4rem);
    margin: 0 2rem;
  }

  @include tablet {
    width: calc(100% - 6.4rem);
    margin: 0 4.8rem;
  }

  @include tablet_landscape {
    width: calc(100% - 6.4rem);
    margin: 0 3.2rem;
  }

  .searchForm {
    border-bottom: 1px solid #fff;
    width: 100%;
    display: flex;

    input {
      width: 85%;
      height: 4.8rem;
      padding: 0 0 0.2rem 0;
    }

    .searchForm__btn {
      width: 15%;
      display: flex;
      justify-content: flex-end;
    }
    input::placeholder,
    input {
      font-size: 2.4rem;
      font-weight: 300;
      color: #fff;
    }

    i {
      font-size: 1.8rem;
      color: #fff;

      @include mobile_all {
        font-size: 2.4rem;
      }
    }
  }
}
</style>
