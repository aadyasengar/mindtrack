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
        brand: {
          50: '#f8f9fc',
          100: '#f1f3f9',
          200: '#e2e7f2',
          300: '#c5cee2',
          400: '#a8b5d2',
          500: '#8c9dbf', // Muted Blue-Gray
          600: '#7171a6', // Muted Lavender-Blue
          700: '#5a5a8a',
          800: '#48486e',
          900: '#3c3c5c',
        },
        soft: {
          lavender: '#E6E6FA',
          sky: '#F0F8FF',
          mint: '#F5FFFA',
          peach: '#FFF5EE',
          cream: '#FAF9F6',
          gray: '#F5F7F9',
        }
      },
      fontFamily: {
        sans: ['"Outfit"', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
        'medium': '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
