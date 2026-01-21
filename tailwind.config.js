/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#011627',
        'off-blue': '#041E34',
        indigo: '#2c3e50',
        'logo-blue': '#20a4f3',
        'logo-red': '#ff3366',
        'logo-white': '#f6f7f8',
        'text-dark': '#ebebeba3'
      }
    }
  },
  plugins: []
}
