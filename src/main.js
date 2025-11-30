import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/assets/styles/global.css'

// 1. 创建实例
const app = createApp(App)

// 2. 注册所有图标（必须在 mount 之前）
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 3. 安装插件
app.use(createPinia())
app.use(router)
app.use(ElementPlus)

// 4. 挂载
app.mount('#app')

