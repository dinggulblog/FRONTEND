import { config } from 'dotenv'
import { createApp } from 'vue'
import VueDOMPurifyHTML from 'vue-dompurify-html'
import App from './App.vue'
import router from './router'
import store from './store'
import setupInterceptors from './services/axios.interceptors'
import Dialog from './components/global/Dialog.vue'
import ToastMessage from './components/global/ToastMessage.vue'
import Button from './components/global/Button.vue'
import Ico from './components/global/Ico.vue'

config() // dotenv config
setupInterceptors(store) // create axios instance

const app = createApp(App)
app.use(store)
app.use(router)
app.use(VueDOMPurifyHTML)
app.component('Dialog', Dialog)
app.component('ToastMessage', ToastMessage)
app.component('Button', Button)
app.component('Ico', Ico)
app.mount('#app')
