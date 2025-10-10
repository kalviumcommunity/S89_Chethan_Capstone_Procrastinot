import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://s89-chethan-capstone-procrastinot-1.onrender.com',
        changeOrigin: true,
        secure: true,
        timeout: 30000,
        proxyTimeout: 30000,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err.message);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to:', proxyReq.path);
          });
        }
      }
    }
  }
})
