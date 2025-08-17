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
exports.useWalletBalance = void 0;
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const errorHandler_1 = require("../utils/errorHandler");
/**
 * Headless hook for wallet balance management
 * Provides balance fetching and formatting utilities without UI
 */
const useWalletBalance = () => {
    var _a;
    const walletDetails = (0, react_redux_1.useSelector)((state) => state.general.walletDetails);
    const bitcoinPriceState = (0, react_redux_1.useSelector)((state) => state.bitcoinPrice);
    const btcPrice = ((_a = bitcoinPriceState.data) === null || _a === void 0 ? void 0 : _a.averagePrice) || null;
    const [balance, setBalance] = (0, react_1.useState)({
        btc: null,
        usd: null,
        confirmed: null,
        unconfirmed: null,
        total: null,
    });
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    /**
     * Fetch balance from the connected wallet
     */
    const fetchBalance = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!(walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.cardinal) || !(walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.wallet)) {
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            let walletBalance = {};
            switch (walletDetails.wallet.toLowerCase()) {
                case "unisat":
                    walletBalance = yield fetchUnisatBalance();
                    break;
                case "leather":
                    walletBalance = yield fetchLeatherBalance();
                    break;
                case "phantom":
                    walletBalance = yield fetchPhantomBalance();
                    break;
                case "okx":
                    walletBalance = yield fetchOKXBalance();
                    break;
                default:
                    // For other wallets, use a generic API or blockchain explorer
                    walletBalance = yield fetchGenericBalance();
                    break;
            }
            // Calculate USD value if BTC amount and price are available
            if (walletBalance.btc && btcPrice) {
                walletBalance.usd = walletBalance.btc * btcPrice;
            }
            setBalance(prevBalance => (Object.assign(Object.assign({}, prevBalance), walletBalance)));
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to fetch balance');
            setError(error);
            console.error("Balance fetch error:", error);
        }
        finally {
            setIsLoading(false);
        }
    }), [walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.cardinal, walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.wallet, btcPrice]);
    /**
     * Refresh BTC price from external API
     * Note: This now uses the centralized bitcoin price Redux state
     */
    const refreshPrice = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // The bitcoin price is now managed centrally by the useBitcoinPrice hook
            // This function is kept for backward compatibility but doesn't need to do anything
            console.log("Bitcoin price is now managed by the centralized Redux state");
        }
        catch (err) {
            console.error("Failed to refresh BTC price:", err);
        }
    }), []);
    /**
     * Format balance amount for display
     */
    const formatBalance = (0, react_1.useCallback)((amount, decimals = 8) => {
        if (amount === 0)
            return "0";
        // For very small amounts, show more decimals
        if (amount < 0.001) {
            return amount.toFixed(decimals);
        }
        // For larger amounts, show fewer decimals
        if (amount >= 1) {
            return amount.toFixed(4);
        }
        return amount.toFixed(6);
    }, []);
    /**
     * Convert BTC amount to USD
     */
    const convertToUSD = (0, react_1.useCallback)((btcAmount) => {
        if (!btcPrice || btcAmount === 0)
            return null;
        return btcAmount * btcPrice;
    }, [btcPrice]);
    // Wallet-specific balance fetching methods
    const fetchUnisatBalance = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!window.unisat) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "Unisat wallet is not available for balance fetch", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'balance_fetch',
                    additionalData: { walletType: 'Unisat' }
                }
            });
        }
        const balance = yield window.unisat.getBalance();
        return {
            btc: balance.total / 100000000, // Convert satoshis to BTC
            confirmed: balance.confirmed / 100000000,
            unconfirmed: balance.unconfirmed / 100000000,
            total: balance.total / 100000000,
        };
    });
    const fetchLeatherBalance = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!window.LeatherProvider) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "Leather wallet is not available for balance fetch", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'balance_fetch',
                    additionalData: { walletType: 'Leather' }
                }
            });
        }
        try {
            // Try the getBalance method first, but fall back to address-based lookup if it fails
            try {
                const response = yield window.LeatherProvider.request("getBalance");
                if (response === null || response === void 0 ? void 0 : response.result) {
                    const btcBalance = response.result.find((balance) => balance.symbol === "BTC" || balance.currency === "BTC");
                    if (btcBalance) {
                        const btcAmount = parseFloat(btcBalance.total || btcBalance.amount || btcBalance.balance) / 100000000;
                        return {
                            btc: btcAmount,
                            total: btcAmount,
                            confirmed: btcAmount, // Leather doesn't separate confirmed/unconfirmed
                            unconfirmed: 0,
                        };
                    }
                }
            }
            catch (balanceError) {
                console.warn("Leather getBalance method failed, trying fallback:", balanceError);
            }
            // Fallback: Use generic balance fetching with the wallet address
            if (walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.cardinal) {
                console.log("Using fallback balance fetch for Leather wallet");
                return yield fetchGenericBalance();
            }
            // If all else fails, return zero balance instead of throwing an error
            console.warn("Could not fetch Leather wallet balance, returning zero");
            return {
                btc: 0,
                total: 0,
                confirmed: 0,
                unconfirmed: 0,
            };
        }
        catch (err) {
            console.error("Leather balance fetch error:", err);
            // Return zero balance instead of throwing to prevent UI breaking
            return {
                btc: 0,
                total: 0,
                confirmed: 0,
                unconfirmed: 0,
            };
        }
    });
    const fetchPhantomBalance = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!((_a = window.phantom) === null || _a === void 0 ? void 0 : _a.bitcoin)) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "Phantom wallet is not available for balance fetch", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'balance_fetch',
                    additionalData: { walletType: 'Phantom' }
                }
            });
        }
        try {
            // Phantom may not have a direct balance API, so we might need to use a blockchain explorer
            return yield fetchGenericBalance();
        }
        catch (err) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.NETWORK_ERROR, "Failed to fetch Phantom wallet balance", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'balance_fetch',
                    additionalData: {
                        walletType: 'Phantom',
                        originalError: String(err)
                    }
                }
            });
        }
    });
    const fetchOKXBalance = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!((_a = window.okxwallet) === null || _a === void 0 ? void 0 : _a.bitcoin)) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "OKX wallet is not available for balance fetch", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'balance_fetch',
                    additionalData: { walletType: 'OKX' }
                }
            });
        }
        try {
            // OKX may not have a direct balance API, so we might need to use a blockchain explorer
            return yield fetchGenericBalance();
        }
        catch (err) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.NETWORK_ERROR, "Failed to fetch OKX wallet balance", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'balance_fetch',
                    additionalData: {
                        walletType: 'OKX',
                        originalError: String(err)
                    }
                }
            });
        }
    });
    const fetchGenericBalance = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!(walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.cardinal)) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.VALIDATION_ERROR, "No wallet address available for balance fetch", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'balance_fetch',
                    additionalData: { reason: 'no_wallet_address' }
                }
            });
        }
        try {
            // Use a blockchain explorer API (e.g., BlockCypher, Mempool.space)
            // This is a placeholder - you'd implement actual API calls here
            // Example using BlockCypher API (requires API key for production)
            const response = yield fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${walletDetails.cardinal}/balance`);
            if (!response.ok) {
                (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.NETWORK_ERROR, "Blockchain API request failed during balance fetch", {
                    severity: errorHandler_1.BWAErrorSeverity.HIGH,
                    context: {
                        operation: 'balance_fetch',
                        additionalData: {
                            apiStatus: response.status,
                            apiUrl: 'blockcypher.com'
                        }
                    }
                });
            }
            const data = yield response.json();
            return {
                btc: data.balance / 100000000, // Convert satoshis to BTC
                confirmed: data.balance / 100000000,
                unconfirmed: data.unconfirmed_balance / 100000000,
                total: (data.balance + data.unconfirmed_balance) / 100000000,
            };
        }
        catch (err) {
            // Fallback: return zero balance rather than failing completely
            console.warn("Failed to fetch balance from blockchain API:", err);
            return {
                btc: 0,
                confirmed: 0,
                unconfirmed: 0,
                total: 0,
            };
        }
    });
    // Auto-fetch balance when wallet connects
    (0, react_1.useEffect)(() => {
        if ((walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.cardinal) && (walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.connected)) {
            fetchBalance();
        }
        else {
            // Reset balance when wallet disconnects
            setBalance({
                btc: null,
                usd: null,
                confirmed: null,
                unconfirmed: null,
                total: null,
            });
            setError(null);
        }
    }, [walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.cardinal, walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.connected, fetchBalance]);
    // Update USD value when BTC price changes
    (0, react_1.useEffect)(() => {
        if (balance.btc && btcPrice) {
            setBalance(prev => (Object.assign(Object.assign({}, prev), { usd: prev.btc ? prev.btc * btcPrice : null })));
        }
    }, [balance.btc, btcPrice]);
    return {
        // Balance State
        balance,
        btcPrice,
        isLoading,
        error,
        // Actions
        fetchBalance,
        refreshPrice,
        // Utilities
        formatBalance,
        convertToUSD,
    };
};
exports.useWalletBalance = useWalletBalance;
