import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      '@proto': resolve(__dirname, '../proto/dist/js')
    }
  },
  define: {
    global: 'globalThis',
  },
  build: {
    commonjsOptions: {
      include: [/proto\/dist\/js/, /node_modules/]
    }
  },
  optimizeDeps: {
    include: ['grpc-web', 'google-protobuf'],
    exclude: ['@proto/*']
  }
})
