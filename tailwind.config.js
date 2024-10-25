/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "infinite-scroll": "infinite-scroll 25s linear infinite",
      },
      keyframes: {
        "infinite-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
      },
    },
    daisyui: {
      themes: ["light", "dark", "cupcake"],
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [
    require("@tailwindcss/forms"),
    require("daisyui"),
    require("@tailwindcss/line-clamp"),
  ],
};
