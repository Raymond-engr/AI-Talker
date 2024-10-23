/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#1A1A1A',
          800: '#2A2A2A',
          700: '#3A3A3A',
        },
      },
    },
  },
  plugins: [],
};

