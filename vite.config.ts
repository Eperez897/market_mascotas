import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
<<<<<<< HEAD
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
=======
>>>>>>> origin/main
  preview: {
    allowedHosts: [
      'market-mascotas-sfs5.onrender.com'
    ]
  }
})
