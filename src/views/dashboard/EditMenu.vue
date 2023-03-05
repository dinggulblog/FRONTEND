<template>
  <PopupModal ref="POPUP_EL">
    <div class="wrap_edit-menu">
      <!-- Close button -->
      <div class="wrap_btn-close">
        <Button class="btn_close" :svg="'close'" :theme="'primary'" @click="close" />
      </div>

      <div class="wrap_sub">
        <h2 v-if="!subState">{{ menu.sub }}</h2>
        <input v-else label="카테고리명" type="text" v-model="updateSubName" ref="INPUT_SUB_EL" />
        <Button size="sm" shape="line-round" theme="primary" @click="onUpdateSubName(!subState ? menu.sub : '')">{{ !subState ? '이름 변경' : '변경 완료' }}</Button>
      </div>

      <!--<input type="text" />-->

      <div class="wrap_categories">
        <label>카테고리</label>
        <ul>
          <li v-for="(category, idx) in menu.categories" :key="idx" :data-index="idx">
            <span>{{ category }}</span>
            <span class="btn_del" @click="onDeleteCategory">❌</span>
          </li>
        </ul>
      </div>

      <label>카테고리 추가</label>
      <div class="wrap_add-category">
        <input label="카테고리명" type="text" v-model="addCategoryName" />
        <Button size="sm" shape="line-round" theme="primary" @click="onAddCategory">추가</Button>
      </div>
    </div>
  </PopupModal>
</template>

<script setup>
import { ref, toRefs, inject, watch } from 'vue'
import { useStore } from 'vuex'
import PopupModal from '../../components/ui/PopupModal.vue'

const props = defineProps({
  menu: {
    type: Object,
  },
})

const { dispatch } = useStore()
const { menu } = toRefs(props)

const TOAST_EL = inject('TOAST_EL')
const POPUP_EL = ref(null)
const INPUT_SUB_EL = ref(null)

const subState = ref(false)
const updateSubName = ref(null)
const addCategoryName = ref(null)
let payload = {}

const onUpdateSubName = (name) => {
  if (!subState.value) {
    subState.value = true
    updateSubName.value = name
    //if(INPUT_SUB_EL.value) INPUT_SUB_EL.value.focus()
    updateMenu(payload, '메뉴이름이 변경되었습니다')
  } else {
    menu.value.sub = updateSubName.value
    subState.value = false
  }
}

const onAddCategory = () => {
  if (addCategoryName.value) {
    menu.value.categories.push(addCategoryName.value)
    payload['categories'].push(addCategoryName.value)
    addCategoryName.value = null
    updateMenu(payload, '카테고리가 추가되었습니다')
  } else {
    TOAST_EL.value.open('error', '카테고리명을 입력해주세요.')
  }
}

const onDelCategory = () => {}

const setPayload = () => {
  payload['_id'] = menu.value._id
  payload['main'] = menu.value.main
  payload['sub'] = menu.value.sub
  payload['type'] = menu.value.type
  payload['categories'] = []
  for (const category of menu.value.categories) {
    payload['categories'].push(category)
  }
}

const updateMenu = async (payload, act) => {
  const { success, error } = await dispatch('menu/updateMenu', payload)
  console.log('전송된 페이로드는?', payload)
  if (success) {
    TOAST_EL.value.open('success', `${act}`)
  } else {
    TOAST_EL.value.open('error', error)
  }
}

const open = () => {
  POPUP_EL.value?.open()
}

const close = () => {
  POPUP_EL.value?.close()
}

watch(props,
  () => {
    setPayload()
})


defineExpose({ open, close })
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.wrap_edit-menu {
  background: #fff;
  padding: 3.2rem 3.2rem;
  font-size: 1.4rem;
  color: var(--text4);
  min-width: 37rem;
  max-width: 37rem;

  label {
    color: var(--primary);
  }

  .wrap_btn-close {
    display: flex;
    justify-content: flex-end;
    margin: 0 0 2.4rem;
  }

  .wrap_sub {
    display: flex;
    align-items: center;

    h2 {
      text-transform: uppercase;
      width:78%;
    }

    input {
      text-transform: uppercase;
      width:78%;
      font-size: 1.5em;
    }
  }

  .wrap_categories {
    margin: 1rem 0 0;
    border-top: 1px solid var(--border2);
    padding: 2.4rem 0 3.2rem 0;

    ul {
      li {
        margin: 1.6rem 0 0;
        font-size: 1.4rem;
        cursor: pointer;

        .btn_del {
          margin: 0 0 0 0.4rem;
        }
      }
    }
  }

  .wrap_add-category {
    display: flex;
    margin: 0 0 3.2rem 0;

    input {
      flex: auto;
      border-bottom: 1px solid #ddd;
      margin: 0 1.2rem 0 0;
    }
  }
}
</style>
