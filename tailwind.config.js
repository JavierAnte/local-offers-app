/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.tsx',
    './src/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        'primary-light': '#DBEAFE',
        'primary-dark': '#1D4ED8',
        danger: '#DC2626',
        'danger-light': '#FEE2E2',
        success: '#16A34A',
        'success-light': '#DCFCE7',
        warning: '#D97706',
        'warning-light': '#FEF3C7',
        text: '#111827',
        'text-secondary': '#6B7280',
        muted: '#9CA3AF',
        surface: '#F9FAFB',
        border: '#E5E7EB',
      },
    },
  },
  plugins: [],
}

