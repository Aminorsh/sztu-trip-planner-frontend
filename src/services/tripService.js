// 封装行程模块的常见接口，具体参数 / 返回值需根据后端更新。
import apiClient from './apiClient'

export function fetchTrips() {
  return apiClient.get('/trips')
}

export function fetchTripDetail(tripId) {
  return apiClient.get(`/trips/${tripId}`)
}

export function createTrip(tripData) {
  return apiClient.post('/trips', tripData)
}

export function updateTrip(tripId, tripData) {
  return apiClient.put(`/trips/${tripId}`, tripData)
}

export function deleteTrip(tripId) {
  return apiClient.delete(`/trips/${tripId}`)
}