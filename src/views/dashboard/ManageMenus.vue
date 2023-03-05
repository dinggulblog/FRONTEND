<template>
  <div class="wrap_menus">
    <ul class="ul_menus">
      <li v-for="(value, key) in menus" :key="key" class="menu">
        <span class="span_menu">💜 {{ key }}</span>
        <ul>
          <li v-for="v in value" :key="v.sub" class="sub" @click="onEditMenu(v)">
            <span class="span_sub">📁 {{ v.sub }}</span>
          </li>
        </ul>
      </li>
    </ul>

    <div class="wrap_edit">
      <EditMenu :menu="targetMenu" ref="EDIT_EL" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import EditMenu from './EditMenu.vue'

const { state } = useStore()
const menus = computed(() => state.menu.menus)

const EDIT_EL = ref(null)

const targetMenu = ref(null)

const onEditMenu = (sub) => {
  targetMenu.value = sub
  EDIT_EL.value.open()
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.wrap_menus {
  display: flex;
  color: var(--text4);

  .ul_menus {
    border: 1px solid #ddd;
    border-radius: 1.2rem;
    padding: 1.6rem 0 0;
  }

  ul > li {
    font-size: 1.4rem;
    text-transform: uppercase;
    width: 24rem;
    cursor: pointer;

    & > ul {
      margin: 1.6rem 0 0;

      li {
        padding: 0 2.4rem;
      }
    }
  }
  .menu {
    &:first-child {
      margin: 0 0 1.6rem 0;
      border-bottom: 1px dashed #ddd;
    }

    .span_menu {
      margin: 0 0 0 2.4rem;
      font-weight: 700;
    }
  }
  .sub {
    padding: 1.6rem 0 1.6rem 6.4rem;
    border-top: 1px solid #ddd;
    width: calc(24rem - 6.4rem);
  }

  .wrap_edit {
    display: none;
  }
}
</style>
