import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/users': { target: 'http://localhost:3010', changeOrigin: true, rewrite: path => path.replace(/^\/api/, '') },
      '/api/products': { target: 'http://localhost:3001', changeOrigin: true, rewrite: path => path.replace(/^\/api/, '') },
      '/api/orders': { target: 'http://localhost:3002', changeOrigin: true, rewrite: path => path.replace(/^\/api/, '') },
    },
  },
});
