/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lime-yellow': '#E8F5C8',
        'light-orange': '#FFF4E6',
      }
    },
  },
  plugins: [],
}
