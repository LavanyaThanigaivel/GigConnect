import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ CORRECT - Fixed syntax
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})