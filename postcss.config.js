/**
 * FILE: postcss.config.js
 * FUNGSI: Konfigurasi PostCSS untuk memproses class Tailwind CSS dan menambahkan prefix CSS otomatis (autoprefixer)
 * agar kompatibel di berbagai browser modern.
 */
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

