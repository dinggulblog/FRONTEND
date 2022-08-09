import store from '../store'

class TokenService {
  getAccessToken() {
    return store.state.auth.token
  }

  isTokenAlive(exp) {
    return Date.now() >= exp * 1000 ? false : true
  }

  getUser() {
    return store.state.auth.user
  }
}

export default new TokenService()
