const customColors = {
  primary: {
    DEFAULT: "#04020f",
    dark: "#1f1d3e",
  },
  secondary: {
    DEFAULT: "#0A041D",
    dark: "#a8a4a4",
  },
  accent: {
    DEFAULT: "#9102F0",
  },
  accent_dark: "#3d0263",
  light_gray: "#84848a",
  black: "#0c0d0c",
};

module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  safelist: [
    // Ensure these dynamic classes are never purged
    "bg-green-500",
    "bg-gray-600",
  ],
  theme: {
    extend: {
      colors: customColors,
    },
  },
  plugins: [],
};
