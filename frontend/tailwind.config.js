/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1EA478',
          light: '#1FA645',
          dark: '#114D0D',
        },
        gold: {
          DEFAULT: '#BF8B28',
          light: '#FEFBA4',
          soft: '#FDEF72',
          pale: '#FEFDC3',
          dark: '#A67723',
        },
        yellow: {
          light: '#F8EE0A',
          soft: '#FFF742',
          dark: '#DFB605',
        },
        brown: {
          DEFAULT: '#B35214',
          dark: '#431C03',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #1EA478, #114D0D)',
        'gold-gradient': 'linear-gradient(135deg, #BF8B28, #FEFBA4, #A67723)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
