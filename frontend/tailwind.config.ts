import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#181b3a",
        foreground: "#f6f6f6",
        cream: "#f8eee7",
        "cream-foreground": "#3a2d2d",
        gold: "#d8b26e",
        rose: "#c98fa2",
        plum: "#2c1e3a",
        wine: "#3d1e2a",
      },
      fontFamily: {
        body: ["Inter", "sans-serif"],
        headings: ["PT Serif", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
