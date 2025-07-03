/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        fiap: {
          primary: "#F23064",
          secondary: "#BF3B5E",
          gray: "#8C8C8C",
          black: "#000000",
        },
      },
    },
  },
  plugins: [],
};
