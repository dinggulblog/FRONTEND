import axiosInstance from './axios'
import TokenService from './token.service'

const setup = (store) => {
  axiosInstance.interceptors.request.use(
    async (config) => {
      const token = TokenService.getAccessToken()

      config.headers['Authorization'] = token
        ? 'Bearer ' + token
        : config.url.endsWith('account') && config.method.toLowerCase() === 'post' ? process.env.VUE_APP_SECRET_KEY?.trim() : null

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
      console.log('Error response: ', error.response.status, error.response.data, '\nRequested URL: ', error.response.request.responseURL, '\n')
      
      if (!originalConfig.url.endsWith('auth') && error.response) {
        // 419 Error response => Refresh token was expired OR not exist => Logout
        if (error.response.status === 419) {
          originalConfig._retry = true
          alert(error.response.data?.message)
          await store.dispatch('auth/logout')
          return axiosInstance(originalConfig)
        }

        // Access token was not provided OR was expired
        if (error.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true
          await store.dispatch('auth/refresh')
          return axiosInstance(originalConfig)
        }
      }

      return Promise.reject(error)
    }
  )
}

export default setup
