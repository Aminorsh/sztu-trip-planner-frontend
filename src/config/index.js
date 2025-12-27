export const config = {
  USE_MOCK: true, // true: 使用Mock数据，false: 调用真实API
  
  API_BASE_URL: process.env.VUE_APP_API_BASE_URL || '/api',
  
  MOCK_DELAY: 200,
};

// API 基础配置
export const API_CONFIG = {
  // API 基础 URL，会被 .env 文件中的 VITE_API_BASE_URL 覆盖
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  
  // 请求超时时间（毫秒）
  TIMEOUT: 30000,
  
  // 默认分页大小
  DEFAULT_PAGE_SIZE: 10,
  
  // 地图相关配置
  MAP: {
    // 默认城市
    DEFAULT_CITY: '广州',
    // 默认坐标（广州塔）
    DEFAULT_LOCATION: {
      latitude: 23.106680,
      longitude: 113.324520
    },
    // 地图缩放级别
    ZOOM_LEVEL: 15
  },
  
  // 本地存储的键名
  STORAGE_KEYS: {
    TOKEN: 'token',
    USER_INFO: 'user_info',
    SEARCH_HISTORY: 'search_history',
    RECENT_TRIPS: 'recent_trips'
  }
}

// 导出默认配置
export default {
  ...API_CONFIG
}