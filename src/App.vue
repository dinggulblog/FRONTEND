<template>
  <div id="root">
    <div id="header">
      <MyHeader />
    </div>

    <div class="content-container">
      <div id="content">
        <router-view />
      </div>
    </div>

    <div id="footer">copyright SOL & MING all rights reserved</div>

    <div class="m-createBtn">
      <router-link :to="{ name: 'editor' }" class="a_create"><i class="material-icons">create</i></router-link>
    </div>
  </div>
</template>

<script>
  import MyHeader from './components/global/MyHeader.vue'

  export default {
    name: 'app',
    components: {
      MyHeader,
    },
    setup() {},
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Roboto+Condensed:wght@700&family=Roboto:wght@300;400;500;700&display=swap');
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
  @import url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff');

  :root {
    --primary: #c3d3de;
    --primary-dark: #aec4d4;
    --secondary: #c5c3de;
    --secondary-dark: #b4b1d5;

    --likeActive: #f3c7c7;
    --success: #4cd964;
    --warning: #ffc861;
    --error: #ff3b30;
    --text-light: #a5a5a5;
    --text-dark: #333;
    --thumbnail: #e6e6e6;
    --list_title: #a9a9a9;
    --list_summary: #bababa;
    --list_info: #d0d0d0;
    --list_info-light: #e0e0e0;
    --list_info-dark: #bbbbbb;
    --input_text: #b0b0b0;
    --btn_border: #e5e5e5;
    --btn_text: #b7b7b7;
    --border-light: #efefef;
    --border-dark: #dddddd;

    --Ico-sm: 1.2rem;
    --Ico-md: 2.4rem;
    --Ico-lg: 3.2rem;
    --padding-sm: 0.8rem 1.2rem;
    --padding-md: 1.2rem 2.4rem;
    --padding-lg: 2.4rem 3.2rem;
    --text-sm: 1.1rem;
    --text-md: 1.2rem;
    --text-lg: 2rem;

    // header icons

    --Ico-search: M19 11V5H5v6h14zm0 2H5v6h14v-6zM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z;
    --Ico-menu: M21, 3c0.6, 0, 1, 0.4, 1, 1v16c0, 0.6-0.4, 1-1, 1H3c-0.6, 0-1-0.4-1-1V4c0-0.6, 0.4-1, 1-1H21z M11,
      13H4v6h7V13zM20, 13h-7v6h7V13zM11, 5H4v6h7V5zM20, 5h-7v6h7V5z;
    --Ico-close: M21, 3c0.6, 0, 1, 0.4, 1, 1v16c0, 0.6-0.4, 1-1, 1H3c-0.6, 0-1-0.4-1-1V4c0-0.6, 0.4-1, 1-1H21z M11,
      13H4v6h7V13zM20, 13h-7v6h7V13zM11, 5H4v6h7V5zM20, 5h-7v6h7V5z;
    --Ico-close: M21, 3c0.6, 0, 1, 0.4, 1, 1v16c0, 0.6-0.4, 1-1, 1H3c-0.6, 0-1-0.4-1-1V4c0-0.6, 0.4-1, 1-1H21z M11,
      13H4v6h7V13zM20, 13h-7v6h7V13zM11, 5H4v6h7V5zM20, 5h-7v6h7V5z;

    // posts, post icons

    --Ico-chat: M21, 3c0.6, 0, 1, 0.4, 1, 1v16c0, 0.6-0.4, 1-1, 1H3c-0.6, 0-1-0.4-1-1V4c0-0.6, 0.4-1, 1-1H21z M11,
      13H4v6h7V13zM20, 13h-7v6h7V13zM11, 5H4v6h7V5zM20, 5h-7v6h7V5z;
    --Ico-heart: M21, 3c0.6, 0, 1, 0.4, 1, 1v16c0, 0.6-0.4, 1-1, 1H3c-0.6, 0-1-0.4-1-1V4c0-0.6, 0.4-1, 1-1H21z M11,
      13H4v6h7V13zM20, 13h-7v6h7V13zM11, 5H4v6h7V5zM20, 5h-7v6h7V5z;
    --Ico-more: M21, 3c0.6, 0, 1, 0.4, 1, 1v16c0, 0.6-0.4, 1-1, 1H3c-0.6, 0-1-0.4-1-1V4c0-0.6, 0.4-1, 1-1H21z M11,
      13H4v6h7V13zM20, 13h-7v6h7V13zM11, 5H4v6h7V5zM20, 5h-7v6h7V5z;

    // toolbar icons

    --Ico-home: 'M21,3c0.6,0,1,0.4,1,1v16c0,0.6-0.4,1-1,1H3c-0.6,0-1-0.4-1-1V4c0-0.6,0.4-1,1-1H21z M11,13H4v6h7V13zM20,13h-7v6h7V13zM11,5H4v6h7V5zM20,5h-7v6h7V5z';
    --Ico-row: M19 11V5H5v6h14zm0 2H5v6h14v-6zM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z;
    --Ico-grid: M21, 3c0.6, 0, 1, 0.4, 1, 1v16c0, 0.6-0.4, 1-1, 1H3c-0.6, 0-1-0.4-1-1V4c0-0.6, 0.4-1, 1-1H21z M11,
      13H4v6h7V13zM20, 13h-7v6h7V13zM11, 5H4v6h7V5zM20, 5h-7v6h7V5z;
  }

  /********** CSS RESET **********/

  * {
    margin: 0;
    padding: 0;
    border: 0;
    outline: none;
    letter-spacing: -0.02em;
    -webkit-font-smoothing: antialiased;
    list-style: none;
    box-sizing: border-box;
  }

  *,
  :after,
  :before {
    box-sizing: border-box;
  }

  :root {
    -webkit-tap-highlight-color: transparent;
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    overflow-wrap: break-word;
    -moz-tab-size: 4;
    tab-size: 4;
  }

  html {
    font-size: 62.5%;
  }

  html,
  body {
    height: 100%;
  }

  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
  }

  a,
  button {
    background: none;
    border: 0;
    cursor: pointer;
  }

  a {
    text-decoration: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  input {
    background: transparent;
    border: 0;
  }

  /********** CSS RESET END **********/

  i {
    position: relative;
    top: 0.1rem;
  }

  #app,
  textarea,
  input,
  button {
    font-family: 'Roboto', 'Noto Sans KR', sans-serif;
  }

  #header {
    position: sticky;
    top: 0;
    z-index: 999;
    width: 100%;
    margin: 0 0 4.8rem;
  }

  .content-container {
    display: flex;
    justify-content: center;

    #content {
      max-width: calc(120rem - 4.8rem);
      min-width: calc(120rem - 4.8rem);
      margin: 0 2.4rem;

      @include mobile {
        min-width: calc(36rem - 4rem);
        max-width: calc(76.8rem - 9.6rem);
        margin: 0 2rem;
      }

      @include tablet {
        min-width: calc(76.8rem - 9.6rem);
        max-width: calc(102.4rem - 6.4rem);
        margin: 0 6.4rem;
      }

      @include tablet_landscape {
        min-width: calc(102.4rem - 6.4rem);
        max-width: calc(120rem - 4.8rem);
        margin: 0 3.2rem;
      }
    }
  }

  #footer {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 6.4rem;
    margin: 4.8rem 0;
    font-size: 1.2rem;
    color: var(--text-light);
    letter-spacing: 0.1rem;
  }

  .m-createBtn {
    display: none;

    @include mobile_all {
      display: block;
      position: fixed;
      right: 2.4rem;
      bottom: 3.2rem;
    }

    .a_create {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 4.8rem;
      height: 4.8rem;
      color: #fff;
      background-color: var(--secondary);
      border-radius: 50%;
      box-shadow: 0 0.8rem 1.6rem rgba(0, 0, 0, 0.12);
    }
  }

  .dropdown {
    position: relative;
    cursor: pointer;

    &:hover .dropdown_items {
      display: flex;
    }
  }
  .dropdown_items {
    position: absolute;
    top: 0;
    right: 0;
    display: none;
  }
</style>
