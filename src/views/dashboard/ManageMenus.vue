<template>
  <div class="wrap_menus">
    <ul class="ul_menus">
      <li v-for="(value, key) in menus" :key="key" class="menu">
        💜 {{ key }}
        <ul>
          <li v-for="v in value" :key="v.sub" class="sub" @click="onEditMenu(v)">
            {{ v.sub }}
          </li>
        </ul>
      </li>
    </ul>

    <div class="wrap_edit">
      <EditMenu :menu="targetMenu" ref="EDIT_EL"/>
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

  ul > li {
    font-size: 1.4rem;
    text-transform: uppercase;
  }
  .menu {
    margin: 0 0 3.2rem 0;
    padding:0 0 0 0.4rem;
  }
  .sub {
    margin: 2.4rem 0 2.4rem 3.2rem;
  }

  .wrap_edit {
    display: none;
  }
}
</style>
