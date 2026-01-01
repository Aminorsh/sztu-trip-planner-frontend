// apiClient.js 中需要添加的接口函数
import apiClient from './apiClient'

// 创建行程 
export const createTrip = (tripData) => {
  return apiClient.post('/v3/trips', tripData)
}

// 获取行程列表 
export const getTripsList = () => {
  return apiClient.get('/v3/trips')
}

// 删除行程 
export const deleteTrip = (tripId) => {
  return apiClient.delete(`/v3/trips/${tripId}`)
}

// 更新行程 
export const updateTrip = (tripId, tripData) => {
  return apiClient.put(`/v3/trips/${tripId}`, tripData)
}

// 获取行程详情
export const getTripDetail = (tripId) => {
  return apiClient.get(`/v3/trips/${tripId}`)
}

// 添加新的一天
export const addNewDay = (tripId, day) => {
  return apiClient.post(`/v3/trips/${tripId}/days`, { day })
}

// 删除某一天
export const deleteDay = (tripId, dayId) => {
  return apiClient.delete(`/v3/trips/${tripId}/days/${dayId}`)
}

// 获取某天的所有行程项
export const getDayItems = (tripId, dayId) => {
  return apiClient.get(`/v3/trips/${tripId}/days/${dayId}/items`)
}

// 添加新的行程项
export const addNewItem = (tripId, dayId, itemData) => {
  return apiClient.post(`/v3/trips/${tripId}/days/${dayId}/items`, itemData)
}

// 更新行程项
export const updateItem = (tripId, dayId, itemId, itemData) => {
  return apiClient.put(`/v3/trips/${tripId}/days/${dayId}/items/${itemId}`, itemData)
}

// 删除行程项
export const deleteItem = (tripId, dayId, itemId) => {
  return apiClient.delete(`/v3/trips/${tripId}/days/${dayId}/items/${itemId}`)
}
