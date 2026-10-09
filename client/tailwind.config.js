/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wadii: {
          50: "#fdf8f4",
          100: "#fcf0e7",
          200: "#f8decb",
          300: "#f3c3a4",
          400: "#eb9a6e",
          500: "#e3743c",
          600: "#d45827",
          700: "#b1421e",
          800: "#8e361e",
          900: "#742e1d",
          950: "#3f140c",
        },
        gold: {
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
        }
      },
      fontFamily: {
        sans: [
          "Outfit",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
}
