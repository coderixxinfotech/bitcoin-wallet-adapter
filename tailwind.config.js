const customColors = {
  bwa_primary: {
    DEFAULT: "#04020f",
    dark: "#1f1d3e",
  },
  bwa_secondary: {
    DEFAULT: "#0A041D",
    dark: "#a8a4a4",
  },
  bwa_accent: {
    DEFAULT: "#9102F0",
  },
  bwa_accent_dark: "#210236",
  bwa_light_gray: "#84848a", // A bit lighter to enhance contrast
  bwa_black: "#0c0d0c",
};

module.exports = {
  mode: "jit",
  prefix: "bwa-",
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: customColors,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
