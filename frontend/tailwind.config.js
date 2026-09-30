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
        primary: {
          DEFAULT: '#2563EB',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        deepBlue: '#0F172A',
        appBg: '#F7FAFF',
        cardBg: '#FFFFFF',
        lightBlue: '#EFF6FF',
        purple: {
          DEFAULT: '#6366F1',
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4F46E5',
        },
        cyan: {
          DEFAULT: '#06B6D4',
          50: '#ECFEFF',
          100: '#CFFAFE',
          500: '#06B6D4',
          600: '#0891B2',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        textPrimary: '#0F172A',
        textSecondary: '#64748B',
        borderLight: '#E2E8F0',
        gov: {
          navy: '#0f172a',
          slate: '#334155',
          lightBg: '#F7FAFF',
          lightCard: '#ffffff',
          lightBorder: '#e2e8f0',
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 25px -3px rgba(37, 99, 235, 0.08), 0 4px 6px -4px rgba(37, 99, 235, 0.04)',
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
      },
      borderRadius: {
        'card': '16px',
      }
    },
  },
  plugins: [],
}
