/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        cream: "#FCF9F2",
        cardborder: "#EBE3D5",
        amberbrand: "#F59E0B",
        amberdeep: "#D97706",
        skybrand: "#0284C7",
      },
      boxShadow: {
        warm: "0 4px 24px -6px rgba(180, 140, 60, 0.15), 0 2px 8px -2px rgba(60, 40, 10, 0.06)",
        "warm-lg": "0 12px 40px -10px rgba(180, 140, 60, 0.22), 0 4px 12px -4px rgba(60, 40, 10, 0.08)",
      },
    },
  },
  plugins: [],
};
