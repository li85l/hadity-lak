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
        obsidian: {
          950: "#060407",
          900: "#0B070E",
          850: "#120B17",
          800: "#1A1021",
        },
        burgundy: {
          950: "#1F0408",
          900: "#360810",
          850: "#4D0C17",
          800: "#6B101E",
          700: "#8C1527",
          600: "#B31B32",
        },
        emerald: {
          950: "#061A13",
          900: "#0C2E22",
          850: "#123D2E",
          800: "#1A4F3C",
          700: "#246B52",
        },
        navy: {
          950: "#060C17",
          900: "#0A162B",
          850: "#102242",
          800: "#18325E",
        },
        ivory: {
          50: "#FCFAF6",
          100: "#F7F3EB",
          200: "#EEE6D6",
          300: "#E3D6C0",
          400: "#CEBDA1",
        },
        rose: {
          romantic: "#F4B8C5",
          soft: "#FDE8ED",
          glow: "#FF7597",
        },
        champagne: {
          100: "#FAF4EB",
          200: "#F5EAD9",
          300: "#EEDBBF",
        },
        gold: {
          foil: "#D4AF37",
          deep: "#B8902A",
          light: "#F7E1A0",
          glow: "#DFB15B",
          border: "#C5A059",
        },
      },
      fontFamily: {
        amiri: ["var(--font-amiri)", "serif"],
        readex: ["var(--font-readex)", "sans-serif"],
        ruqaa: ["var(--font-ruqaa)", "serif"],
        alexandria: ["var(--font-alexandria)", "sans-serif"],
        tajawal: ["var(--font-tajawal)", "sans-serif"],
        noto: ["var(--font-noto)", "serif"],
        cairo: ["var(--font-cairo)", "sans-serif"],
        marhey: ["var(--font-marhey)", "cursive"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 3s ease-in-out infinite alternate",
        "unseal": "unseal 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
        "slide-card": "slideCard 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        glow: {
          "0%": { opacity: "0.6", filter: "drop-shadow(0 0 15px rgba(212, 175, 55, 0.3))" },
          "100%": { opacity: "1", filter: "drop-shadow(0 0 25px rgba(212, 175, 55, 0.6))" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
