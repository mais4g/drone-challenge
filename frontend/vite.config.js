import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    proxy: {
      // Redireciona qualquer requisição que comece com /api para o backend
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})