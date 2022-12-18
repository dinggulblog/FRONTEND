import axiosInstance from './axios'

const setup = (store) => {
  axiosInstance.interceptors.request.use(
    (config) => {

      store.commit('loading/SET_LOADING', true)

      if (config.url.endsWith('account') && config.method.toLowerCase() === 'post') {
        config.headers.Authorization = process.env.VUE_APP_SECRET_KEY?.trim()
      }

      if (config.headers['Content-Type'] === 'multipart/form') {
        config.onUploadProgress = (progressEvent) => {
          let percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          store.commit('loading/SET_PERCENTAGE', percentage, { root: true })
        }
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  axiosInstance.interceptors.response.use(
    (response) => {
      store.commit('loading/SET_LOADING', false)
      return response
    },
    async (error) => {
      const originalConfig = error.config

      store.commit('loading/SET_LOADING', false)

      console.log(`에러:
------------ Original  Config ------------
      URL: ${originalConfig.url}
      Method: ${originalConfig.method}
      Message: ${error.message}
------------ Backend Response ------------
      URL: ${error?.response?.request?.responseURL}
      Status: ${error?.response?.status}
      Message: ${error?.response?.data?.message}
      Success: ${error?.response?.data?.success}
      `)
      
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
