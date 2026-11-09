import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/bmkg': {
        target: 'https://data.bmkg.go.id',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bmkg/, ''),
        secure: false,
      },
      '/api/usgs': {
        target: 'https://earthquake.usgs.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/usgs/, ''),
        secure: false,
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three'],
          'leaflet-vendor': ['leaflet'],
          'jspdf-vendor': ['jspdf']
        }
      }
    }
  }
});
