const customColors = {
  primary: {
    DEFAULT: "#171616",
    dark: "#402a18",
  },
  secondary: {
    DEFAULT: "#171616",
    dark: "#a8a4a4",
  },
  accent: {
    DEFAULT: "#FF9900",
  },
  accent_dark: "#855205",
  light_gray: "#c0c0c0", // A bit lighter to enhance contrast
  black: "#0c0d0c",
};

module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false,
  theme: {
    fontFamily: {
      sans: ['"Facebook Sans"', "sans-serif"],
    },
    extend: {
      colors: customColors,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
