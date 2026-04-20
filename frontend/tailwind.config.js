// Force tailwind reload
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'om-bg': '#050505',
        'om-primary': '#ff2b2b',
        'om-secondary': '#8b0000',
        'om-text': '#e6e6e6',
        'om-removed': '#8b0000',
        'om-added': '#006400',
        'om-schema': '#ff2b2b',
        'om-lineage': '#ff2b2b',
      },
      fontFamily: {
        sans: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Courier New', 'monospace'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 10px rgba(255, 43, 43, 0.3)',
        'glow-strong': '0 0 20px rgba(255, 43, 43, 0.6)',
      }
    },
  },
  plugins: [],
}
