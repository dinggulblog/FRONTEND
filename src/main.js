import { config } from 'dotenv'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import setupInterceptors from './services/axios.interceptors'

config() // dotenv config
setupInterceptors(store) // create axios instance

createApp(App).use(store).use(router).mount('#app')
