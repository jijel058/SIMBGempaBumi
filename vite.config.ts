/**
 * FILE: vite.config.ts
 * FUNGSI: Konfigurasi server pengembangan lokal (Vite) dan pengaturan bundling produksi.
 * ISI:
 * - Menjalankan server pengembangan di port 5173.
 * - Menyediakan proxy '/api/bmkg' ke https://data.bmkg.go.id dan '/api/usgs' ke https://earthquake.usgs.gov
 *   untuk menghindari pemblokiran CORS oleh browser.
 * - Memisahkan bundle library besar (Three.js, Leaflet, jsPDF) menjadi chunk terpisah agar halaman dimuat cepat.
 */
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
