/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },
        surface: {
          50:  '#F8FAFF',
          100: '#F1F5FD',
          200: '#E8EDF7',
          800: '#141B2D',
          900: '#0B1120',
          950: '#060A14',
        },
      },
      animation: {
        'slide-right': 'slideRight 0.35s cubic-bezier(.4,0,.2,1)',
        'slide-up':    'slideUp 0.25s cubic-bezier(.4,0,.2,1)',
        'fade-in':     'fadeIn 0.2s ease-out',
        'scale-in':    'scaleIn 0.2s ease-out',
        'typing-1':    'typingDot 1.4s ease-in-out infinite',
        'typing-2':    'typingDot 1.4s ease-in-out 0.2s infinite',
        'typing-3':    'typingDot 1.4s ease-in-out 0.4s infinite',
        'glow':        'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        slideRight: {
          '0%':   { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)',    opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        typingDot: {
          '0%, 80%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '40%':           { opacity: '1',   transform: 'scale(1)' },
        },
        glow: {
          '0%':   { boxShadow: '0 0 5px rgba(99,102,241,0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(99,102,241,0.6)' },
        },
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(99,102,241,0.25)',
        'glow-md': '0 0 20px rgba(99,102,241,0.35)',
        'glow-lg': '0 0 30px rgba(99,102,241,0.45)',
      },
    },
  },
  plugins: [],
};
