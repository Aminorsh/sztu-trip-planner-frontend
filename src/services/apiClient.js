// axios / fetch 的通用封装
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,   // 后端 API 前缀
  timeout: 6000000
})

// 请求拦截器：如果有 token，就在请求头里加上 Authorization
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token')  // 或 store.state
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  console.log('请求配置:', config)
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器（可用于处理全局错误 /token 失效等）
apiClient.interceptors.response.use(response => {
  return response.data // 假设后端响应结构为 { data: ... }
}, error => {
  if (error.response && error.response.status === 401) {
    // token 可能过期，清除登录状态
    localStorage.removeItem('token')
    // 可跳转到登录页：例如 router.push('/login')
  }
  // 可做通用错误处理
  return Promise.reject(error)
})

export default apiClient
