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
  },
};

const orangeBlackTheme = createTheme(themeOptions);

function ThemeWrapper({ children }: ThemeWrapperProps) {
  return <ThemeProvider theme={orangeBlackTheme}>{children}</ThemeProvider>;
}

export default ThemeWrapper;
