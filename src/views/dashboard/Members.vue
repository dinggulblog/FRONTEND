<template>
  <div class="member-list">
    <div class="wrap_table">
      <div class="table-header">
        <div class="table-row">
          <div class="table-head" v-for="head in tableHeads" :key="head">
            {{ head }}
          </div>
        </div>
      </div>

      <div class="table-body">
        <div class="table-row" v-for="(member, idx) in members" :key="idx">
          <div class="table-cell checkbox">
            <input type="checkbox" ref="CHECKBOX_EL" :data-index="idx" />
          </div>

          <div class="table-cell avatar">
            <img :src="member.avatar?.thumbnail ?? DEFAULT_AVATAR_64" class="img_avatar" @error="onGetDefaultImage" />
          </div>

          <div class="table-cell email">
            <span>{{ member.email }}</span>
          </div>

          <div class="table-cell nickname">
            <span>{{ member.nickname }}</span>
          </div>

          <div class="table-cell role">
            <span v-for="role in member.roles" :key="role" :class="role.name">{{ role.name }}</span>
          </div>

          <div class="table-cell createdAt">
            <span>{{ getTime(member.createdAt) }}</span>
          </div>

          <div class="table-cell lastLoggedAt">
            <span>{{ getTime(member.updatedAt) }}</span>
          </div>

          <div class="table-cell isActive">
            <span>{{ member.isActive ? '활성' : '비활성' }}</span>
          </div>

          <div class="table-cell">
            <Button class="btn_dropbox" :size="'sm'" :svg="'more'" @click="$refs.KEBAB_SLOT_EL[idx].onToggle()" />

            <Kebab ref="KEBAB_SLOT_EL" :dropboxItems="{ '회원 정보 수정': () => onUpdateMember(member) }" />
          </div>
        </div>
      </div>
    </div>

    <div class="wrap_btns">
      <Button :shape="'line-round'" :size="'sm'" @click="onActiveMember" class="btn_active-member">회원 활성</Button>
      <Button :shape="'line-round'" :size="'sm'" @click="onBlockMember" class="btn_block-member">회원 정지</Button>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, computed } from 'vue'
import { useStore } from 'vuex'
import { getTime } from '../../common/time.js'
import DEFAULT_AVATAR_64 from '../../assets/default_avatar_64.webp'

const { dispatch, commit, state } = useStore()

const TOAST_EL = inject('TOAST_EL')
const ACCOUNT_EL = inject('ACCOUNT_EL')
const CHECKBOX_EL = ref(null)

const members = computed(() => state.auth.members)

const tableHeads = ref(['선택', '아바타', '이메일', '닉네임', '권한', '가입일', '마지막 로그인', '상태', '옵션'])
let payload = []

const onGetDefaultImage = (event) => {
  event.target.src = DEFAULT_AVATAR_64
}

const getMembers = async () => {
  const { success, users, error } = await dispatch('auth/getMembers')
  if (!success) TOAST_EL.value.open('error', error)
  commit('auth/SET_MEMBERS', users)
}

/* 회원 정보 수정 : 단일 */
const onUpdateMember = (member) => {
  commit('auth/SET_MEMBER', member)
  ACCOUNT_EL.value.open('admin-update')
}

/* 현재 체크박스 선택된 멤버들 */
const checkedMember = () => {
  payload = []
  let checkedMembers = CHECKBOX_EL.value.filter((checkbox) => checkbox.checked)

  for (const member of checkedMembers) {
    const m = members.value.at(member.dataset.index)
    payload.push({
      _id: m._id,
      isActive: m.isActive
    })
  }
}

/* 비활성화 */
const onBlockMember = () => {
  checkedMember()
  payload.forEach((el) => el.isActive = false)
  onUpdateMembers(payload, '차단')
  console.log('state', members.value)
}

/* 활성화 */
const onActiveMember = () => {
  checkedMember()
  payload.forEach((el) => el.isActive = true)
  onUpdateMembers(payload, '활성')
  console.log('state', members.value)
}

/* 회원 정보 수정 : 다중 */
const onUpdateMembers = async (payload, act) => {
  const { success, error } = await dispatch('auth/updateMember', payload)
  if (success) {
    TOAST_EL.value.open('success', payload.length > 1 ? `${payload.at(0).nickname}+'님 외 '+${payload.length - 1}'명이 '+${act}+' 되었습니다.'` : `${payload.at(0).nickname}+'님이 '+${act}+' 되었습니다'`)
    resetCheckbox()
  } else {
    TOAST_EL.value.open('error', error)
  }
}

/* 체크박스 초기화 */
const resetCheckbox = () => {
  CHECKBOX_EL.value.forEach((checkbox) => checkbox.checked = false)
}

await getMembers()
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
  font-size: 1rem;
  letter-spacing: 0.1rem;
  margin: 0 0.4rem 0 0;

  &:last-child {
    margin: 0;
  }

  &.ADMIN {
    background-color: var(--error-light);
    color: var(--error);
  }
  &.USER {
    background-color: #ececec;
    color: var(--text4);
  }
}

.wrap_btns {
  display: flex;
  justify-content: flex-end;

  .btn {
    margin: 0 0 0 0.8rem;
  }
}
</style>
