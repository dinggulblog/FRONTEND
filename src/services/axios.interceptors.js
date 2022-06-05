import axiosInstance from './axios'
import TokenService from './token.service'

const setup = (store) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = TokenService.getAccessToken()
      console.log(token)
      if (token) {
        config.headers['Authorization'] = token
      } else {
        config.headers['Authorization'] = process.env.VUE_APP_SECRET_KEY.toString().trim()
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  axiosInstance.interceptors.response.use(
    (response) => {
      console.log(response)
      return response
    },
    async (error) => {
      const originalConfig = error.config
      console.log(originalConfig)

      if (originalConfig.url !== '/app/auth/login' && error.response) {
        // Access token was expired
        if (error.response.status === 401 && !originalConfig._retry) {
          alert('Access token expired, please login again.')
          originalConfig._retry = true

          try {
            store.dispatch('auth/logout')
            /*
            const rs = await axiosInstance.post(`${process.env.VUE_APP_API_URL}`, {
              refreshToken: TokenService.getRefreshToken(),
            })
            const { accessToken } = rs.data
            
            store.dispatch('refreshToken', accessToken)
            TokenService.setAccessToken(accessToken)
            */

            return axiosInstance(originalConfig)
          } catch (err) {
            return Promise.reject(err)
          }
        }
      }
      return Promise.reject(error)
    }
  )
}

export default setup
