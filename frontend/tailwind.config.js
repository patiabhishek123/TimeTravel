/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vercel-bg': '#0A0A0A',
        'vercel-panel': '#111111',
        'vercel-border': '#27272A',
        'vercel-text': '#EDEDED',
        'vercel-muted': '#A1A1AA',
        'status-added': '#10B981',
        'status-added-bg': 'rgba(16, 185, 129, 0.15)',
        'status-removed': '#EF4444',
        'status-removed-bg': 'rgba(239, 68, 68, 0.15)',
        'status-changed': '#F59E0B',
        'status-changed-bg': 'rgba(245, 158, 11, 0.15)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Menlo', 'Monaco', 'Consolas', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
