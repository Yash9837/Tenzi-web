/** @type {import('tailwindcss').Config} */
import forms from "@tailwindcss/forms";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        background: "#FFFFFF",
        surface: "#F8F9FA",
        charcoal: "#212529",
        muted: "#6C757D",
        border: "#DEE2E6",
        success: "#198754",
        danger: "#DC3545"
      },
      fontFamily: {
        sans: ["Source Sans 3", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 40px rgba(0, 0, 0, 0.10)",
        card: "0 10px 22px rgba(0, 0, 0, 0.08)"
      }
    }
  },
  plugins: [forms]
};
