/* eslint-env node */
const typography = require("@tailwindcss/typography");
const daisyui = require("daisyui");

module.exports = {
  content: ["./src/**/*.{vue,js}"],
  plugins: [typography, daisyui],
  daisyui: {
    themes: ["emerald"],
  },
};
