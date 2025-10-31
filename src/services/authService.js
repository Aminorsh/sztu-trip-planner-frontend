import apiClient from './apiClient'

export default {
  login(credentials) {
    return apiClient.post('/auth/login', credentials).then(res => res.data)
  },
  register(params) {
    return apiClient.post('/auth/register', params).then(res => res.data)
  },
  getCurrentUser() {
    return apiClient.get('/users/me').then(res => res.data)
  }
}
