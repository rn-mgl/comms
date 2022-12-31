/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        body: ['"Open Sans"', '"Sans serif"'],
        head: ["Montserrat", '"Sans serif"'],
      },
      colors: {
        blk: "#0D0000",
        blk1: "#252526",
        blk2: "#292B2E",
        wht: " #F2F2F2",
        gr1: "#D9D9D9",
        gr2: "#595959",
        gr3: "#262223",
        gr4: "#3E403F",
      },
      screens: {
        "m-s": "320px",
        "m-m": "375px",
        "m-l": "425px",
        t: "768px",
        "l-s": "1024px",
        "l-l": "1440px",
      },
      keyframes: {
        loading: {
          "0%": { transform: "translate(-50vw, 2rem)" },
          "100%": { transform: "translate(50vw, 2rem)" },
        },
      },
      animation: {
        loading: "loading 1s ease-in-out alternate infinite",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
