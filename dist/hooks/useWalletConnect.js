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
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const react_2 = require("@wallet-standard/react");
const errorHandler_1 = require("../utils/errorHandler");
const sats_connect_1 = require("sats-connect");
const generalReducer_1 = require("../stores/reducers/generalReducer");
const SatsConnectNamespace = "sats-connect:";
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
    // Local State
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [availableWallets, setAvailableWallets] = (0, react_1.useState)([]);
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
            // Store the last connected wallet
            localStorage.setItem("lastWallet", walletType);
            dispatch((0, generalReducer_1.setLastWallet)(walletType));
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
        localStorage.removeItem("walletDetails");
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
        if (((walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.cardinal) || (walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.ordinal)) && lastWallet) {
            try {
                // Bitcoin price fetching is now handled centrally
                console.log("Bitcoin price is managed centrally by the Redux state");
            }
            catch (err) {
                console.error("Failed to refresh balance:", err);
            }
        }
    }), [walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.cardinal, walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.ordinal, lastWallet, dispatch]);
    // Wallet-specific connection methods
    const connectLeather = () => __awaiter(void 0, void 0, void 0, function* () {
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
        const btcAddress = response.result.addresses.find((addr) => addr.symbol === "BTC");
        if (!btcAddress) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "No Bitcoin address found in Leather wallet", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'wallet_connection',
                    additionalData: {
                        walletType: 'Leather',
                        addressType: 'BTC'
                    }
                }
            });
        }
        const walletDetail = {
            cardinal: btcAddress.address,
            cardinalPubkey: btcAddress.publicKey || '',
            ordinal: btcAddress.address,
            ordinalPubkey: btcAddress.publicKey || '',
            connected: true,
            wallet: "Leather",
        };
        dispatch((0, generalReducer_1.setWalletDetails)(walletDetail));
        localStorage.setItem("walletDetails", JSON.stringify(walletDetail));
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
            console.warn("Could not get public key from Unisat:", err);
        }
        const walletDetail = {
            cardinal: address,
            cardinalPubkey: publicKey || '',
            ordinal: address,
            ordinalPubkey: publicKey || '',
            connected: true,
            wallet: "Unisat",
        };
        dispatch((0, generalReducer_1.setWalletDetails)(walletDetail));
        localStorage.setItem("walletDetails", JSON.stringify(walletDetail));
    });
    const connectXverse = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (options = {}) {
        const getAddressOptions = {
            payload: {
                purposes: purposes,
                message: "Address for receiving Ordinals and payments",
                network: {
                    type: options.network || sats_connect_1.BitcoinNetworkType.Mainnet,
                },
            },
            onFinish: (response) => {
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
                dispatch((0, generalReducer_1.setWalletDetails)(walletDetail));
                localStorage.setItem("walletDetails", JSON.stringify(walletDetail));
            },
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
        var _a;
        if (!((_a = window.phantom) === null || _a === void 0 ? void 0 : _a.bitcoin)) {
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
        dispatch((0, generalReducer_1.setWalletDetails)(walletDetail));
        localStorage.setItem("wallet-detail", JSON.stringify(walletDetail));
    });
    const connectOKX = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!((_a = window.okxwallet) === null || _a === void 0 ? void 0 : _a.bitcoin)) {
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
            wallet: "OKX",
        };
        dispatch((0, generalReducer_1.setWalletDetails)(walletDetail));
        localStorage.setItem("wallet-detail", JSON.stringify(walletDetail));
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
    // Auto-reconnect on page load if there was a previous connection
    (0, react_1.useEffect)(() => {
        const savedWallet = localStorage.getItem("lastWallet");
        const savedWalletDetails = localStorage.getItem("wallet-detail");
        if (savedWallet && savedWalletDetails && !isConnected) {
            try {
                const walletDetail = JSON.parse(savedWalletDetails);
                dispatch((0, generalReducer_1.setWalletDetails)(walletDetail));
                dispatch((0, generalReducer_1.setLastWallet)(savedWallet));
            }
            catch (err) {
                console.error("Failed to restore wallet connection:", err);
                localStorage.removeItem("lastWallet");
                localStorage.removeItem("wallet-detail");
            }
        }
    }, [isConnected, dispatch]);
    return {
        // Connection State
        isConnected,
        isLoading,
        error,
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
