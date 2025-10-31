import apiClient from './apiClient'

export default {
  getTrips() {
    return apiClient.get('/trips').then(res => res.data)
  },
  getTripById(tripId) {
    return apiClient.get(`/trips/${tripId}`).then(res => res.data)
  },
  addTripItem(tripId, data) {
    return apiClient.post(`/trips/${tripId}/items`, data).then(res => res.data)
  },
  // ... 其他行程相关接口
}
