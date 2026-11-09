/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        seismo: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#10b981', // emerald accent
          600: '#059669', // emerald primary
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e5ebe5',
          200: '#cbd7cb',
          300: '#a7bda7',
          400: '#84a184',
          500: '#648564',
          600: '#4e6b4e',
          700: '#3f563f',
          800: '#344534',
          900: '#2c392c',
        },
        mint: {
          50: '#effaf6',
          100: '#d7f2e8',
          200: '#b2e5d4',
          300: '#7fd2ba',
          400: '#47b69b',
          500: '#2b9a80',
          600: '#1f7b67',
          700: '#1c6253',
          800: '#194f44',
          900: '#17423a',
        },
        earth: {
          dark: '#0a0f0d',
          surface: '#111915',
          card: '#16221c',
          border: '#23382d',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 2s linear infinite',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}

