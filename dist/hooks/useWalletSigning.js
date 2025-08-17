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
exports.useWalletSigning = void 0;
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const react_2 = require("@wallet-standard/react");
const sats_connect_1 = require("sats-connect");
const bip322_js_1 = require("bip322-js");
const generalReducer_1 = require("../stores/reducers/generalReducer");
const notificationReducers_1 = require("../stores/reducers/notificationReducers");
const errorHandler_1 = require("../utils/errorHandler");
const SatsConnectNamespace = "sats-connect:";
/**
 * Headless hook for wallet signing operations
 * Provides message signing, transaction signing, and PSBT operations without UI
 */
const useWalletSigning = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { wallets: testWallets } = (0, react_2.useWallets)();
    const walletDetails = (0, react_redux_1.useSelector)((state) => state.general.walletDetails);
    const signature = (0, react_redux_1.useSelector)((state) => state.general.signature);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    /**
     * Sign a message with the connected wallet
     */
    const signMessage = (0, react_1.useCallback)((options) => __awaiter(void 0, void 0, void 0, function* () {
        if (!(walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.cardinal)) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_CONNECTED, "No wallet is currently connected for message signing", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'message_signing',
                    additionalData: { walletType: options.wallet }
                }
            });
        }
        setIsLoading(true);
        setError(null);
        try {
            let signedMessage = "";
            switch (options.wallet.toLowerCase()) {
                case "unisat":
                    signedMessage = yield signMessageUnisat(options);
                    break;
                case "leather":
                    signedMessage = yield signMessageLeather(options);
                    break;
                case "xverse":
                    signedMessage = yield signMessageXverse(options);
                    break;
                case "phantom":
                    signedMessage = yield signMessagePhantom(options);
                    break;
                case "okx":
                    signedMessage = yield signMessageOKX(options);
                    break;
                default:
                    // Try Magic Eden wallets
                    signedMessage = yield signMessageMagicEden(options);
                    break;
            }
            // Store signature in Redux
            dispatch((0, generalReducer_1.setSignature)(signedMessage));
            dispatch((0, notificationReducers_1.addNotification)({
                id: Date.now(),
                message: "Message signed successfully!",
                open: true,
                severity: "success",
            }));
            return signedMessage;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('Signing failed');
            setError(error);
            dispatch((0, notificationReducers_1.addNotification)({
                id: Date.now(),
                message: err instanceof Error ? err.message : "Failed to sign message",
                open: true,
                severity: "error",
            }));
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    }), [walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.cardinal, dispatch]);
    /**
     * Verify a message signature
     */
    const verifyMessage = (0, react_1.useCallback)((message, signature, address) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return bip322_js_1.Verifier.verifySignature(address, message, signature);
        }
        catch (err) {
            console.error("Signature verification failed:", err);
            return false;
        }
    }), []);
    /**
     * Sign a transaction
     */
    const signTransaction = (0, react_1.useCallback)((options) => __awaiter(void 0, void 0, void 0, function* () {
        if (!(walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.cardinal)) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_CONNECTED, "No wallet is currently connected for transaction signing", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'transaction_signing',
                    additionalData: { walletType: options.wallet }
                }
            });
        }
        setIsLoading(true);
        setError(null);
        try {
            let txId = "";
            switch (options.wallet.toLowerCase()) {
                case "unisat":
                    txId = yield signTransactionUnisat(options);
                    break;
                case "leather":
                    txId = yield signTransactionLeather(options);
                    break;
                case "xverse":
                    txId = yield signTransactionXverse(options);
                    break;
                case "phantom":
                    txId = yield signTransactionPhantom(options);
                    break;
                case "okx":
                    txId = yield signTransactionOKX(options);
                    break;
                default:
                    (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.VALIDATION_ERROR, `Transaction signing is not supported for ${options.wallet} wallet`, {
                        severity: errorHandler_1.BWAErrorSeverity.HIGH,
                        context: {
                            operation: 'transaction_signing',
                            additionalData: {
                                walletType: options.wallet,
                                supportedWallets: ['unisat', 'leather', 'xverse', 'phantom', 'okx']
                            }
                        }
                    });
            }
            dispatch((0, notificationReducers_1.addNotification)({
                id: Date.now(),
                message: `Transaction signed successfully. TX ID: ${txId}`,
                open: true,
                severity: "success",
            }));
            return txId;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('Transaction signing failed');
            setError(error);
            dispatch((0, notificationReducers_1.addNotification)({
                id: Date.now(),
                message: `Failed to sign transaction: ${error.message}`,
                open: true,
                severity: "error",
            }));
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    }), [walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.cardinal, dispatch]);
    /**
     * Sign a PSBT (Partially Signed Bitcoin Transaction)
     */
    const signPSBT = (0, react_1.useCallback)((psbtHex_1, ...args_1) => __awaiter(void 0, [psbtHex_1, ...args_1], void 0, function* (psbtHex, options = {}) {
        if (!(walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.wallet)) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_CONNECTED, "No wallet is currently connected for PSBT signing", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'psbt_signing'
                }
            });
        }
        setIsLoading(true);
        setError(null);
        try {
            let result = "";
            switch (walletDetails.wallet.toLowerCase()) {
                case "unisat":
                    result = yield signPSBTUnisat(psbtHex, options.broadcast);
                    break;
                case "leather":
                    result = yield signPSBTLeather(psbtHex, options.broadcast);
                    break;
                case "xverse":
                    result = yield signPSBTXverse(psbtHex, options.broadcast);
                    break;
                default:
                    (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.VALIDATION_ERROR, `PSBT signing is not supported for ${walletDetails.wallet} wallet`, {
                        severity: errorHandler_1.BWAErrorSeverity.HIGH,
                        context: {
                            operation: 'psbt_signing',
                            additionalData: {
                                walletType: walletDetails.wallet,
                                supportedWallets: ['unisat', 'leather', 'xverse']
                            }
                        }
                    });
            }
            dispatch((0, notificationReducers_1.addNotification)({
                id: Date.now(),
                message: options.broadcast ? "PSBT signed and broadcast" : "PSBT signed successfully",
                open: true,
                severity: "success",
            }));
            return result;
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error('PSBT signing failed');
            setError(error);
            dispatch((0, notificationReducers_1.addNotification)({
                id: Date.now(),
                message: `Failed to sign PSBT: ${error.message}`,
                open: true,
                severity: "error",
            }));
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    }), [walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.wallet, dispatch]);
    /**
     * Clear the stored signature
     */
    const clearSignature = (0, react_1.useCallback)(() => {
        dispatch((0, generalReducer_1.setSignature)(""));
        setError(null);
    }, [dispatch]);
    // Wallet-specific message signing implementations
    const signMessageUnisat = (options) => __awaiter(void 0, void 0, void 0, function* () {
        if (!window.unisat) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "Unisat wallet is not available or not installed", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'message_signing',
                    additionalData: { walletType: 'Unisat' }
                }
            });
        }
        return yield window.unisat.signMessage(options.message, "ecdsa");
    });
    const signMessageLeather = (options) => __awaiter(void 0, void 0, void 0, function* () {
        if (!window.LeatherProvider) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "Leather wallet is not available or not installed", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'message_signing',
                    additionalData: { walletType: 'Leather' }
                }
            });
        }
        const response = yield window.LeatherProvider.request("signMessage", {
            message: options.message,
            paymentType: "p2wpkh",
        });
        return response.result.signature;
    });
    const signMessageXverse = (options) => __awaiter(void 0, void 0, void 0, function* () {
        const signMessageOptions = {
            payload: {
                network: {
                    type: options.network === "mainnet"
                        ? sats_connect_1.BitcoinNetworkType.Mainnet
                        : sats_connect_1.BitcoinNetworkType.Testnet,
                },
                address: options.address,
                message: options.message,
            },
            onFinish: (response) => response,
            onCancel: () => {
                (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.USER_REJECTED, "User canceled message signing", {
                    severity: errorHandler_1.BWAErrorSeverity.MEDIUM,
                    context: {
                        operation: 'message_signing',
                        additionalData: { walletType: 'Xverse' }
                    }
                });
            },
        };
        return new Promise((resolve, reject) => {
            signMessageOptions.onFinish = (response) => {
                resolve(response);
            };
            signMessageOptions.onCancel = (() => {
                reject(new Error("User canceled message signing"));
            });
            (0, sats_connect_1.signMessage)(signMessageOptions);
        });
    });
    const signMessagePhantom = (options) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!((_a = window.phantom) === null || _a === void 0 ? void 0 : _a.bitcoin)) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "Phantom wallet is not available for message signing", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'message_signing',
                    additionalData: { walletType: 'Phantom' }
                }
            });
        }
        const response = yield window.phantom.bitcoin.signMessage(options.address, options.message);
        return response.signature;
    });
    const signMessageOKX = (options) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!((_a = window.okxwallet) === null || _a === void 0 ? void 0 : _a.bitcoin)) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "OKX wallet is not available for message signing", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'message_signing',
                    additionalData: { walletType: 'OKX' }
                }
            });
        }
        const response = yield window.okxwallet.bitcoin.signMessage(options.message, "ecdsa");
        return response;
    });
    const signMessageMagicEden = (options) => __awaiter(void 0, void 0, void 0, function* () {
        const meWallet = testWallets.find((wallet) => wallet.name.includes("Magic Eden"));
        if (!meWallet) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "Magic Eden wallet is not available for message signing", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'message_signing',
                    additionalData: { walletType: 'Magic Eden' }
                }
            });
        }
        // Magic Eden wallet signing implementation would go here
        (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.MESSAGE_SIGNING_FAILED, "Magic Eden message signing feature is not yet implemented", {
            severity: errorHandler_1.BWAErrorSeverity.MEDIUM,
            context: {
                operation: 'message_signing',
                additionalData: {
                    walletType: 'Magic Eden',
                    reason: 'feature_not_implemented'
                }
            }
        });
    });
    // Transaction signing implementations (simplified - would need full implementation)
    const signTransactionUnisat = (options) => __awaiter(void 0, void 0, void 0, function* () {
        if (!window.unisat) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "Unisat wallet is not available for transaction signing", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'transaction_signing',
                    additionalData: { walletType: 'Unisat' }
                }
            });
        }
        // This would need proper transaction construction
        (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.TRANSACTION_SIGNING_FAILED, "Unisat transaction signing feature is not yet implemented", {
            severity: errorHandler_1.BWAErrorSeverity.MEDIUM,
            context: {
                operation: 'transaction_signing',
                additionalData: {
                    walletType: 'Unisat',
                    reason: 'feature_not_implemented'
                }
            }
        });
    });
    const signTransactionLeather = (options) => __awaiter(void 0, void 0, void 0, function* () {
        if (!window.LeatherProvider) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "Leather wallet is not available for transaction signing", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'transaction_signing',
                    additionalData: { walletType: 'Leather' }
                }
            });
        }
        // This would need proper transaction construction
        (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.TRANSACTION_SIGNING_FAILED, "Leather transaction signing feature is not yet implemented", {
            severity: errorHandler_1.BWAErrorSeverity.MEDIUM,
            context: {
                operation: 'transaction_signing',
                additionalData: {
                    walletType: 'Leather',
                    reason: 'feature_not_implemented'
                }
            }
        });
    });
    const signTransactionXverse = (options) => __awaiter(void 0, void 0, void 0, function* () {
        // This would need proper sats-connect transaction signing
        (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.TRANSACTION_SIGNING_FAILED, "Xverse transaction signing feature is not yet implemented", {
            severity: errorHandler_1.BWAErrorSeverity.MEDIUM,
            context: {
                operation: 'transaction_signing',
                additionalData: {
                    walletType: 'Xverse',
                    reason: 'feature_not_implemented'
                }
            }
        });
    });
    const signTransactionPhantom = (options) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!((_a = window.phantom) === null || _a === void 0 ? void 0 : _a.bitcoin)) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "Phantom wallet is not available for transaction signing", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'transaction_signing',
                    additionalData: { walletType: 'Phantom' }
                }
            });
        }
        // This would need proper transaction construction
        (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.TRANSACTION_SIGNING_FAILED, "Phantom transaction signing feature is not yet implemented", {
            severity: errorHandler_1.BWAErrorSeverity.MEDIUM,
            context: {
                operation: 'transaction_signing',
                additionalData: {
                    walletType: 'Phantom',
                    reason: 'feature_not_implemented'
                }
            }
        });
    });
    const signTransactionOKX = (options) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!((_a = window.okxwallet) === null || _a === void 0 ? void 0 : _a.bitcoin)) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "OKX wallet is not available or not installed", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'transaction_signing',
                    additionalData: { walletType: 'OKX' }
                }
            });
        }
        // This would need proper transaction construction
        (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.VALIDATION_ERROR, "Transaction signing implementation is not yet available for OKX wallet", {
            severity: errorHandler_1.BWAErrorSeverity.MEDIUM,
            context: {
                operation: 'transaction_signing',
                additionalData: {
                    walletType: 'OKX',
                    reason: 'feature_not_implemented'
                }
            }
        });
    });
    // PSBT signing implementations (simplified - would need full implementation)
    const signPSBTUnisat = (psbtHex, broadcast) => __awaiter(void 0, void 0, void 0, function* () {
        if (!window.unisat) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "Unisat wallet is not available or not installed", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'psbt_signing',
                    additionalData: { walletType: 'Unisat' }
                }
            });
        }
        const signedPSBT = yield window.unisat.signPsbt(psbtHex);
        if (broadcast) {
            return yield window.unisat.pushPsbt(signedPSBT);
        }
        return signedPSBT;
    });
    const signPSBTLeather = (psbtHex, broadcast) => __awaiter(void 0, void 0, void 0, function* () {
        if (!window.LeatherProvider) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "Leather wallet is not available or not installed", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'psbt_signing',
                    additionalData: { walletType: 'Leather' }
                }
            });
        }
        const response = yield window.LeatherProvider.request("signPsbt", {
            hex: psbtHex,
            allowedSighash: [0x01, 0x02, 0x03, 0x81, 0x82, 0x83],
        });
        if (broadcast) {
            // Would need to broadcast the signed PSBT
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.VALIDATION_ERROR, "PSBT broadcasting is not yet implemented for Leather wallet", {
                severity: errorHandler_1.BWAErrorSeverity.MEDIUM,
                context: {
                    operation: 'psbt_broadcasting',
                    additionalData: {
                        walletType: 'Leather',
                        reason: 'feature_not_implemented'
                    }
                }
            });
        }
        return response.result.hex;
    });
    const signPSBTXverse = (psbtHex, broadcast) => __awaiter(void 0, void 0, void 0, function* () {
        // This would need proper sats-connect PSBT signing implementation
        (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.VALIDATION_ERROR, "PSBT signing implementation is not yet available for Xverse wallet", {
            severity: errorHandler_1.BWAErrorSeverity.MEDIUM,
            context: {
                operation: 'psbt_signing',
                additionalData: {
                    walletType: 'Xverse',
                    reason: 'feature_not_implemented'
                }
            }
        });
    });
    return {
        // Signing State
        isLoading,
        error,
        lastSignature: signature,
        // Message Signing
        signMessage,
        verifyMessage,
        // Transaction Signing
        signTransaction,
        // PSBT Signing
        signPSBT,
        // Utilities
        clearSignature,
    };
};
exports.useWalletSigning = useWalletSigning;
