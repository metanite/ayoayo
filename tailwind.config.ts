import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#222222",
        forest: "#19332f",
        lime: "#d9f99d",
        paper: "#ffffff",
        cloud: "#f3f4f2",
        coral: "#ff5a5f",
      },
      boxShadow: { soft: "0 10px 30px rgba(34, 34, 34, 0.08)" },
    },
  },
  plugins: [],
};

export default config;
