"use strict";
"use client";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// What happens in this file:
// - UI for connecting to multiple Bitcoin wallets and capturing a connection signature
// - Uses Redux store for network; no `network` prop is accepted or used
// - Initiates address requests and message signing per wallet (Xverse, Unisat, Leather, OKX, Phantom, Magic Eden)
// - Emits `onSignatureCapture` with signature, message, address, wallet, and redux network
const react_1 = __importStar(require("react"));
// Connections are delegated to the headless useWalletConnect hook
//reducer
const react_redux_1 = require("react-redux");
const WalletButton_1 = __importDefault(require("./WalletButton"));
const WalletModal_1 = __importDefault(require("./WalletModal"));
// No local verification in this UI component
const hooks_1 = require("../../hooks");
const useWalletEffect_1 = __importDefault(require("../../hooks/useWalletEffect"));
const useDisconnect_1 = __importDefault(require("../../hooks/useDisconnect"));
function ConnectMultiWallet({ buttonClassname, modalContainerClass, modalContentClass, closeButtonClass, headingClass, walletItemClass, walletImageClass, walletLabelClass, InnerMenu, icon, iconClass, balance, connectionMessage, fractal, supportedWallets, onSignatureCapture, }) {
    // Keep the latest onSignatureCapture without causing effect re-runs
    const onSignatureCaptureRef = (0, react_1.useRef)(onSignatureCapture);
    (0, react_1.useEffect)(() => {
        onSignatureCaptureRef.current = onSignatureCapture;
    }, [onSignatureCapture]);
    // Signature is handled in the hook; this component does not sign directly
    //for notification
    const disconnectFunc = (0, useDisconnect_1.default)();
    const walletDetails = (0, react_redux_1.useSelector)((state) => state.general.walletDetails);
    const redux_network = (0, react_redux_1.useSelector)((state) => state.general.network.toLowerCase());
    const lastWallet = (0, react_redux_1.useSelector)((state) => state.general.lastWallet);
    const [wallets, setWallets] = (0, react_1.useState)([]);
    // All persistence is managed by the hook
    //connect-wallet modal
    const [open, setOpen] = (0, react_1.useState)(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
    };
    const testWallets = [];
    const setWallet = (_) => { };
    // ME: auto-connect disabled
    (0, react_1.useEffect)(() => { }, []);
    // Function to check which wallets are installed
    function getInstalledWalletName() {
        let checkWallets = [];
        if (typeof window.unisat !== "undefined") {
            checkWallets.push({
                label: "Unisat",
                logo: "https://raw.githubusercontent.com/coderixxinfotech/bitcoin-wallet-adapter/main/src/assets/btc-unisat-logo.png",
            });
        }
        if (!fractal && typeof window.LeatherProvider !== "undefined") {
            checkWallets.push({
                label: "Leather",
                logo: "https://raw.githubusercontent.com/coderixxinfotech/bitcoin-wallet-adapter/main/src/assets/btc-leather-logo.png",
            });
        }
        // Always show Xverse option
        checkWallets.push({
            label: "Xverse",
            logo: "https://raw.githubusercontent.com/coderixxinfotech/bitcoin-wallet-adapter/main/src/assets/btc-xverse-logo.png",
        });
        // Exclude MagicEden until hook support is implemented
        if (!fractal && typeof window.phantom !== "undefined") {
            checkWallets.push({
                label: "Phantom",
                logo: "https://raw.githubusercontent.com/coderixxinfotech/bitcoin-wallet-adapter/main/src/assets/btc-phantom-logo.png",
            });
        }
        if (typeof window.okxwallet !== "undefined") {
            checkWallets.push({
                label: "OKX",
                logo: "https://raw.githubusercontent.com/coderixxinfotech/bitcoin-wallet-adapter/main/src/assets/btc-okx-logo.png",
            });
        }
        // In testnet mode, hide wallets that don't support testnet flows in our adapter
        // Currently hidden: MagicEden, Phantom, OKX
        if (redux_network === "testnet") {
            const excludeOnTestnet = new Set(["MagicEden", "Phantom", "OKX"]);
            checkWallets = checkWallets.filter((w) => !excludeOnTestnet.has(w.label));
        }
        if (supportedWallets && supportedWallets.length > 0)
            // Filter out wallets that are not in supportedWallets
            checkWallets = checkWallets.filter((wallet) => supportedWallets.includes(wallet.label.toLowerCase()));
        setWallets(checkWallets);
    }
    // Use effect hook to run getInstalledWalletName function on component mount
    (0, react_1.useEffect)(() => {
        getInstalledWalletName();
        // Bitcoin price is now managed centrally by the useBitcoinPrice hook
    }, [open, redux_network]);
    // Auto-restore is handled in the headless hook
    //menu
    const [anchorEl, setAnchorEl] = react_1.default.useState(null);
    const menuOpen = Boolean(anchorEl);
    const handleMenuOpen = (event) => {
        // console.log("opening menu...");
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    //disconnect
    const disconnect = (0, react_1.useCallback)(() => {
        disconnectFunc();
        handleMenuClose();
    }, []);
    // Use the custom hook
    (0, useWalletEffect_1.default)(walletDetails, disconnect, redux_network);
    // Delegate all connections to headless hook
    const { connect: connectWallet } = (0, hooks_1.useWalletConnect)();
    const connectXverseViaHook = () => __awaiter(this, void 0, void 0, function* () {
        yield connectWallet("xverse");
        handleClose();
    });
    const getUnisatAddress = () => __awaiter(this, void 0, void 0, function* () {
        yield connectWallet("unisat");
        handleClose();
    });
    const getLeatherAddress = () => __awaiter(this, void 0, void 0, function* () {
        yield connectWallet("leather");
        handleClose();
    });
    const getPhantomAddress = () => __awaiter(this, void 0, void 0, function* () {
        yield connectWallet("phantom");
        handleClose();
    });
    const getOkxAddress = () => __awaiter(this, void 0, void 0, function* () {
        yield connectWallet("okx");
        handleClose();
    });
    // MagicEden flow is not supported via hook at the moment; left out intentionally
    // Bridge: surface signature via Redux + localStorage when hook completes
    const signature = (0, react_redux_1.useSelector)((s) => s.general.signature);
    (0, react_1.useEffect)(() => {
        if (!onSignatureCaptureRef.current)
            return;
        if (!signature || !(walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.ordinal))
            return;
        const msg = localStorage.getItem('wallet-message') || '';
        onSignatureCaptureRef.current({
            signature,
            message: msg,
            address: walletDetails.ordinal,
            wallet: walletDetails.wallet || '',
            network: redux_network.toLowerCase(),
        });
    }, [signature, walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.ordinal, walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.wallet, redux_network]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", null,
            react_1.default.createElement(WalletButton_1.default, { wallets: wallets, lastWallet: lastWallet, walletDetails: walletDetails, handleMenuOpen: handleMenuOpen, handleMenuClose: handleMenuClose, handleOpen: handleOpen, handleClose: handleClose, anchorEl: anchorEl, disconnect: disconnect, menuOpen: menuOpen, classname: buttonClassname, InnerMenu: InnerMenu, balance: balance, fractal: fractal }),
            react_1.default.createElement(WalletModal_1.default, { open: open, handleClose: handleClose, wallets: wallets, getLeatherAddress: getLeatherAddress, getPhantomAddress: getPhantomAddress, getOkxAddress: getOkxAddress, getAddress: connectXverseViaHook, getAddressOptions: null, getUnisatAddress: getUnisatAddress, modalContainerClass: modalContainerClass, modalContentClass: modalContentClass, closeButtonClass: closeButtonClass, headingClass: headingClass, walletItemClass: walletItemClass, walletImageClass: walletImageClass, walletLabelClass: walletLabelClass, icon: icon, iconClass: iconClass, meWallets: testWallets, setWallet: setWallet }))));
}
exports.default = ConnectMultiWallet;
