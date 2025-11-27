// 提供的各种 Auth 路径封装函数
import apiClient from './apiClient'


export function sendCode(email) {
  return apiClient.post('/auth/send-code', { email })
}

export function register({ email, password, code, username, display_name }) {
  console.log('Sending registration data:', { email, password, code, username, display_name }); // 添加这行
  return apiClient.post('/auth/register', {
    email, password, code, username, display_name
  })
}

export function login({ username, password }) {
  return apiClient.post('/auth/login', {
    username, password
  })
}

export function loginEmail({ email, password }) {
  return apiClient.post('/auth/login-email', {
    email, password
  })
}

export function sendForgetCode(email) {
  return apiClient.post('/auth/send-forget-code', { email })
}

export function sendForgetCodeByUsername(username) {
  return apiClient.post('/auth/send-forget-code-by-username', { username })
}

export function verifyForgetPassword({ email, new_password, code }) {
  return apiClient.post('/auth/verify-forget-password', {
    email, new_password: new_password, code
  })
}
