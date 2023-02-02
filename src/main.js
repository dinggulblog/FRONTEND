import { config } from 'dotenv'
import { createApp } from 'vue'
import VueDOMPurifyHTML from 'vue-dompurify-html'
import App from './App.vue'
import router from './router'
import store from './store'
import setupInterceptors from './services/axios.interceptors'
import Dialog from './components/global/Dialog.vue'
import ToastMessage from './components/global/ToastMessage.vue'
import Account from './components/global/Account.vue'
import Contact from './components/global/ContactUs.vue'
import TextInput from './components/ui/TextInput.vue'
import TextArea from './components/ui/TextArea.vue'
import Button from './components/ui/Button.vue'
import Ico from './components/ui/Ico.vue'

config() // dotenv config
setupInterceptors(store) // create axios instance

const app = createApp(App)

app
  .use(store)
  .use(router)
  .use(VueDOMPurifyHTML)
  .component('Dialog', Dialog)
  .component('ToastMessage', ToastMessage)
  .component('Account', Account)
  .component('Contact', Contact)
  .component('TextInput', TextInput)
  .component('TextArea', TextArea)
  .component('Button', Button)
  .component('Ico', Ico)
  .mount('#app')
