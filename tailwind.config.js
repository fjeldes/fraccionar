const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // for next-themes
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--skin-font-sans)", ...defaultTheme.fontFamily.sans],
      },
    },
    colors: {
      'primary': '#F59E0B',
      'secondary': '#111827',
      'bgContainer': '#F8FAFC'
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
