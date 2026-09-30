/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        'background-light': '#0B0B0B',
        card: '#101010',
        'card-light': '#151515',
        primary: {
          DEFAULT: '#FFD400',
          hover: '#FFC400',
          light: '#FFEA00',
        },
        text: {
          DEFAULT: '#FFFFFF',
          secondary: '#A3A3A3',
        },
        success: '#22c55e',
        warning: '#f59e0b',
        critical: '#ef4444',
        border: '#262626'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
