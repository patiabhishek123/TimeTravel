/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'om-removed': '#ef4444', // Red
        'om-added': '#10b981',   // Green
        'om-schema': '#f59e0b',  // Yellow
        'om-lineage': '#3b82f6', // Blue
      }
    },
  },
  plugins: [],
}
