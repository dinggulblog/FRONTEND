import router from '../router'
import axiosInstance from './axios'
import TokenService from './token.service'

const setup = (store) => {
  axiosInstance.interceptors.request.use(
    async (config) => {
      const token = TokenService.getAccessToken()

      config.headers['Authorization'] = token
        ? !String(config.url).endsWith('refresh') ? 'Bearer ' + token : null
        : String(config.url).endsWith('users') ? process.env.VUE_APP_SECRET_KEY?.trim() : null

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  axiosInstance.interceptors.response.use(
    (response) => {
      return response
    },
    async (error) => {
      const originalConfig = error.config
      console.log('Error response: ', error.response.status, '\nError Data: ', error.response.data, '\nRequested URL: ', error.response.request.responseURL, '\n')

      if (!originalConfig.url.endsWith('auth') && error.response) {
        // Refresh token was expired -> Logout
        if (error.response.status === 419) {
          originalConfig._retry = true

          alert(error.response.data.message)
          await store.dispatch('auth/logout')
          router.push({ name: 'login' })
          return axiosInstance(originalConfig)
        }

        // Access token was not provided OR was expired
        if (error.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true

          const res = await store.dispatch('auth/refresh')
          return res.success ? axiosInstance(originalConfig) : Promise.reject(error)
        }
      }
      return Promise.reject(error)
    }
  )
}

export default setup
