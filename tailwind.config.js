/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontSize: {
        xs: '0.875rem', // 14px (improved from 12px)
        sm: '1rem', // 16px (improved from 14px)
        base: '1.125rem', // 18px (improved from 16px)
        lg: '1.25rem', // 20px (unchanged)
        xl: '1.5rem', // 24px (unchanged)
        '2xl': '1.875rem', // 30px (unchanged)
        '3xl': '2.25rem', // 36px (unchanged)
        '4xl': '3rem', // 48px (unchanged)
        '5xl': '3.75rem', // 60px (unchanged)
        '6xl': '4.5rem', // 72px (unchanged)
        '7xl': '6rem', // 96px (unchanged)
        '8xl': '8rem', // 128px (unchanged)
        '9xl': '10rem', // 160px (unchanged)
      },
      colors: {
        // Blue (Primary Brand Colors - Mandatory)
        'blue-100': '#00A8E1', // Primary blue
        'blue-75': '#40BDE7', // Calculated intermediate
        'blue-55': '#73CFEF', // Light blue
        'blue-40': '#99DCF3', // Lighter blue
        'blue-25': '#BFE9F8', // Very light blue
        'blue-10': '#E5F6FC', // Lightest blue

        // Green (Success, Positive)
        'green-100': '#00C375', // Primary green
        'green-75': '#40D195', // Calculated intermediate
        'green-55': '#73DEB3', // Light green
        'green-40': '#99E6C8', // Calculated intermediate
        'green-25': '#BFF0DD', // Very light green
        'green-10': '#E5F9F1', // Lightest green

        // Yellow (Warning, Attention)
        'yellow-100': '#FFCB00', // Primary yellow
        'yellow-75': '#FFD640', // Calculated intermediate
        'yellow-55': '#FFE273', // Light yellow
        'yellow-40': '#FFED99', // Calculated intermediate
        'yellow-25': '#FFF2BF', // Very light yellow
        'yellow-10': '#FFFAE5', // Lightest yellow

        // Pink (Error, Critical)
        'pink-100': '#F05283', // Primary pink
        'pink-75': '#F375A0', // Calculated intermediate
        'pink-55': '#F7A0BB', // Light pink
        'pink-40': '#F9BDD0', // Calculated intermediate
        'pink-25': '#FBD4E0', // Very light pink
        'pink-10': '#FEEEF3', // Lightest pink
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        safe: 'env(safe-area-inset-bottom)',
      },
      screens: {
        xs: '375px',
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
