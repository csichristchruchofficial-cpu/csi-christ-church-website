import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B1E36", // vibrant deep royal navy
          950: "#071426",
          900: "#0B1E36",
          800: "#102A4C",
          700: "#183C66",
          600: "#225085",
        },
        royal: {
          DEFAULT: "#1E40AF",
          light: "#3B82F6",
          dark: "#1E3A8A",
        },
        crimson: {
          DEFAULT: "#DC2626", // church steeple cross & red carpet
          light: "#EF4444",
          dark: "#B91C1C",
          deep: "#991B1B",
        },
        gold: {
          DEFAULT: "#F59E0B", // luminous warm gold
          light: "#FBBF24",
          dark: "#D97706",
          amber: "#B45309",
        },
        cyan: {
          DEFAULT: "#06B6D4", // sanctuary arch turquoise
          light: "#22D3EE",
          dark: "#0891B2",
        },
        cream: {
          DEFAULT: "#FFFFFF", // crisp bright white
          deep: "#F8FAFC",   // subtle slate light
          warm: "#FFFBEB",   // warm sunny white
        },
        ink: {
          DEFAULT: "#0F172A", // modern slate text
          light: "#334155",
          muted: "#64748B",
        },
      },
      fontFamily: {
        tamil: ["var(--font-tamil)", "sans-serif"],
        display: ["var(--font-tamil-display)", "serif"],
      },
      maxWidth: {
        prose: "68ch",
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(11, 30, 54, 0.12)",
        card: "0 10px 25px -5px rgba(11, 30, 54, 0.08), 0 8px 10px -6px rgba(11, 30, 54, 0.04)",
        "card-hover": "0 20px 35px -10px rgba(11, 30, 54, 0.15), 0 10px 15px -5px rgba(220, 38, 38, 0.1)",
        "glow-gold": "0 0 25px rgba(245, 158, 11, 0.45)",
        "glow-crimson": "0 0 25px rgba(220, 38, 38, 0.35)",
        "glow-royal": "0 0 30px rgba(30, 64, 175, 0.35)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-hero": "linear-gradient(to bottom, rgba(7, 20, 38, 0.7) 0%, rgba(11, 30, 54, 0.85) 60%, rgba(11, 30, 54, 0.98) 100%)",
        "gradient-gold": "linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #D97706 100%)",
        "gradient-crimson": "linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%)",
        "gradient-royal": "linear-gradient(135deg, #1E40AF 0%, #0B1E36 100%)",
        "gradient-vibrant": "linear-gradient(135deg, #DC2626 0%, #B45309 50%, #1E40AF 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
