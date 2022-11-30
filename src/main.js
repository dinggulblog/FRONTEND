import { config } from 'dotenv'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import setupInterceptors from './services/axios.interceptors'
import Button from './components/Button.vue'
import Ico from './components/Ico.vue'

config() // dotenv config
setupInterceptors(store) // create axios instance

const app = createApp(App)
app.use(store)
app.use(router)
app.component('Button', Button)
app.component('Ico', Ico)
app.mount('#app')
