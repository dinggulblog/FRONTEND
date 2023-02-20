<template>
  <div class="search">
    <Form as="div" class="wrap_search-form" v-slot="{ handleSubmit }" :validation-schema="searchSchema">
      <form @submit="handleSubmit($event, onSearch)">
        <TextInput name="text" type="text" label="검색어" placeholder="검색어를 입력해주세요" @callback="handleSubmit($event, onSearch)"/>
        <Button type="submit" class="btn_submit" :shape="'fill-round-full'" :theme="'primary'"></Button>
      </form>
    </Form>
    <Ico class="ico_search" :svg="'search'" :color="'primary'"></Ico>
  </div>
</template>

<script setup>
import { Form } from 'vee-validate'
import * as Yup from 'yup'

const searchSchema = Yup.object().shape({
  text: Yup.string().required('검색어를 입력해 주세요.')
})

const onSearch = async (values) => {
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .search {
    border-bottom: 1px solid var(--primary);
    .wrap_search-form {
      display: flex;
      align-items: center;
      position: relative;
      padding:0 0 1.2rem;

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
        right:0;
      }
    }
  }
</style>
