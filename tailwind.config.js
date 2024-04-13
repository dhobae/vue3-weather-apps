module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "weather-primary": "#31363F",
        "weather-secondary": "#FFB38E",
      },
      // boxShadow: {
      //   white: "0px 0px 20px rgba(255, 255, 255, 0.5)", // Bayangan putih
      // },
    },
    fontFamily: {
      Roboto: ["Roboto, sans-serif"],
    },
    container: {
      padding: "2rem",
      center: true,
    },
    screens: {
      sm: "640px",
      md: "768px",
    },
  },
  plugins: [],
};
