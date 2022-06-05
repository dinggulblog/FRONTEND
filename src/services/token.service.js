class TokenService {
  getAccessToken() {
    return sessionStorage.getItem('access_token')
  }

  getRefreshToken() {
    return sessionStorage.getItem('refresh_token')
  }

  setAccessToken(token) {
    sessionStorage.setItem('access_token', token)
  }

  setRefreshToken(token) {
    sessionStorage.setItem('refresh_token', token)
  }

  isTokenAlive(exp) {
    if (Date.now() >= exp * 1000) { return false }
    return true
  }

  getUser() {
    return sessionStorage.getItem('user')
  }

  setUser(user) {
    sessionStorage.setItem('user', user)
  }

  removeUser() {
    sessionStorage.removeItem('user')
  }
}

export default new TokenService()