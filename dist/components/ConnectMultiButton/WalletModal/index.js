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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const material_1 = require("@mui/material");
const rx_1 = require("react-icons/rx");
const fa_1 = require("react-icons/fa");
const WalletModal = ({ open, handleClose, wallets, getLeatherAddress, getPhantomAddress, getOkxAddress, getAddress, getAddressOptions, getUnisatAddress, setWallet, meWallets, modalContainerClass, modalContentClass, closeButtonClass, headingClass, walletItemClass, walletImageClass, walletLabelClass, icon = "https://raw.githubusercontent.com/coderixxinfotech/bitcoin-wallet-adapter/main/src/assets/btc-leather-logo.png", iconClass, iconContainerClass, }) => {
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
    // Theme-aware classes matching WalletPopup design
    const themes = {
        light: {
            overlay: 'bg-black/50 backdrop-blur-sm',
            modal: 'bg-white shadow-2xl border border-gray-200',
            header: 'text-gray-900',
            closeButton: 'bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-200',
            walletCard: 'bg-white border border-gray-200 hover:border-blue-300 text-gray-900 hover:shadow-lg',
            walletLabel: 'text-gray-900',
            noWalletText: 'text-gray-600',
            installedBadge: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
        },
        dark: {
            overlay: 'bg-black/70 backdrop-blur-sm',
            modal: 'bg-gray-900 shadow-2xl border border-gray-700',
            header: 'text-white',
            closeButton: 'bg-gray-800 hover:bg-red-900 text-gray-300 hover:text-red-300 border border-gray-600 hover:border-red-600',
            walletCard: 'bg-gray-800 border border-gray-700 hover:border-blue-500 text-white hover:shadow-xl',
            walletLabel: 'text-white',
            noWalletText: 'text-gray-400',
            installedBadge: 'bg-emerald-900/50 text-emerald-300 border border-emerald-700',
        }
    };
    const currentThemes = themes[currentTheme];
    return (react_1.default.createElement(material_1.Modal, { open: open, onClose: handleClose, "aria-labelledby": "wallet-modal-title", "aria-describedby": "wallet-modal-description", sx: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
        } },
        react_1.default.createElement("div", { className: `fixed inset-0 flex items-center justify-center p-4 ${currentThemes.overlay} ${modalContainerClass || ''}` },
            react_1.default.createElement("div", { className: `
          ${currentThemes.modal}
          rounded-2xl p-8 w-full max-w-md mx-auto relative
          transform transition-all duration-300 scale-100
          ${modalContentClass || ''}
        ` },
                react_1.default.createElement("button", { onClick: handleClose, className: `
              absolute top-4 right-4 p-2 rounded-lg transition-all duration-200
              ${currentThemes.closeButton}
              ${closeButtonClass || ''}
            ` },
                    react_1.default.createElement(rx_1.RxCross1, { className: "text-lg" })),
                react_1.default.createElement("div", { className: "text-center mb-8" },
                    react_1.default.createElement("div", { className: "flex justify-center mb-4" },
                        react_1.default.createElement("div", { className: `p-4 rounded-2xl ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'} ${iconContainerClass || ''}` }, icon ? (react_1.default.createElement("img", { src: icon, alt: "App Logo", className: `w-16 h-16 object-contain rounded-lg ${iconClass || ''}`, style: { maxWidth: '64px', maxHeight: '64px' } })) : (react_1.default.createElement(fa_1.FaWallet, { className: `text-4xl ${isDark ? 'text-blue-400' : 'text-blue-600'}` })))),
                    react_1.default.createElement("h2", { className: `
              text-2xl font-bold mb-2 ${currentThemes.header}
              ${headingClass || ''}
            ` }, "Connect Your Wallet"),
                    react_1.default.createElement("p", { className: `text-sm ${currentThemes.noWalletText}` }, "Choose your preferred Bitcoin wallet to continue")),
                react_1.default.createElement("div", { className: "space-y-3" }, wallets && (wallets === null || wallets === void 0 ? void 0 : wallets.length) > 0 ? (wallets.map((item, idx) => (react_1.default.createElement("button", { onClick: (e) => __awaiter(void 0, void 0, void 0, function* () {
                        const selectedItem = item.label;
                        if (selectedItem === "Leather") {
                            yield getLeatherAddress();
                        }
                        else if (selectedItem === "Xverse") {
                            yield getAddress(getAddressOptions);
                        }
                        else if (selectedItem === "Unisat") {
                            yield getUnisatAddress();
                        }
                        else if (selectedItem === "Phantom") {
                            yield getPhantomAddress();
                        }
                        else if (selectedItem === "OKX") {
                            yield getOkxAddress();
                        }
                        else if (selectedItem === "MagicEden") {
                            const wallet = meWallets.filter((a) => a.name === "Magic Eden")[0];
                            yield setWallet(wallet);
                        }
                    }), key: item.label + idx, className: `w-full p-4 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 ${currentThemes.walletCard} ${walletItemClass || ''}` },
                    react_1.default.createElement("div", { className: "flex items-center justify-between" },
                        react_1.default.createElement("div", { className: "flex items-center gap-4" },
                            react_1.default.createElement("img", { className: `w-10 h-10 rounded-lg ${walletImageClass || ''}`, src: item.logo, alt: `${item.label} logo` }),
                            react_1.default.createElement("div", { className: "text-left" },
                                react_1.default.createElement("h5", { className: `font-semibold text-base ${currentThemes.walletLabel} ${walletLabelClass || ''}` }, item.label),
                                react_1.default.createElement("p", { className: `text-sm ${currentThemes.noWalletText}` }, "Ready to connect"))),
                        react_1.default.createElement("div", { className: "flex items-center gap-2" },
                            react_1.default.createElement("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${currentThemes.installedBadge}` }, "Available"))))))) : (react_1.default.createElement("div", { className: `text-center py-8 ${currentThemes.noWalletText}` },
                    react_1.default.createElement(fa_1.FaWallet, { className: "mx-auto text-4xl mb-4 opacity-50" }),
                    react_1.default.createElement("p", { className: "text-lg font-medium mb-2" }, "No Wallets Found"),
                    react_1.default.createElement("p", { className: "text-sm" }, "Please install a Bitcoin wallet like Unisat, Xverse, or Leather to continue.")))),
                react_1.default.createElement("div", { className: "mt-6 pt-4 border-t border-gray-200 dark:border-gray-700" },
                    react_1.default.createElement("p", { className: `text-xs text-center ${currentThemes.noWalletText}` }, "By connecting, you agree to our terms and privacy policy"))))));
};
exports.default = WalletModal;
