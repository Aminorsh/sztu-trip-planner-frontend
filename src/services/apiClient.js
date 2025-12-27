import axios from 'axios'
import router from '../router'

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 30000, // 30秒超时
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// 请求拦截器
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  response => {
    // 直接返回数据部分
    return response.data
  },
  error => {
    const { response } = error
    
    // 处理未授权错误
    if (response && response.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
    }
    
    // 处理其他错误
    if (response) {
      // 服务器返回的错误信息
      const backendError = response.data?.error
      const backendMessage = backendError?.message || response.data?.message
      const backendCode = backendError?.code
      const errorMessage = backendCode ? `[${backendCode}] ${backendMessage || '请求失败，请稍后重试'}` : (backendMessage || '请求失败，请稍后重试')
      return Promise.reject(new Error(errorMessage))
    } else {
      // 请求未发出或未收到响应
      return Promise.reject(new Error('网络错误，请检查您的网络连接'))
    }
  }
)

export default apiClient
