import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#101414",
        navy: "#0b1722",
        forest: "#153b2f",
        moss: "#2f6f58",
        leaf: "#63b88f",
        teal: "#2ea8a1",
        cyan: "#78d6d0",
        paper: "#fbfaf5",
        canvas: "#f6f4ee",
        sand: "#e7d8ba",
        line: "#d8d5c8",
        muted: "#6b7470",
        amber: "#e3a43b",
        coral: "#d95d59",
      },
      boxShadow: {
        panel: "0 18px 44px rgba(11, 23, 34, 0.08)",
        deep: "0 28px 70px rgba(4, 15, 22, 0.22)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
