<template>
  <div class="search">
    <div class="wrap_search-form">
      <input type="text" :placeholder="'검색어를 입력해주세요'" />
      <Ico class="ico_search" :svg="'search'" :color="'primary'"></Ico>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" rel="stylesheet/scss" scoped>
.search {
  border-bottom: 1px solid var(--primary);
  .wrap_search-form {
    display: flex;
    align-items: center;
    position: relative;
    padding: 0 0 1.2rem;

    input {
      width: 85%;
      padding: 0 0 0.2rem;
      font-size: 2.4rem;
      font-weight: 300;
      color: var(--primary);
    }

    input::placeholder,
    input {
      font-size: 2.4rem;
      font-weight: 300;
      color: var(--primary);
    }

    .ico_search {
      position: absolute;
      right: 0;
    }
  }
}
</style>
