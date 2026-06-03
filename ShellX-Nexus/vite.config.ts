import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3005,
    proxy: {
      '/api': {
        target: 'http://18.232.76.157:8080',
        changeOrigin: true,
      },
      '/audit': {
        target: 'http://18.232.76.157:8080',
        ws: true,
        changeOrigin: true,
      },
      '/mirror': {
        target: 'http://18.232.76.157:8080',
        ws: true,
        changeOrigin: true,
      },
    }
  }
})
