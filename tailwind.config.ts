import type { Config } from "tailwindcss";

// Paleta Respira: calma y confianza (PRD/AGENTS "Estilo").
// - brand: teal sereno (acción principal y "lo bueno").
// - sand: neutros cálidos (fondo crema, superficies, bordes).
// - attention: ámbar — NUNCA rojo de alarma — para avisos de honestidad
//   ante una audiencia vulnerable.
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F1FAF8",
          100: "#DCF1EC",
          200: "#BBE3DA",
          300: "#8ECFC2",
          400: "#57B2A2",
          500: "#2F9585",
          600: "#1F7A6D",
          700: "#1A6259",
          800: "#184E47",
          900: "#143F3A",
        },
        sand: {
          50: "#FBFAF7",
          100: "#F4F1EA",
          200: "#E9E4D8",
          300: "#D8D0BF",
          400: "#B9AE97",
          500: "#938872",
          600: "#726A58",
          700: "#574F41",
          800: "#3A342B",
          900: "#23201A",
        },
        attention: {
          50: "#FFF7EA",
          100: "#FCEBC9",
          200: "#F7D99A",
          500: "#D98A1F",
          600: "#B96E12",
          700: "#8F5410",
        },
        ink: "#1E2A2C",
        muted: "#4B5A57",
        line: "#E6E1D6",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(30,42,44,0.04), 0 12px 32px -16px rgba(30,42,44,0.18)",
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem",
      },
      maxWidth: {
        content: "40rem",
      },
    },
  },
  plugins: [],
};
export default config;
