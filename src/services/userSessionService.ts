import { API_URL, getAuthHeaders, getJsonHeaders } from './index'

export default {
  async signIn(email, password) {
    const response = await fetch(`${API_URL}/sign_in`, {
      method: 'POST',
      headers: getJsonHeaders(),
      body: JSON.stringify({ email, password }),
    })
    return response.json()
  },

  async signUp(email, password) {
    const response = await fetch(`${API_URL}/sign_up`, {
      method: 'POST',
      headers: getJsonHeaders(),
      body: JSON.stringify({ email, password }),
    })
    return response.json()
  },

  async refreshToken(refreshToken) {
    const response = await fetch(`${API_URL}/refresh`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${refreshToken}` },
    })
    return response.json()
  },

  async revokeToken() {
    const response = await fetch(`${API_URL}/revoke`, {
      method: 'POST',
      headers: getAuthHeaders(),
    })
    useUserStore().clearUserToken() // Clear token from store and local storage
    return response.json()
  },

  async getUserInfo() {
    const response = await fetch(`${API_URL}/info`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })
    return response.json()
  },
}
