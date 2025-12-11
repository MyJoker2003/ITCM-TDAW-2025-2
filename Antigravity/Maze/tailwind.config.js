/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sci-fi-bg': '#0f172a', // Dark slate
        'sci-fi-accent': '#00f0ff', // Cyan neon
        'sci-fi-purple': '#bf00ff', // Purple neon
        'sci-fi-grid': '#1e293b', // Grid background
      },
      fontFamily: {
        'sci-fi': ['Orbitron', 'sans-serif'], // Access via Google Fonts later
      }
    },
  },
  plugins: [],
}
