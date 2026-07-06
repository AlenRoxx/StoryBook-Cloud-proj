/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        midnight: '#0b0a1f',
        royal: '#3a1c71',
        magenta: '#d76d77',
      },
      keyframes: {
        meshDrift: {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1)' },
          '33%': { transform: 'translate(5%, -8%) scale(1.1)' },
          '66%': { transform: 'translate(-6%, 6%) scale(0.95)' },
        },
        meshDriftReverse: {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1.05)' },
          '33%': { transform: 'translate(-8%, 5%) scale(0.9)' },
          '66%': { transform: 'translate(6%, -5%) scale(1.1)' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0px) rotate(-3deg)' },
          '50%': { transform: 'translateY(-18px) rotate(3deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.06)' },
        },
        sparkle: {
          '0%, 100%': { opacity: 0, transform: 'scale(0.4)' },
          '50%': { opacity: 1, transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: 1, transform: 'scale(1)' },
          '100%': { opacity: 0, transform: 'scale(0.96)' },
        },
        bookOpen: {
          '0%': { opacity: 0, transform: 'perspective(1200px) rotateY(-14deg) scale(0.96)' },
          '100%': { opacity: 1, transform: 'perspective(1200px) rotateY(0deg) scale(1)' },
        },
        pageSlideIn: {
          '0%': { opacity: 0, transform: 'translateX(24px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        pageSlideOut: {
          '0%': { opacity: 1, transform: 'translateX(0)' },
          '100%': { opacity: 0, transform: 'translateX(-24px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        meshDrift: 'meshDrift 22s ease-in-out infinite',
        meshDriftReverse: 'meshDriftReverse 26s ease-in-out infinite',
        floatY: 'floatY 4s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
        sparkle: 'sparkle 1.8s ease-in-out infinite',
        fadeIn: 'fadeIn 0.6s ease-out forwards',
        fadeOut: 'fadeOut 0.5s ease-in forwards',
        bookOpen: 'bookOpen 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        pageSlideIn: 'pageSlideIn 0.4s ease-out forwards',
        pageSlideOut: 'pageSlideOut 0.3s ease-in forwards',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
};
