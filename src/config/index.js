export const config = {
  USE_MOCK: true, // true: 使用Mock数据，false: 调用真实API
  
  API_BASE_URL: process.env.VUE_APP_API_BASE_URL || '/api',
  
  MOCK_DELAY: 200,
};