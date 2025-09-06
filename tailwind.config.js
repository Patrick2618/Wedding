/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D4B896',
          50: '#F5F1E8',
          100: '#EDE5D3',
          200: '#E4D7BC',
          300: '#DCC9A5',
          400: '#D4B896',
          500: '#C5A47F',
          600: '#B69068',
          700: '#A67C51',
          800: '#8B7355',
          900: '#6B5A44'
        },
        secondary: {
          DEFAULT: '#F5F1E8',
          50: '#FEFCF8',
          100: '#F5F1E8',
          200: '#EDE5D3',
          300: '#E4D7BC',
          400: '#DCC9A5',
          500: '#D4B896'
        },
        accent: {
          DEFAULT: '#8B7355',
          50: '#F0EDE8',
          100: '#E1DBD1',
          200: '#D2C9BA',
          300: '#C3B7A3',
          400: '#B4A58C',
          500: '#A59375',
          600: '#96815E',
          700: '#8B7355',
          800: '#7A6449',
          900: '#69553D'
        },
        background: '#FEFCF8',
        text: {
          primary: '#2C2C2C',
          secondary: '#6B6B6B'
        }
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif']
      },
      boxShadow: {
        'elegant': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'elegant-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in',
        'slide-up': 'slideUp 0.6s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
};
