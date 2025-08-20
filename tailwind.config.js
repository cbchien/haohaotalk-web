/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
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
    },
  },
  plugins: [],
}
