"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
//mui
const styles_1 = require("@mui/material/styles");
const themeOptions = {
    palette: {
        mode: "dark",
    },
};
const orangeBlackTheme = (0, styles_1.createTheme)(themeOptions);
function ThemeWrapper({ children }) {
    return react_1.default.createElement(styles_1.ThemeProvider, { theme: orangeBlackTheme }, children);
}
exports.default = ThemeWrapper;
