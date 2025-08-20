import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/anime-osuume/', // Corrected base for GitHub Pages
  plugins: [react()],
})