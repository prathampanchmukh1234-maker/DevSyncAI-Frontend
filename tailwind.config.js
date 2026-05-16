/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // IBM Blue color palette
        'ibm-blue': {
          50: '#e8f4ff',
          100: '#d0e8ff',
          200: '#a6d5ff',
          300: '#78b9ff',
          400: '#4a9eff',
          500: '#0F62FE', // Primary IBM Blue
          600: '#0353e9',
          700: '#0043ce',
          800: '#002d9c',
          900: '#001d6c',
        },
        // Dark mode background colors
        'dark': {
          50: '#f5f7fa',
          100: '#e4e7eb',
          200: '#cbd2d9',
          300: '#9aa5b1',
          400: '#7b8794',
          500: '#616e7c',
          600: '#52606d',
          700: '#3e4c59',
          800: '#323f4b',
          900: '#1f2933', // Primary dark background
          950: '#161e27', // Darker background
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(15, 98, 254, 0.3)',
        'glow-blue-lg': '0 0 40px rgba(15, 98, 254, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}

// Made with Bob
