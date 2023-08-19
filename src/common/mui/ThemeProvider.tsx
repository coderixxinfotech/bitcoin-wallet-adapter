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
      main: "#ffffff",
      contrastText: "#84848a",
      dark: "#9102F0",
      light: "#cca4e6",
    },
    secondary: {
      main: "#9102F0",
      contrastText: "ffffff",
      dark: "#24023b",
      light: "#c987f5",
    },
    background: {
      default: "#090417",
      paper: "#0A041D",
    },
    text: {
      secondary: "#84848a",
    },
  },
};

const orangeBlackTheme = createTheme(themeOptions);

function ThemeWrapper({ children }: ThemeWrapperProps) {
  return <ThemeProvider theme={orangeBlackTheme}>{children}</ThemeProvider>;
}

export default ThemeWrapper;
