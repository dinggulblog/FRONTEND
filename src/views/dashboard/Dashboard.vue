<template>
  <div class="dashboard">
    <ul class="ul_chips">
      <li v-for="(value, key) in chips" :key="key" @click="setChip($event, key)" class="chip" ref="CHIP_EL">{{ value }}</li>
    </ul>
    <component :is="layouts[chipState]" />
</div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import Chart from './Chart.vue'
import Members from './Members.vue'
import ManagePosts from './ManagePosts.vue'

const layouts = {
  Chart: Chart,
  Members: Members,
  ManagePosts: ManagePosts,
}

const CHIP_EL = ref(null)

const chips = ref({
  Chart: '통계',
  Members: '회원 목록',
  ManagePosts: '포스팅 관리',
  ManageMenus: '메뉴 설정'
  },
)

const chipState = ref('Chart')

const setChip = (event, chip) => {
  chipState.value = chip
  CHIP_EL.value.forEach(el => el.classList.remove('on'))
  event.target.classList.add('on')
}

onMounted(() => {
  CHIP_EL.value[0].classList.add('on')
})

</script>

<style lang="scss" rel="stylesheet/scss">

.dashboard {
  .ul_chips {
    display: flex;
    margin:0 0 3.2rem;

    li {
      padding:0.8rem 1.2rem;
      border-radius: 1.6rem;
      font-size:1.4rem;
      letter-spacing: 0.1rem;
      margin:0 0.8rem 0 0;
      background-color: #ededed; color: var(--text4);
      cursor: pointer;

      &:last-child {
        margin:0;
      }

      &.on {
        color:var(--primary);
        font-weight: 500;
      }
    }
  }
}


</style>
