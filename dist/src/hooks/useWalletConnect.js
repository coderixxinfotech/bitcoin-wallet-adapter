"use strict";
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
exports.useWalletConnect = void 0;
// What happens in this file:
// - Headless hook to discover wallets, connect/disconnect, and expose wallet details via Redux
// - Reads network from Redux (hooks internally rely on Redux, no props)
// - Persists connection in localStorage using key 'wallet-detail' and 'lastWallet'
// - Provides per-wallet connect methods (Leather, Unisat, Xverse, Phantom, OKX, Magic Eden placeholder)
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const react_2 = require("@wallet-standard/react");
const errorHandler_1 = require("../utils/errorHandler");
const useMessageSign_1 = require("./useMessageSign");
const bip322_js_1 = require("bip322-js");
const network_1 = require("../utils/network");
const sats_connect_1 = require("sats-connect");
const generalReducer_1 = require("../stores/reducers/generalReducer");
const purposes = ["ordinals", "payment"];
/**
 * Headless hook for wallet connection and management
 * Provides all wallet connection logic without any UI components
 */
const useWalletConnect = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { wallets: meWallets } = (0, react_2.useWallets)();
    // State from Redux
    const walletDetails = (0, react_redux_1.useSelector)((state) => state.general.walletDetails);
    const lastWallet = (0, react_redux_1.useSelector)((state) => state.general.lastWallet);
    const reduxNetwork = (0, react_redux_1.useSelector)((state) => state.general.network);
    const signature = (0, react_redux_1.useSelector)((state) => state.general.signature || null);
    // Local State
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [availableWallets, setAvailableWallets] = (0, react_1.useState)([]);
    const [tempWD, setTempWD] = (0, react_1.useState)(null); // hold wallet details until message is signed
    // Message signing
    const { signMessage, result: signatureResult, error: signingError } = (0, useMessageSign_1.useMessageSign)();
    const [pendingMessage, setPendingMessage] = (0, react_1.useState)(null);
    const getMessage = (0, react_1.useCallback)((address) => {
        const issuedAt = new Date().toISOString();
        const origin = typeof window !== 'undefined' ? window.location.origin : 'unknown-origin';
        return `Sign in to confirm wallet ownership for this session.\n\nAddress:\n${address}\nNetwork: ${reduxNetwork}\nOrigin: ${origin}\n\nThis does not grant spending permissions.\nIssued At: ${issuedAt}`;
    }, [reduxNetwork]);
    // Derived State
    const isConnected = !!((walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.cardinal) || (walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.ordinal));
    /**
     * Check which wallets are available/installed
     */
    const checkAvailableWallets = (0, react_1.useCallback)(() => {
        var _a, _b;
        const wallets = [];
        // Check Leather Wallet
        if (window.LeatherProvider) {
            wallets.push({
                label: "Leather",
                logo: "/leather.png",
                connector: "leather",
                installed: true,
            });
        }
        // Check Unisat Wallet
        if (window.unisat) {
            wallets.push({
                label: "Unisat",
                logo: "/unisat.png",
                connector: "unisat",
                installed: true,
            });
        }
        // Check Xverse Wallet (via sats-connect)
        if (typeof window !== "undefined") {
            wallets.push({
                label: "Xverse",
                logo: "/xverse.png",
                connector: "xverse",
                installed: true, // Always show as available since it uses web API
            });
        }
        // Check Phantom Wallet
        if ((_a = window.phantom) === null || _a === void 0 ? void 0 : _a.bitcoin) {
            wallets.push({
                label: "Phantom",
                logo: "/phantom.png",
                connector: "phantom",
                installed: true,
            });
        }
        // Check OKX Wallet
        if ((_b = window.okxwallet) === null || _b === void 0 ? void 0 : _b.bitcoin) {
            wallets.push({
                label: "OKX Wallet",
                logo: "/okx.png",
                connector: "okx",
                installed: true,
            });
        }
        // Check Magic Eden Wallets
        if (meWallets && meWallets.length > 0) {
            meWallets.forEach((wallet) => {
                if (wallet.name && wallet.name.includes("Magic Eden")) {
                    wallets.push({
                        label: wallet.name,
                        logo: "/magiceden.png",
                        connector: "magiceden",
                        installed: true,
                    });
                }
            });
        }
        return wallets;
    }, [meWallets]);
    /**
     * Connect to a specific wallet
     */
    const connect = (0, react_1.useCallback)((walletType, options) => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        setError(null);
        try {
            // Clear any previous persisted session before a new connection attempt
            localStorage.removeItem("wallet-detail");
            localStorage.removeItem("lastWallet");
            localStorage.removeItem("wallet-signature");
            localStorage.removeItem("wallet-message");
            // Also clear temp state
            setTempWD(null);
            setPendingMessage(null);
            switch (walletType.toLowerCase()) {
                case "leather":
                    yield connectLeather();
                    break;
                case "unisat":
                    yield connectUnisat();
                    break;
                case "xverse":
                    yield connectXverse(options);
                    break;
                case "phantom":
                    yield connectPhantom();
                    break;
                case "okx":
                    yield connectOKX();
                    break;
                case "magiceden":
                    yield connectMagicEden(options === null || options === void 0 ? void 0 : options.wallet);
                    break;
                default:
                    (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.UNSUPPORTED_WALLET, `Unsupported wallet type: ${walletType}`, {
                        severity: errorHandler_1.BWAErrorSeverity.HIGH,
                        context: {
                            walletType,
                            operation: 'wallet_connect',
                            additionalData: { supportedWallets: ['leather', 'unisat', 'xverse', 'phantom', 'okx', 'magiceden'] }
                        },
                        recoverable: true
                    });
            }
        }
        catch (err) {
            (0, errorHandler_1.wrapAndThrowError)(err, errorHandler_1.BWAErrorCode.WALLET_CONNECTION_FAILED, `Failed to connect to ${walletType} wallet`, {
                walletType,
                operation: 'wallet_connect',
                timestamp: Date.now()
            });
        }
        finally {
            setIsLoading(false);
        }
    }), [dispatch]);
    /**
     * Disconnect current wallet
     */
    const disconnect = (0, react_1.useCallback)(() => {
        // Clear localStorage
        localStorage.removeItem("lastWallet");
        localStorage.removeItem("wallet-details");
        localStorage.removeItem("wallet-detail");
        // Clear wallet-related items from localStorage
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && key.startsWith("wallet")) {
                localStorage.removeItem(key);
            }
        }
        // Clear Redux state
        dispatch((0, generalReducer_1.setLastWallet)(""));
        dispatch((0, generalReducer_1.setWalletDetails)(null));
        setError(null);
    }, [dispatch]);
    /**
     * Refresh wallet balance
     * Note: Bitcoin price is now managed centrally by the useBitcoinPrice hook
     */
    const refreshBalance = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        // Intentionally no-op: Bitcoin price is managed centrally by useBitcoinPrice
    }), []);
    // Wallet-specific connection methods
    const connectLeather = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if (!window.LeatherProvider) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "Leather wallet is not available or not installed", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'wallet_connection',
                    additionalData: { walletType: 'Leather' }
                }
            });
        }
        const response = yield window.LeatherProvider.request("getAddresses");
        const addresses = (_b = (_a = response === null || response === void 0 ? void 0 : response.result) === null || _a === void 0 ? void 0 : _a.addresses) !== null && _b !== void 0 ? _b : [];
        const ordinalsAddress = addresses.find((x) => (x === null || x === void 0 ? void 0 : x.type) === "p2tr");
        const paymentAddress = addresses.find((x) => (x === null || x === void 0 ? void 0 : x.type) === "p2wpkh");
        if (!ordinalsAddress || !paymentAddress) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "Required Leather addresses not found (p2tr/p2wpkh)", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'wallet_connection',
                    additionalData: { walletType: 'Leather', haveP2tr: !!ordinalsAddress, haveP2wpkh: !!paymentAddress }
                }
            });
        }
        const walletDetail = {
            cardinal: paymentAddress.address,
            cardinalPubkey: paymentAddress.publicKey || '',
            ordinal: ordinalsAddress.address,
            ordinalPubkey: ordinalsAddress.publicKey || '',
            connected: true,
            wallet: "Leather",
        };
        // Require signing before persisting
        setTempWD(walletDetail);
        const msg = getMessage(walletDetail.ordinal);
        setPendingMessage(msg);
        yield signMessage({ address: walletDetail.ordinal, message: msg, wallet: "Leather" });
    });
    const connectUnisat = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!window.unisat) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "Unisat wallet is not available or not installed", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'wallet_connection',
                    additionalData: { walletType: 'Unisat' }
                }
            });
        }
        const accounts = yield window.unisat.requestAccounts();
        if (!accounts || accounts.length === 0) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "No accounts found in Unisat wallet", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'wallet_connection',
                    additionalData: {
                        walletType: 'Unisat',
                        reason: 'no_accounts_available'
                    }
                }
            });
        }
        const address = accounts[0];
        // Get public key from Unisat wallet if available
        let publicKey = '';
        try {
            publicKey = yield window.unisat.getPublicKey();
        }
        catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn("Could not get public key from Unisat:", err);
            }
        }
        const walletDetail = {
            cardinal: address,
            cardinalPubkey: publicKey || '',
            ordinal: address,
            ordinalPubkey: publicKey || '',
            connected: true,
            wallet: "Unisat",
        };
        setTempWD(walletDetail);
        const msg = getMessage(walletDetail.ordinal);
        setPendingMessage(msg);
        yield signMessage({ address: walletDetail.ordinal, message: msg, wallet: "Unisat" });
    });
    const connectXverse = (options = {}) => __awaiter(void 0, void 0, void 0, function* () {
        const getAddressOptions = {
            payload: {
                purposes: purposes,
                message: "Address for receiving Ordinals and payments",
                network: {
                    type: reduxNetwork === 'testnet' ? sats_connect_1.BitcoinNetworkType.Testnet : sats_connect_1.BitcoinNetworkType.Mainnet,
                },
            },
            onFinish: (response) => __awaiter(void 0, void 0, void 0, function* () {
                const accounts = response.addresses;
                const paymentAccount = accounts.find((acc) => acc.purpose === 'payment');
                const ordinalsAccount = accounts.find((acc) => acc.purpose === 'ordinals');
                const walletDetail = {
                    cardinal: (paymentAccount === null || paymentAccount === void 0 ? void 0 : paymentAccount.address) || '',
                    cardinalPubkey: (paymentAccount === null || paymentAccount === void 0 ? void 0 : paymentAccount.publicKey) || '',
                    ordinal: (ordinalsAccount === null || ordinalsAccount === void 0 ? void 0 : ordinalsAccount.address) || '',
                    ordinalPubkey: (ordinalsAccount === null || ordinalsAccount === void 0 ? void 0 : ordinalsAccount.publicKey) || '',
                    connected: true,
                    wallet: 'Xverse'
                };
                setTempWD(walletDetail);
                if (walletDetail.ordinal) {
                    const msg = getMessage(walletDetail.ordinal);
                    setPendingMessage(msg);
                    yield signMessage({ address: walletDetail.ordinal, message: msg, wallet: "Xverse" });
                }
            }),
            onCancel: () => {
                (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.USER_REJECTED, "User canceled Xverse wallet connection", {
                    severity: errorHandler_1.BWAErrorSeverity.MEDIUM,
                    context: {
                        operation: 'wallet_connection',
                        additionalData: { walletType: 'Xverse' }
                    }
                });
            },
        };
        yield (0, sats_connect_1.getAddress)(getAddressOptions);
    });
    const connectPhantom = () => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        if (!((_c = window.phantom) === null || _c === void 0 ? void 0 : _c.bitcoin)) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "Phantom wallet is not available or not installed", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'wallet_connection',
                    additionalData: { walletType: 'Phantom' }
                }
            });
        }
        const response = yield window.phantom.bitcoin.requestAccounts();
        if (!response || response.length === 0) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "No accounts found in Phantom wallet", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'wallet_connection',
                    additionalData: {
                        walletType: 'Phantom',
                        reason: 'no_accounts_available'
                    }
                }
            });
        }
        const address = response[0].address;
        const walletDetail = {
            cardinal: address,
            cardinalPubkey: response[0].publicKey || '',
            ordinal: address,
            ordinalPubkey: response[0].publicKey || '',
            connected: true,
            wallet: "Phantom",
        };
        setTempWD(walletDetail);
        const msg = getMessage(walletDetail.ordinal);
        setPendingMessage(msg);
        yield signMessage({ address: walletDetail.ordinal, message: msg, wallet: "Phantom" });
    });
    const connectOKX = () => __awaiter(void 0, void 0, void 0, function* () {
        var _d;
        if (!((_d = window.okxwallet) === null || _d === void 0 ? void 0 : _d.bitcoin)) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "OKX wallet is not available or not installed", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'wallet_connection',
                    additionalData: { walletType: 'OKX' }
                }
            });
        }
        const response = yield window.okxwallet.bitcoin.requestAccounts();
        if (!response || response.length === 0) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "No accounts found in OKX wallet", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'wallet_connection',
                    additionalData: {
                        walletType: 'OKX',
                        reason: 'no_accounts_available'
                    }
                }
            });
        }
        const address = response[0].address;
        const walletDetail = {
            cardinal: address,
            cardinalPubkey: response[0].publicKey || '',
            ordinal: address,
            ordinalPubkey: response[0].publicKey || '',
            connected: true,
            wallet: "Okx",
        };
        setTempWD(walletDetail);
        const msg = getMessage(walletDetail.ordinal);
        setPendingMessage(msg);
        yield signMessage({ address: walletDetail.ordinal, message: msg, wallet: "Okx" });
    });
    const connectMagicEden = (wallet) => __awaiter(void 0, void 0, void 0, function* () {
        const wallets = [...(meWallets || [])];
        if (!wallet && (!wallets || wallets.length === 0)) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "Magic Eden wallet is not available or not installed", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'wallet_connection',
                    additionalData: { walletType: 'Magic Eden' }
                }
            });
        }
        const targetWallet = wallet || wallets.find(w => w.name.includes("Magic Eden"));
        if (!targetWallet) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "Magic Eden wallet is not available or not found", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'wallet_connection',
                    additionalData: { walletType: 'Magic Eden' }
                }
            });
        }
        // Magic Eden wallet connection logic would go here
        // This is a placeholder - actual implementation depends on their API
        (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.VALIDATION_ERROR, "Magic Eden wallet connection is not yet implemented", {
            severity: errorHandler_1.BWAErrorSeverity.MEDIUM,
            context: {
                operation: 'wallet_connection',
                additionalData: {
                    walletType: 'Magic Eden',
                    reason: 'feature_not_implemented'
                }
            }
        });
    });
    // Initialize available wallets on mount
    (0, react_1.useEffect)(() => {
        setAvailableWallets(checkAvailableWallets());
    }, []);
    // Persist only after successful signature
    (0, react_1.useEffect)(() => {
        if (tempWD && signatureResult) {
            if (pendingMessage)
                localStorage.setItem("wallet-message", pendingMessage);
            localStorage.setItem("wallet-signature", signatureResult);
            localStorage.setItem("wallet-detail", JSON.stringify(tempWD));
            const lw = (tempWD.wallet || "").toLowerCase();
            localStorage.setItem("lastWallet", lw);
            dispatch((0, generalReducer_1.setWalletDetails)(tempWD));
            dispatch((0, generalReducer_1.setLastWallet)(lw));
            setTempWD(null);
            setPendingMessage(null);
        }
    }, [tempWD, signatureResult, pendingMessage, dispatch]);
    // Clear pending state on signing error
    (0, react_1.useEffect)(() => {
        if (signingError) {
            setTempWD(null);
        }
    }, [signingError]);
    // Auto-reconnect on page load if there was a previous connection
    (0, react_1.useEffect)(() => {
        const savedWallet = localStorage.getItem("lastWallet");
        const savedWalletDetails = localStorage.getItem("wallet-detail");
        const savedSignature = localStorage.getItem("wallet-signature");
        const savedMessage = localStorage.getItem("wallet-message");
        if (savedWallet && savedWalletDetails && savedSignature && savedMessage && !isConnected) {
            try {
                const walletDetail = JSON.parse(savedWalletDetails);
                const addressForVerification = (walletDetail === null || walletDetail === void 0 ? void 0 : walletDetail.ordinal) || (walletDetail === null || walletDetail === void 0 ? void 0 : walletDetail.cardinal) || "";
                const networkOk = (0, network_1.validateAddressesMatchNetwork)([addressForVerification], reduxNetwork);
                // TTL: 24 hours
                let freshEnough = true;
                try {
                    const m = /Issued At:\s*(.*)$/m.exec(savedMessage || "");
                    if (m && m[1]) {
                        const issued = Date.parse(m[1].trim());
                        if (!Number.isNaN(issued)) {
                            const ageMs = Date.now() - issued;
                            const maxAgeMs = 24 * 60 * 60 * 1000; // 24h
                            freshEnough = ageMs <= maxAgeMs;
                        }
                    }
                }
                catch (_a) { }
                const signatureOk = addressForVerification ? bip322_js_1.Verifier.verifySignature(addressForVerification, savedMessage, savedSignature) : false;
                if (networkOk && signatureOk && freshEnough) {
                    dispatch((0, generalReducer_1.setWalletDetails)(walletDetail));
                    dispatch((0, generalReducer_1.setLastWallet)(savedWallet));
                }
                else {
                    localStorage.removeItem("lastWallet");
                    localStorage.removeItem("wallet-detail");
                    localStorage.removeItem("wallet-signature");
                    localStorage.removeItem("wallet-message");
                }
            }
            catch (err) {
                console.error("Failed to restore wallet connection:", err);
                localStorage.removeItem("lastWallet");
                localStorage.removeItem("wallet-detail");
                localStorage.removeItem("wallet-signature");
                localStorage.removeItem("wallet-message");
            }
        }
    }, [isConnected, dispatch, reduxNetwork]);
    return {
        // Connection State
        isConnected,
        isLoading,
        error,
        signature,
        // Wallet Information
        currentWallet: walletDetails,
        lastWallet,
        availableWallets,
        meWallets,
        // Actions
        connect,
        disconnect,
        // Utilities
        checkAvailableWallets,
        refreshBalance,
    };
};
exports.useWalletConnect = useWalletConnect;
