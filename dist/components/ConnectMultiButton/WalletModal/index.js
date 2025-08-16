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
    // Theme-aware classes matching WalletPopup design with bwa- prefix
    const themes = {
        light: {
            overlay: 'bwa-bg-black/50 bwa-backdrop-blur-sm',
            modal: 'bwa-bg-white bwa-shadow-2xl bwa-border bwa-border-gray-200',
            header: 'bwa-text-gray-900',
            closeButton: 'bwa-bg-gray-100 hover:bwa-bg-red-100 bwa-text-gray-600 hover:bwa-text-red-600 bwa-border bwa-border-gray-200 hover:bwa-border-red-200',
            walletCard: 'bwa-bg-white bwa-border bwa-border-gray-200 hover:bwa-border-blue-300 bwa-text-gray-900 hover:bwa-shadow-lg',
            walletLabel: 'bwa-text-gray-900',
            noWalletText: 'bwa-text-gray-600',
            installedBadge: 'bwa-bg-emerald-100 bwa-text-emerald-700 bwa-border bwa-border-emerald-200',
        },
        dark: {
            overlay: 'bwa-bg-black/70 bwa-backdrop-blur-sm',
            modal: 'bwa-bg-gray-900 bwa-shadow-2xl bwa-border bwa-border-gray-700',
            header: 'bwa-text-white',
            closeButton: 'bwa-bg-gray-800 hover:bwa-bg-red-900 bwa-text-gray-300 hover:bwa-text-red-300 bwa-border bwa-border-gray-600 hover:bwa-border-red-600',
            walletCard: 'bwa-bg-gray-800 bwa-border bwa-border-gray-700 hover:bwa-border-blue-500 bwa-text-white hover:bwa-shadow-xl',
            walletLabel: 'bwa-text-white',
            noWalletText: 'bwa-text-gray-400',
            installedBadge: 'bwa-bg-emerald-900/50 bwa-text-emerald-300 bwa-border bwa-border-emerald-700',
        }
    };
    const currentThemes = themes[currentTheme];
    return (react_1.default.createElement(material_1.Modal, { open: open, onClose: handleClose, "aria-labelledby": "wallet-modal-title", "aria-describedby": "wallet-modal-description", sx: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
        } },
        react_1.default.createElement("div", { className: `bwa-fixed bwa-inset-0 bwa-flex bwa-items-center bwa-justify-center bwa-p-4 ${currentThemes.overlay} ${modalContainerClass || ''}` },
            react_1.default.createElement("div", { className: `
          ${currentThemes.modal}
          bwa-rounded-2xl bwa-p-8 bwa-w-full bwa-max-w-md bwa-mx-auto bwa-relative
          bwa-transform bwa-transition-all bwa-duration-300 bwa-scale-100
          ${modalContentClass || ''}
        ` },
                react_1.default.createElement("button", { onClick: handleClose, className: `
              bwa-absolute bwa-top-4 bwa-right-4 bwa-p-2 bwa-rounded-lg bwa-transition-all bwa-duration-200
              ${currentThemes.closeButton}
              ${closeButtonClass || ''}
            ` },
                    react_1.default.createElement(rx_1.RxCross1, { className: "text-lg" })),
                react_1.default.createElement("div", { className: "bwa-text-center bwa-mb-8" },
                    react_1.default.createElement("div", { className: "bwa-flex bwa-justify-center bwa-mb-4" },
                        react_1.default.createElement("div", { className: `bwa-p-4 bwa-rounded-2xl ${isDark ? 'bwa-bg-blue-900/20' : 'bwa-bg-blue-50'} ${iconContainerClass || ''}` }, icon ? (react_1.default.createElement("img", { src: icon, alt: "App Logo", className: `bwa-w-16 bwa-h-16 bwa-object-contain bwa-rounded-lg ${iconClass || ''}`, style: { maxWidth: '64px', maxHeight: '64px' } })) : (react_1.default.createElement(fa_1.FaWallet, { className: `bwa-text-4xl ${isDark ? 'bwa-text-blue-400' : 'bwa-text-blue-600'}` })))),
                    react_1.default.createElement("h2", { className: `
              bwa-text-2xl bwa-font-bold bwa-mb-2 ${currentThemes.header}
              ${headingClass || ''}
            ` }, "Connect Your Wallet"),
                    react_1.default.createElement("p", { className: `bwa-text-sm ${currentThemes.noWalletText}` }, "Choose your preferred Bitcoin wallet to continue")),
                react_1.default.createElement("div", { className: "bwa-space-y-3" }, wallets && (wallets === null || wallets === void 0 ? void 0 : wallets.length) > 0 ? (wallets.map((item, idx) => (react_1.default.createElement("button", { onClick: (e) => __awaiter(void 0, void 0, void 0, function* () {
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
                    }), key: item.label + idx, className: `bwa-w-full bwa-p-4 bwa-rounded-xl bwa-transition-all bwa-duration-200 bwa-transform hover:bwa-scale-105 active:bwa-scale-95 ${currentThemes.walletCard} ${walletItemClass || ''}` },
                    react_1.default.createElement("div", { className: "bwa-flex bwa-items-center bwa-justify-between" },
                        react_1.default.createElement("div", { className: "bwa-flex bwa-items-center bwa-gap-4" },
                            react_1.default.createElement("img", { className: `bwa-w-10 bwa-h-10 bwa-rounded-lg ${walletImageClass || ''}`, src: item.logo, alt: `${item.label} logo` }),
                            react_1.default.createElement("div", { className: "bwa-flex bwa-flex-col" },
                                react_1.default.createElement("h5", { className: `bwa-font-semibold bwa-text-base ${currentThemes.walletLabel} ${walletLabelClass || ''}` }, item.label),
                                react_1.default.createElement("p", { className: `bwa-text-sm ${currentThemes.noWalletText}` }, "Ready to connect"))),
                        react_1.default.createElement("div", { className: "bwa-flex bwa-items-center bwa-gap-2" },
                            react_1.default.createElement("span", { className: `bwa-px-3 bwa-py-1 bwa-rounded-full bwa-text-xs bwa-font-medium ${currentThemes.installedBadge}` }, "Available"))))))) : (react_1.default.createElement("div", { className: `bwa-text-center bwa-py-8 ${currentThemes.noWalletText}` },
                    react_1.default.createElement(fa_1.FaWallet, { className: "bwa-mx-auto bwa-text-4xl bwa-mb-4 bwa-opacity-50" }),
                    react_1.default.createElement("p", { className: "bwa-text-lg bwa-font-medium bwa-mb-2" }, "No Wallets Found"),
                    react_1.default.createElement("p", { className: "bwa-text-sm" }, "Please install a Bitcoin wallet like Unisat, Xverse, or Leather to continue.")))),
                react_1.default.createElement("div", { className: "bwa-mt-6 bwa-pt-4 bwa-border-t bwa-border-gray-200 dark:bwa-border-gray-700" },
                    react_1.default.createElement("p", { className: `bwa-text-xs bwa-text-center ${currentThemes.noWalletText}` }, "By connecting, you agree to our terms and privacy policy"))))));
};
exports.default = WalletModal;
