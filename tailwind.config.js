/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/common/components/**/*.{js,ts,jsx,tsx}",
    "./src/common/page_components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      "primary": "#008BFF"
    },
    extend: {},
  },
  plugins: [],
}