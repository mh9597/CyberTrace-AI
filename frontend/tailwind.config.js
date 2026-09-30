/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        gov: {
          navy: '#0f172a',
          slate: '#334155',
          lightBg: '#f8fafc',
          lightCard: '#ffffff',
          lightBorder: '#e2e8f0',
          darkBg: '#030712',
          darkCard: '#0f172a',
          darkBorder: '#1e293b',
          accent: '#0284c7',
          teal: '#0d9488',
          amber: '#d97706',
          rose: '#dc2626',
        },
        void: '#030712',
        surface: '#0b1120',
        card: '#0f172a',
        cardHover: '#1e293b',
        cyber: {
          dark: '#030712',
          surface: '#0b1120',
          card: '#0f172a',
          border: '#1e293b',
          accent: '#06b6d4',
          tactical: '#6366f1',
          emerald: '#10b981',
          danger: '#ef4444',
          warning: '#f59e0b',
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.35)',
        'glow-rose': '0 0 25px -5px rgba(239, 68, 68, 0.35)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
      }
    },
  },
  plugins: [],
}
