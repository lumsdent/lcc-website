/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'false'
  content: [],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#011627',
        indigo: '#2c3e50',
        'logo-blue': '#20a4f3',
        'logo-red': '#ff3366',
        'logo-white': '#f6f7f8'
      }
    }
  },
  plugins: []
}
