import { config } from 'dotenv'
import { createApp } from 'vue'
import VueDOMPurifyHTML from 'vue-dompurify-html'
import App from './App.vue'
import router from './router'
import store from './store'
import setupInterceptors from './services/axios.interceptors'
import Dialog from './components/global/Dialog.vue'
import ToastMessage from './components/global/ToastMessage.vue'
import Button from './components/ui/Button.vue'
import Ico from './components/ui/Ico.vue'

config() // dotenv config
setupInterceptors(store) // create axios instance

const app = createApp(App)

app.use(store)
  .use(router)
  .use(VueDOMPurifyHTML)
  .component('Dialog', Dialog)
  .component('ToastMessage', ToastMessage)
  .component('Button', Button)
  .component('Ico', Ico)
  .mount('#app')
