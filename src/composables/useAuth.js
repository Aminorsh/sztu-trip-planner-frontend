// 封装登录 / 登出 /注册 / token 存取逻辑

// src/composables/useAuth.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as authService from '@/services/authService'

// 定义一个 Pinia store 来管理认证状态
export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(null) // 如果后端返回 user info，可以存到这里

  // 计算属性：是否已登录
  const isLoggedIn = computed(() => {
    return !!token.value
  })

  // 动作：登录
  async function login(payload) {
    // payload 包含用户名 / 邮箱 + 密码
    let response
    if (payload.username && payload.username.includes('@')) {
      response = await authService.loginEmail({
        email: payload.username,
        password: payload.password
      })
    } else {
      response = await authService.login({
        username: payload.username,
        password: payload.password
      })
    }

    // 后端应返回 token（以及可选用户信息）
    // const t = response.token
    // token.value = t
    // localStorage.setItem('token', t)

    const t =
      response.token ||
      response.data?.token ||
      response.data?.access_token

    if (!t) {
      console.error('登录成功但未拿到 token，完整响应是：', response)
      throw new Error('后端未返回 token')
    }

    token.value = t
    localStorage.setItem('token', t)


    // 如果返回 user 信息，也存起来
    if (response.user) {
      user.value = response.user
    }

    return response
  }

  // 动作：注册
  async function register(payload) {
    // payload 示例：{ email, username, password, code, display_name }
    const result = await authService.register(payload)
    const t = result.token
    token.value = t
    localStorage.setItem('token', t)

    if (result.user) {
      user.value = result.user
    }

    return result
  }

  // 动作：登出
  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
  }

  return {
    token,
    user,
    isLoggedIn,
    login,
    register,
    logout
  }
})

// 下面是一个组合式 composable，方便在组件里使用 auth 逻辑
export function useAuth() {
  const authStore = useAuthStore()

  // 登录方法

  async function doLogin(username, password) {
    try {
      const resp = await authStore.login({ username, password })
      return resp
    } catch (err) {
      // 把后端返回的 message 直接提示给用户
      ElMessage.error(err.response?.data?.message || err.message)
      throw err   // 继续抛，让调用方知道登录失败
    }
  }
  // async function doLogin(username, password) {
  // const resp = await authStore.login({ username, password })
  // return resp
  // }

  // 注册方法
  async function doRegister(email, username, password, code, display_name) {
    const resp = await authStore.register({
      email,
      username,
      password,
      code,
      display_name
    })
    return resp
  }

  // 登出
  function doLogout() {
    authStore.logout()
  }

  // 状态：是否登录
  const isLoggedIn = computed(() => authStore.isLoggedIn)

  // Token（如果需要在组件里查看）
  const token = computed(() => authStore.token)

  return {
    doLogin,
    doRegister,
    doLogout,
    isLoggedIn,
    token,
    user: computed(() => authStore.user)
  }
}
