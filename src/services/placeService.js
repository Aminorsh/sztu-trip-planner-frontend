import apiClient from './apiClient'

/**
 * 搜索地点
 * @param {Object} params 搜索参数
 * @param {string} params.keyword - 搜索关键词
 * @param {string} [params.city] - 城市名称
 * @param {number} [params.page=1] - 页码
 * @param {number} [params.page_size=10] - 每页数量
 * @returns {Promise} 包含地点列表的Promise
 */
export function searchPlaces(params) {
  // 确保必填参数存在
  if (!params.keyword) {
    return Promise.reject(new Error('搜索关键词不能为空'))
  }
  
  // 设置默认分页参数
  const defaultParams = {
    page: 1,
    page_size: 10,
    ...params
  }
  
  return apiClient.get('/v2/places/search', { 
    params: defaultParams 
  })
}

/**
 * 获取地点详情
 * @param {string} placeId 地点ID
 * @returns {Promise} 包含地点详情的Promise
 */
export function getPlaceDetail(placeId) {
  if (!placeId) {
    return Promise.reject(new Error('地点ID不能为空'))
  }
  return apiClient.get(`/v2/places/${placeId}/detail`)
}

/**
 * 获取地点的AI描述
 * @param {string} placeId 地点ID
 * @returns {Promise} 包含AI描述的Promise
 */
export function getPlaceAiDescription(placeId) {
  if (!placeId) {
    return Promise.reject(new Error('地点ID不能为空'))
  }
  return apiClient.post(`/v2/places/${placeId}/ai-description`)
}

/**
 * 将地点添加到行程
 * @param {string} tripId 行程ID
 * @param {Object} placeData 地点数据
 * @param {string} placeData.placeId 地点ID
 * @param {string} placeData.name 地点名称
 * @param {number} placeData.latitude 纬度
 * @param {number} placeData.longitude 经度
 * @param {string} [placeData.address] 地址
 * @param {string} [placeData.photoUrl] 照片URL
 * @returns {Promise} 添加结果
 */
export function addPlaceToTrip(tripId, placeData) {
  if (!tripId) {
    return Promise.reject(new Error('行程ID不能为空'))
  }
  if (!placeData || !placeData.placeId) {
    return Promise.reject(new Error('地点信息不完整'))
  }
  
  return apiClient.post(`/v2/trips/${tripId}/places`, placeData)
}

/**
 * 按关键词搜索地点（便捷方法）
 * @param {string} keyword 搜索关键词
 * @param {Object} [options={}] 其他选项
 * @param {string} [options.city] 城市名称
 * @param {number} [options.page=1] 页码
 * @param {number} [options.pageSize=10] 每页数量
 * @returns {Promise} 包含地点列表的Promise
 */
export function searchPlacesByKeyword(keyword, options = {}) {
  if (!keyword) {
    return Promise.reject(new Error('搜索关键词不能为空'))
  }
  
  return searchPlaces({
    keyword,
    city: options.city,
    page: options.page,
    page_size: options.pageSize || 10
  })
}
