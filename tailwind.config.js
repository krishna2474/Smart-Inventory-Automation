/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bebas: ['"Bebas Neue"', "cursive"],
        nunito: ["Nunito", "sans-serif"],
      },
      colors: {
        customPurple: "#8E44AD",
        primaryWhite: "#F1FAEE",
        primaryBlack: "#121212",
      },
    },
  },
  plugins: [],
};
