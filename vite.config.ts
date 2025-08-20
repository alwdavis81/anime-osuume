import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://github.com/alwdavis81/anime-osuume', // <--- REPLACE THIS WITH YOUR REPOSITORY NAME
  plugins: [react()],
})