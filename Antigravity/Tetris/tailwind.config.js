/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        game: {
          bg: '#111111',
          panel: '#1a1a1a',
          accent: '#646cff',
        }
      }
    },
  },
  plugins: [
    require("tailwindcss-animate")
  ],
}
