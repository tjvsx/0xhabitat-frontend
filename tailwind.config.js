/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: theme => ({
        'deposit': "url(../node_modules/heroicons/src/outline/arrow-circle-down.svg)",
        'withdraw': "url(../node_modules/heroicons/src/outline/arrow-circle-up.svg)",
      }),
    },
  },
  colors: {
    primary: "var(--habitat-primary)",
    secondary: "var(--habitat-secondary)",
    accent: "var(--habitat-accent)",
  },
  plugins: [],
}
