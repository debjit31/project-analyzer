import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Forward all /api/* requests to the FastAPI backend in dev
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        // Remove VITE_API_URL from axios — this proxy handles it
      },
    },
  },
})
