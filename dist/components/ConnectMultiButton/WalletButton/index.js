"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const utils_1 = require("../../../utils");
const ri_1 = require("react-icons/ri");
const fa_1 = require("react-icons/fa");
const material_1 = require("@mui/material");
const WalletButton = ({ wallets, lastWallet, walletDetails, handleMenuOpen, handleMenuClose, handleOpen, handleClose, disconnect, anchorEl, menuOpen, classname, InnerMenu, balance, fractal, }) => {
    const [currentTheme, setCurrentTheme] = (0, react_1.useState)('light');
    // Auto detect theme based on system preference
    (0, react_1.useEffect)(() => {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setCurrentTheme(isDark ? 'dark' : 'light');
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e) => setCurrentTheme(e.matches ? 'dark' : 'light');
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);
    const isDark = currentTheme === 'dark';
    // Theme-aware classes matching WalletPopup design with bwa- prefix
    const themes = {
        light: {
            connectButton: 'bwa-bg-blue-600 hover:bwa-bg-blue-700 bwa-text-white bwa-shadow-lg hover:bwa-shadow-xl bwa-transition-all bwa-duration-200 bwa-border bwa-border-blue-600 focus:bwa-ring-4 focus:bwa-ring-blue-200',
            connectedButton: 'bwa-bg-gradient-to-r from-bwa-emerald-600 to-bwa-emerald-700 hover:from-bwa-emerald-700 hover:to-bwa-emerald-800 bwa-text-white bwa-shadow-lg hover:bwa-shadow-xl bwa-transition-all bwa-duration-200 bwa-border bwa-border-emerald-600 focus:bwa-ring-4 focus:bwa-ring-emerald-200',
            menu: 'bwa-bg-white bwa-shadow-2xl bwa-border bwa-border-gray-200',
            menuItem: 'bwa-text-gray-900 hover:bwa-bg-gray-50',
            menuItemIcon: 'bwa-text-gray-600',
        },
        dark: {
            connectButton: 'bwa-bg-blue-600 hover:bwa-bg-blue-700 bwa-text-white bwa-shadow-lg hover:bwa-shadow-xl bwa-transition-all bwa-duration-200 bwa-border bwa-border-blue-500 focus:bwa-ring-4 focus:bwa-ring-blue-800',
            connectedButton: 'bwa-bg-gradient-to-r from-bwa-emerald-600 to-bwa-emerald-700 hover:from-bwa-emerald-700 hover:to-bwa-emerald-800 bwa-text-white bwa-shadow-lg hover:bwa-shadow-xl bwa-transition-all bwa-duration-200 bwa-border bwa-border-emerald-500 focus:bwa-ring-4 focus:bwa-ring-emerald-800',
            menu: 'bwa-bg-gray-900 bwa-shadow-2xl bwa-border bwa-border-gray-700',
            menuItem: 'bwa-text-white hover:bwa-bg-gray-800',
            menuItemIcon: 'bwa-text-gray-400',
        }
    };
    const currentThemes = themes[currentTheme];
    return lastWallet && walletDetails ? (react_1.default.createElement("div", { className: "relative" },
        react_1.default.createElement("button", { onClick: (e) => (menuOpen ? handleMenuClose() : handleMenuOpen(e)), className: `
        ${currentThemes.connectButton}
        bwa-px-8 bwa-py-4 bwa-rounded-xl bwa-font-bold bwa-text-base bwa-flex bwa-items-center bwa-gap-3
        bwa-transform hover:bwa-scale-105 active:bwa-scale-95 bwa-transition-all bwa-duration-200
        bwa-min-w-[200px] bwa-justify-center
        ${classname || ''}
      ` },
            react_1.default.createElement(ri_1.RiAccountCircleFill, { className: "bwa-text-xl" }),
            react_1.default.createElement("span", { className: "bwa-font-medium" }, balance
                ? `${(balance / 100000000).toFixed(5)} ${fractal ? " FB" : " BTC"}`
                : (0, utils_1.shortenString)(walletDetails.cardinal, 5))),
        InnerMenu ? (react_1.default.createElement(InnerMenu, { anchorEl: anchorEl, open: menuOpen, onClose: handleMenuClose, disconnect: disconnect })) : (react_1.default.createElement(material_1.Menu, { id: "connected-menu", anchorEl: anchorEl, open: menuOpen, onClose: handleMenuClose, PaperProps: {
                elevation: 0,
                sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 8px 25px rgba(0,0,0,0.15))",
                    mt: 1.5,
                    borderRadius: "12px",
                    border: isDark ? "1px solid rgb(55, 65, 81)" : "1px solid rgb(229, 231, 235)",
                    bgcolor: isDark ? "rgb(17, 24, 39)" : "white",
                    "& .MuiList-root": {
                        padding: "8px",
                    },
                    "& .MuiMenuItem-root": {
                        borderRadius: "8px",
                        margin: "2px 0",
                        padding: "12px 16px",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: isDark ? "white" : "rgb(17, 24, 39)",
                        "&:hover": {
                            backgroundColor: isDark ? "rgb(31, 41, 55)" : "rgb(249, 250, 251)",
                        },
                    },
                    "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: isDark ? "rgb(17, 24, 39)" : "white",
                        border: isDark ? "1px solid rgb(55, 65, 81)" : "1px solid rgb(229, 231, 235)",
                        borderRight: "none",
                        borderBottom: "none",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                    },
                },
            }, MenuListProps: {
                "aria-labelledby": "basic-button",
            }, transformOrigin: { horizontal: "right", vertical: "top" }, anchorOrigin: { horizontal: "right", vertical: "bottom" } },
            react_1.default.createElement("div", null,
                react_1.default.createElement(material_1.MenuItem, { onClick: disconnect, className: "bwa-flex" },
                    react_1.default.createElement(fa_1.FaPowerOff, null),
                    react_1.default.createElement("p", { className: "bwa-ml-2 bwa-text-xs" }, "Disconnect"))))))) : (react_1.default.createElement("button", { onClick: handleOpen, className: `
        ${currentThemes.connectButton}
        bwa-px-8 bwa-py-4 bwa-rounded-xl bwa-font-bold bwa-text-base bwa-flex bwa-items-center bwa-gap-3
        bwa-transform hover:bwa-scale-105 active:bwa-scale-95 bwa-transition-all bwa-duration-200
        bwa-min-w-[200px] bwa-justify-center
        ${classname || ''}
      ` },
        react_1.default.createElement(fa_1.FaWallet, { className: "bwa-text-lg" }),
        react_1.default.createElement("span", { className: "bwa-font-medium" }, "Connect Wallet")));
};
exports.default = WalletButton;
