/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#B8FF4F",
        "accent-hover": "#A5EB3B",
        surface: "#FFFFFF",
        "bg-default": "#FAFAFA",
        primary: "#111111",
        secondary: "#6B7280",
        "border-light": "#E5E7EB",
      },
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
