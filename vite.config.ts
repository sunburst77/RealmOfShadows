import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: '.', // 명시적으로 루트 디렉토리 지정
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  // Server configuration
  server: {
    watch: {
      // Adobe 프로그램 관련 디렉토리 감시 제외
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/AppData/Roaming/com.adobe.dunamis/**',
        '**/AppData/Roaming/Adobe/**',
      ],
      usePolling: true, // 파일 시스템 폴링 사용
    },
  },
})
