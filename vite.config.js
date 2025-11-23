import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ mode }) => {
  // 加载 .env 文件里的内容
  const env = loadEnv(mode, process.cwd(), '')

  // 从 env 里读 VITE_API_BASE_URL
  const apiBase = env.VITE_API_BASE_URL

  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    server: {
      proxy: {
        '/api': {
          target: apiBase,  // 用从 env 里读出的地址
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    define: {
      // 可选：在代码里也注入这个 base URL
      'process.env': {} // 如果你有用到 process.env，可以按需注入
    }
  }
})
