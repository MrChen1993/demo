import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    reactivityTransform: true
  })],
  server:{
    proxy:{
      "/apm-aim":{
        target:"http://www.qa.apmyushu.com/api/apm/qa",
        changeOrigin: true
      }
    }
  }
})
