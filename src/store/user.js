import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,  // 存当前用户信息，如 id / name /avatar
    token: null
  }),
  actions: {
    setUser(data) {
      this.userInfo = data.user
      this.token = data.token
    },
    clearUser() {
      this.userInfo = null
      this.token = null
    }
  }
})


// 每个 defineStore 定义一个模块（store 名称）
//
// state：定义这个模块要管理的数据
//
// actions：定义可以修改这些状态的方法
//
// 组件 /页面通过 useUserStore() / useTripStore() 来使用这些 store