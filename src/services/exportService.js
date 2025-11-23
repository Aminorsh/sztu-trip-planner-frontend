// 导出接口

import apiClient from './apiClient'

export function exportTrip(tripId, options) {
  return apiClient.post(`/trips/${tripId}/export`, options)
}
