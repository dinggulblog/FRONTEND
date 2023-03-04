<template>
  <div class="member-list">
    <div class="wrap_table">
      <div class="table-header">
        <div class="table-row">
          <div class="table-head" v-for="head in tableHead" :key="head">
            {{ head }}
          </div>
        </div>
      </div>

      <div class="table-body">
        <div class="table-row" v-for="data in tableData" :key="data">
          <div class="table-cell" v-for="(value, key) in data" :key="key" :class="key">
            <img :src="value" v-if="key === 'avatar'" :class="key" />
            <span v-else v-for="v in value" :key="v" :class="v">{{ v }}</span>
          </div>

          <div class="table-cell">
            <Button class="btn_dropbox" :size="'sm'" :svg="'more'" @click="$refs.ACTION_SLOT_EL.onToggle()" />

            <Action ref="ACTION_SLOT_EL" :dropboxItems="dropboxItems" />
          </div>
        </div>
      </div>
    </div>

    <div class="wrap_btns">
      <Button :shape="'line-round'" :size="'sm'">회원 정지</Button>
    </div>
  </div>
</template>

<script setup>
import Action from '../../components/Action.vue'
import { reactive, ref, onMounted } from 'vue'

const dropboxItems = reactive({})

const tableHead = ref(['아바타', '이메일', '닉네임', '권한', '가입일', '마지막 로그인', '상태', '옵션'])
const tableData = ref({
  solsol: {
    avatar: 'https://m.animalfriends.co.kr/web/product/big/202102/a7af6abee9c55d71d86aeea5e6c88a8d.jpg',
    email: 'cyes.0001@gmail.com',
    name: 'solsol',
    role: ['admin', 'user'],
    createdAt: '2022년 12월 13일',
    lastedLogin: '2023년 1월 2일',
    isActive: '활성',
  },
  ming: {
    avatar: 'https://danonline.kr/snoopym/images/snoopy_spoon.png?crc=3980034464',
    email: 'kimkusyeon@gmail.com',
    name: 'ming',
    role: ['admin', 'user'],
    createdAt: '2022년 3월 13일',
    lastedLogin: '2023년 5월 2일',
    isActive: '비활성',
  },
})

const test1 = () => {
  console.log('hi')
}

const setDropboxItems = () => {
  dropboxItems['회원 정보'] = test1
  dropboxItems['회원 정지'] = test1
}

onMounted(() => {
  setDropboxItems()
})
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.wrap_table {
  display: table;
  font-size: 1.4rem;
  width: 100%;
}
.table-row {
  display: table-row;
}
.table-header {
  display: table-header-group;
}
.table-head,
.table-cell {
  display: table-cell;
  vertical-align: middle;
  padding: 1.6rem 1.6rem;
}
.table-head {
  font-weight: 500;
  color: var(--primary-dark);
}
.table-cell {
  color: var(--text4);
}
.table-body {
  display: table-row-group;
}

.avatar > img {
  width: 4.8rem;
  height: 4.8rem;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border3);
}

.role > span {
  padding: 0.4rem 0.8rem;
  border-radius: 0.4rem;
  font-size: 1.1rem;
  letter-spacing: 0.1rem;
  margin: 0 0.4rem 0 0;

  &:last-child {
    margin: 0;
  }

  &.admin {
    background-color: var(--error-light);
    color: var(--error);
  }
  &.user {
    background-color: #ececec;
    color: var(--text4);
  }
}

.wrap_btns {
  display: flex;
  justify-content: flex-end;
}
</style>
