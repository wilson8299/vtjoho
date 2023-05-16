/** @type {import('tailwindcss').Config} */

module.exports = {
  mode: "jit",
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    container: {
      padding: {
        DEFAULT: "0.5rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        primary: "#32A2EC",
        light: {
          100: "#FFFFFF",
          200: "#F2F3F5",
          300: "#EBEDEF",
          400: "#E3E5E8",
        },
        dark: {
          100: "#36393F",
          200: "#2F3136",
          300: "#292B2F",
          400: "#202225",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
