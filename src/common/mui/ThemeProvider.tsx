"use client";
import React, { ReactNode } from "react";

//mui
import { ThemeProvider, createTheme, ThemeOptions } from "@mui/material/styles";
type ThemeWrapperProps = {
  children: ReactNode;
};

const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#FFA500", // Orange
      contrastText: "#ffffff",
      dark: "#C47400", // Darker Orange
      light: "#FFC266", // Lighter Orange
    },
    secondary: {
      main: "#000000", // Black
      contrastText: "#ffffff",
      dark: "#333333", // Darker Grey
      light: "#666666", // Lighter Grey
    },
    background: {
      default: "#0A041D",
      paper: "#000000", // Black
    },
    text: {
      primary: "#FFA500", // Orange
      secondary: "#ffffff", // White
    },
  },
};

const orangeBlackTheme = createTheme(themeOptions);

function ThemeWrapper({ children }: ThemeWrapperProps) {
  return <ThemeProvider theme={orangeBlackTheme}>{children}</ThemeProvider>;
}

export default ThemeWrapper;
