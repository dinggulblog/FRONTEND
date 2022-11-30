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

    --Ico-sm: 1.6rem;
    --Ico-md: 2rem;
    --Ico-lg: 2.4rem;
    --Ico-xl: 3.2rem;
    --padding-sm: 0.8rem 1.2rem;
    --padding-md: 1.2rem 2.4rem;
    --padding-lg: 2.4rem 3.2rem;
    --text-sm: 1.1rem;
    --text-md: 1.2rem;
    --text-lg: 2rem;

    // header icons

    --Ico-search: 'M18.94,17.27l5.06,5.06-1.67,1.67-5.06-5.06c-1.88,1.51-4.22,2.33-6.64,2.33C4.76,21.27,0,16.5,0,10.63S4.76,0,10.63,0s10.63,4.76,10.63,10.63c0,2.41-.82,4.75-2.33,6.64Zm-2.37-.88c1.5-1.54,2.34-3.61,2.33-5.76,0-4.57-3.7-8.27-8.27-8.27S2.36,6.06,2.36,10.63s3.7,8.27,8.27,8.27c2.15,0,4.22-.83,5.76-2.33,0,0,.18-.18,.18-.18Z';
    --Ico-menu: 'M0,1.3h24V4H0V1.3z M0,10.7h16v2.7H0V10.7z M0,20h24v2.7H0V20z';
    --Ico-close: 'M12,9.3L21.3,0L24,2.7L14.7,12l9.3,9.3L21.3,24L12,14.7L2.7,24L0,21.3L9.3,12L0,2.7L2.7,0L12,9.3z';
    --Ico-lock: 'M20.4,9.6h1.2c0.7,0,1.2,0.5,1.2,1.2v12c0,0.7-0.5,1.2-1.2,1.2H2.4c-0.7,0-1.2-0.5-1.2-1.2v-12c0-0.7,0.5-1.2,1.2-1.2h1.2  V8.4C3.6,3.8,7.4,0,12,0s8.4,3.8,8.4,8.4V9.6z M3.6,12v9.6h16.8V12H3.6z M10.8,14.4h2.4v4.8h-2.4V14.4z M18,9.6V8.4c0-3.3-2.7-6-6-6  s-6,2.7-6,6v1.2H18z';
    --Ico-create: 'M17,8.9L15.1,7L2.7,19.4v1.9h1.9C4.6,21.3,17,8.9,17,8.9z M18.9,7l1.9-1.9l-1.9-1.9L17,5.1L18.9,7z M5.7,24H0v-5.7L17.9,0.4  c0.5-0.5,1.4-0.5,1.9,0l3.8,3.8c0.5,0.5,0.5,1.4,0,1.9L5.7,24L5.7,24z';

    // posts, post icons

    --Ico-comment: 'M9.6,0.3h4.8c5.3,0,9.6,4.3,9.6,9.6s-4.3,9.6-9.6,9.6v4.2C8.4,21.3,0,17.7,0,9.9C0,4.6,4.3,0.3,9.6,0.3z M12,17.1h2.4  c4,0,7.2-3.2,7.2-7.2s-3.2-7.2-7.2-7.2H9.6c-4,0-7.2,3.2-7.2,7.2c0,4.3,3,7.2,9.6,10.2V17.1z';
    --Ico-like: 'M12,2.7c2.8-2.5,7.2-2.4,9.9,0.3c2.7,2.7,2.8,7.1,0.3,9.9L12,23.1L1.8,12.9C-0.7,10.1-0.6,5.7,2.1,3C4.8,0.3,9.2,0.2,12,2.7  z M20.2,4.7c-1.8-1.8-4.7-1.9-6.6-0.2L12,6l-1.6-1.4C8.5,2.8,5.6,2.9,3.8,4.7C2,6.5,1.9,9.4,3.6,11.3l8.4,8.4l8.4-8.4  C22.1,9.4,22,6.5,20.2,4.7z';
    --Ico-like-fill: 'M12,2.7c2.8-2.5,7.2-2.4,9.9,0.3c2.7,2.7,2.8,7.1,0.3,9.9L12,23.1L1.8,12.9C-0.7,10.1-0.6,5.7,2.1,3C4.8,0.3,9.2,0.2,12,2.7  z';
    --Ico-more: 'M12,0c-1.5,0-2.7,1.2-2.7,2.7s1.2,2.7,2.7,2.7s2.7-1.2,2.7-2.7S13.5,0,12,0z M12,18.7c-1.5,0-2.7,1.2-2.7,2.7S10.5,24,12,24  s2.7-1.2,2.7-2.7S13.5,18.7,12,18.7z M12,9.3c-1.5,0-2.7,1.2-2.7,2.7s1.2,2.7,2.7,2.7s2.7-1.2,2.7-2.7S13.5,9.3,12,9.3z';

    // toolbar icons

    --Ico-home: 'M13.3,21.4H21V9.9l-9-7l-9,7v11.6h7.7v-7.7h2.6V21.4z M23.5,22.7c0,0.7-0.6,1.3-1.3,1.3H1.8c-0.7,0-1.3-0.6-1.3-1.3V9.3  c0-0.4,0.2-0.8,0.5-1l10.2-8c0.5-0.4,1.1-0.4,1.6,0l10.2,8c0.3,0.2,0.5,0.6,0.5,1C23.5,9.3,23.5,22.7,23.5,22.7z';
    --Ico-row: 'M21.3,10.7v-8H2.7v8H21.3z M21.3,13.3H2.7v8h18.7V13.3z M1.3,0h21.3C23.4,0,24,0.6,24,1.3v21.3c0,0.7-0.6,1.3-1.3,1.3H1.3  C0.6,24,0,23.4,0,22.7V1.3C0,0.6,0.6,0,1.3,0z';
    --Ico-grid: 'M22.8,0C23.5,0,24,0.6,24,1.3v21.3c0,0.7-0.5,1.3-1.2,1.3H1.2C0.5,24,0,23.4,0,22.7V1.3C0,0.6,0.5,0,1.2,0H22.8z M10.8,13.3  H2.4v8h8.4V13.3z M21.6,13.3h-8.4v8h8.4V13.3z M10.8,2.7H2.4v8h8.4V2.7z M21.6,2.7h-8.4v8h8.4V2.7z';

    // editor icons

    --Ico-toggle: 'M7.6,6.5c-3,0-5.5,2.4-5.5,5.5s2.4,5.5,5.5,5.5h8.7c3,0,5.5-2.4,5.5-5.5s-2.4-5.5-5.5-5.5H7.6z M7.6,4.4h8.7  c4.2,0,7.6,3.4,7.6,7.6s-3.4,7.6-7.6,7.6H7.6C3.4,19.6,0,16.2,0,12S3.4,4.4,7.6,4.4z M7.6,15.3c-1.8,0-3.3-1.5-3.3-3.3  s1.5-3.3,3.3-3.3s3.3,1.5,3.3,3.3S9.4,15.3,7.6,15.3z';
    --Ico-toggle-fill: 'M7.6,4.4h8.7c4.2,0,7.6,3.4,7.6,7.6s-3.4,7.6-7.6,7.6H7.6C3.4,19.6,0,16.2,0,12S3.4,4.4,7.6,4.4z M16.4,15.3  c1.8,0,3.3-1.5,3.3-3.3s-1.5-3.3-3.3-3.3s-3.3,1.5-3.3,3.3S14.6,15.3,16.4,15.3z';
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
