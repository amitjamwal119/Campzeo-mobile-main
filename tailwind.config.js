
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  presets: [require("nativewind/preset")], // ✅ REQUIRED: NativeWind preset
  theme: {
    extend: {},
  },
  plugins: [],
}
