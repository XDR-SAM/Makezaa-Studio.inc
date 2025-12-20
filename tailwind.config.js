/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6", // Professional blue
        secondary: "#10B981", // Growth green
        accent: "#8B5CF6", // Purple accent
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        makezaa: {
          primary: "#3B82F6",
          secondary: "#10B981",
          accent: "#8B5CF6",
          neutral: "#1F2937",
          "base-100": "#FFFFFF",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
    ],
  },
};
