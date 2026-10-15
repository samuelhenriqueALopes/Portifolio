import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // O three.js (cena 3D do Modo Galo) fica num arquivo próprio de ~570 kB,
    // baixado só quando alguém liga o modo. O site principal continua leve.
    chunkSizeWarningLimit: 700,
  },
})
