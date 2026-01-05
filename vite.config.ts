import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // If EXT_BUILD is set, use relative paths for extension support
  base: process.env.EXT_BUILD === 'true' ? './' : '/zentab/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})
