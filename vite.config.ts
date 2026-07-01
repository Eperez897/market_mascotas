import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> d2f90cedf1ae15b6a4be2def582eb7f514bb1e43
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
<<<<<<< HEAD
=======
=======
>>>>>>> origin/main
>>>>>>> d2f90cedf1ae15b6a4be2def582eb7f514bb1e43
  preview: {
    allowedHosts: [
      'market-mascotas-sfs5.onrender.com'
    ]
  }
})
