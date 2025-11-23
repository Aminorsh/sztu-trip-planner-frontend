// 封装地点模块接口，待更新

import apiClient from './apiClient'

export function searchPlaces(params) {
  return apiClient.get('/places/search', { params })
}

export function getPlaceDetail(placeId) {
  return apiClient.get(`/places/${placeId}`)
}

export function addPlaceToTrip(tripId, placeData) {
  return apiClient.post(`/trips/${tripId}/places`, placeData)
}
