import type { Config } from "tailwindcss";
import { colors, spacing, fontSize, fontFamily, borderRadius } from "./styles/tokens";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors,
      spacing,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fontSize: fontSize as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fontFamily: fontFamily as any,
      borderRadius,
    },
  },
  plugins: [],
};

export default config;
