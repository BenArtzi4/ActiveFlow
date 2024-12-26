/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "light-blue": {
          100: "#e0f2fe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        gray: {
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
        },
      },
    },
  },
  plugins: [],
};
