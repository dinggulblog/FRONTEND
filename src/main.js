import { createApp } from 'vue'
import { config } from 'dotenv'
import App from './App.vue'
import router from './router'
import store from './store'
import setupInterceptors from './services/axios.interceptors'

config()
setupInterceptors(store)

createApp(App).use(store).use(router).mount('#app')
