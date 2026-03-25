// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.js']
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 8080, // mismo puerto que usaba Vue CLI
    open: true,
    proxy: {
      // Si tu backend está en otro puerto
      '/api': {
        target: 'http://localhost:3000', // ajusta según tu backend
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia') || id.includes('axios')) {
              return 'vendor';
            }
            if (id.includes('bootstrap') || id.includes('@popperjs')) {
              return 'bootstrap';
            }
          }
        }
      }
    }
  }
})
