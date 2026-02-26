import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // Polyfill process.env for libraries that rely on it
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.PUBLIC_URL': JSON.stringify(''),
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
  },
})
