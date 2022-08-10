<template>
  <!-- Global Header -->
  <div class="fixedTop">
    <MyHeader />
  </div>

  <!-- Global Body wrapper -->
  <div class="bodyWrap" :style="[!currentRoute.startsWith('/auth') || currentRoute.startsWith('/auth/profile') ? { background: '#fff' } : { background: 'var(--point)' }]">
    <div
      class="body"
      :style="[
        (!currentRoute.startsWith('/auth') && !currentRoute.startsWith('/posts/editor')) || currentRoute.startsWith('/auth/profile')
          ? { gridTemplateColumns: 'minmax(auto, 30.6rem) 1fr' }
          : { gridTemplateColumns: '1fr' },
      ]"
    >
      <!-- Global Navigation -->
      <div class="navigation" v-if="(!currentRoute.startsWith('/auth') && !currentRoute.startsWith('/posts/editor')) || currentRoute.startsWith('/auth/profile')">
        <Navigation />
      </div>

      <!-- Body contents -->
      <div class="view">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import MyHeader from './components/MyHeader.vue'
import Navigation from './components/Navigation.vue'

export default defineComponent({
  name: 'app',
  components: {
    MyHeader,
    Navigation,
  },
  setup() {
    const route = useRoute()
    const currentRoute = computed(() => route.path)
    const currentTitle = computed(() => route.meta.title)

    onBeforeMount(() => {
      document.addEventListener('visibilitychange', changeTitle, false)
    })

    const changeTitle = () => {
      document.hidden ? (document.title = 'DINGGUL') : (document.title = currentTitle.value)
    }

    return { currentRoute }
  },
})
</script>

<style lang="scss" rel="stylesheet/scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Roboto+Condensed:wght@700&family=Roboto:wght@300;400;500;700&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

:root {
  --primary: #999999;
  --secondary: #b0b0b0;
  --sub: #b9b9b9;
  --line: #e8e8e8;
  --point: #686aaf;
  --likeActive: #ff9c9c;
  --like: #ddd;
  --warn: #ffc861;
  --formBg: #efefef;
}

/********** CSS RESET **********/

* {
  margin: 0;
  padding: 0;
  outline: none;
  letter-spacing: 0.05em;
  -webkit-font-smoothing: antialiased;
}

*,
:after,
:before {
  box-sizing: border-box;
  flex-shrink: 0;
}

:root {
  -webkit-tap-highlight-color: transparent;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
  overflow-wrap: break-word;
  -moz-tab-size: 4;
  tab-size: 4;
}

code.hljs {
  line-height: 1 !important;
  margin: 0.5em 0;
}

html {
  font-size: 62.5%;
  overflow-y: scroll;
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
  max-width: 100%;
}

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

#app,
textarea,
input {
  font-family: 'Roboto', 'Noto Sans KR', sans-serif !important;
}

i {
  font-size: 2rem;
  margin-right: 1.6rem;
}

.fixedTop {
  position: sticky;
  top: 0;
  align-self: start;
  width: 100%;
  z-index: 999;
}

.bodyWrap {
  display: grid;
  justify-content: center;
  padding-top: 10rem;
  grid-template-columns: 1fr minmax(auto, 128rem) 1fr;
  transition: 0.2s linear;

  .body {
    grid-column: 2 / 3;
    display: grid;
    height: 81.5vh;

    .navigation {
      position: sticky;
      top: 10rem;
      align-self: start;
    }

    .view {
      font-size: 1.6rem;
    }
  }
}

// Quill custom
.ql-toolbar {
  font-family: 'Roboto' !important;
  padding: 1.3rem 0.8rem !important;
  border: 0 !important;
  background: var(--formBg);

  button,
  span:hover {
    background: transparent !important;
  }

  .ql-picker {
    color: var(--primary) !important;
    border: 0 !important;
  }

  .ql-stroke {
    stroke: var(--primary) !important;
  }

  .ql-fill {
    fill: var(--primary) !important;
  }

  .ql-active {
    background: transparent !important;
    color: var(--point) !important;
  }

  .ql-active .ql-stroke {
    stroke: var(--point) !important;
  }

  .ql-active .ql-fill {
    fill: var(--point) !important;
  }

  .ql-selected {
    background: transparent !important;
    color: var(--point) !important;
  }
}

.ql-container {
  border: 0 !important;
  font-size: 1.4rem !important;

  .ql-editor {
    height: auto;
    min-height: 48rem;
    font-size: 1.4rem !important;
    letter-spacing: 0.05em;
    line-height: 1.5;
    font-family: 'Roboto' !important;
    color: #555;
    background: var(--formBg);

    .ql-size-small {
      font-size: 1.2rem !important;
    }

    .ql-size-normal {
      font-size: 1.4rem !important;
    }

    .ql-size-large {
      font-size: 2.4rem !important;
    }

    .ql-size-huge {
      font-size: 3.2rem !important;
    }
  }

  .ql-blank {
    background: var(--formBg);
  }
}
</style>
