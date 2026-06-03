/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#3b82f6',
          green: '#22c55e',
          orange: '#f97316',
          purple: '#a855f7',
          yellow: '#eab308'
        }
      }
    },
  },
  plugins: [],
}
