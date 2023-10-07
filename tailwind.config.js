const customColors = {
  bwa_primary: {
    DEFAULT: "#171616",
    dark: "#402a18",
  },
  bwa_secondary: {
    DEFAULT: "#171616",
    dark: "#a8a4a4",
  },
  bwa_accent: {
    DEFAULT: "#FF9900",
  },
  bwa_accent_dark: "#855205",
  bwa_light_gray: "#c0c0c0", // A bit lighter to enhance contrast
  bwa_black: "#0c0d0c",
};

module.exports = {
  mode: "jit",
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
