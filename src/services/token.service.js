import store from '../store'

class TokenService {
  getAccessToken() {
    return store.state.auth.user.accessToken || sessionStorage.getItem('accessToken')
  }

  isTokenAlive(exp) {
    if (Date.now() >= exp * 1000) {
      return false
    }
    return true
  }

  getUser() {
    return store.state.auth.user
  }
}

export default new TokenService()
