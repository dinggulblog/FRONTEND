<template>
  <div class="searchForm__inner">
    <div class="searchForm">
      <input class="searchForm__text" type="text" :placeholder="'검색어를 입력해주세요'" />
      <div class="searchForm__btn">
        <Button class="btn_search" :size="'md'" :svg="'search'" :customColor="'var(--primary)'" :customPadding="'0'">
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    setup() {
      return {}
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
      border-bottom: 1px solid var(--primary);
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
        color: var(--primary);
      }
    }
  }
</style>
