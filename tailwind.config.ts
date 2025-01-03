import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        golos: ['var(--golos-font)'],
        inter: ['var(--inter-font)'],
      },
      colors: {
        background: "rgb(var(--background))",
        foreground: "var(--foreground)",
        primary: "rgb(var(--primary))",
        lighter: "rgb(var(--lighter))",
        secondary: "rgb(var(--secondary))",
        txtprimary: "var(--primary-text)",
        txtsecondary: "var(--secondary-text)",
        myteal: "var(--myteal)",
      },

    },
  },
  plugins: [],
} satisfies Config;
