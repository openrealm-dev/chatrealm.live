import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  daisyui: {
    themes: [
      "light",
      "wireframe",
      "cmyk",
      "retro",
      "cyberpunk",
      "dim",
      "sunset",
    ],
  },
  plugins: [daisyui],
  theme: {
    extend: {},
  },
};
