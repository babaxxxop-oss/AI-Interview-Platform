/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./templates/**/*.html",
    "./app.py",
    "./routes/**/*.py",
    "./static/js/**/*.js"
  ],

  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },

      colors: {
        primary: "#7C3AED",
        secondary: "#8B5CF6",
      },

      boxShadow: {
        card: "0 10px 25px rgba(0,0,0,0.08)",
      },
    },
  },

  plugins: [],
}