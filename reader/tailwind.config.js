/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    themes: [
      {
        vuk: {
          "primary": "#8250d2",
          "secondary": "#f5deb3",
          "accent": "#9C27B0",
          "neutral": "#ffffff",
          "base-100": "#ffffff",
          "info": "#ffffff",
          "success": "#00ffff",
          "warning": "#ffffff",
          "error": "#ffffff",
        },
      },
      "light",
      "night",
    ],
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,vue}",
  ],
  plugins: [
    require("daisyui"),
  ],
};
