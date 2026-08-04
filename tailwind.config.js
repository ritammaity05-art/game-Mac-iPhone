/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        studio: {
          bg: '#080a0f',
          surface: '#11141d',
          surfaceLight: '#1a1f2c',
          border: '#2a3142',
          active: '#3b445c',
        },
        synth: {
          cyan: '#06b6d4',
          purple: '#8b5cf6',
          pink: '#ec4899',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'key-press': 'keyPress 0.15s ease-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.6, filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.4))' },
          '50%': { opacity: 1, filter: 'drop-shadow(0 0 16px rgba(6, 182, 212, 0.8))' },
        },
        keyPress: {
          '0%': { transform: 'scale(1)', opacity: 0.9 },
          '50%': { transform: 'scale(0.98) translateY(2px)' },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
