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
exports.useMessageSign = void 0;
// What happens in this file:
// - Exposes `useMessageSign` hook to sign messages with connected wallets
// - Reads selected network from Redux (no network param accepted)
// - Validates address/network mismatch and throws structured BWA errors
// - Uses centralized network mapping helpers for wallet SDKs
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const sats_connect_1 = require("sats-connect"); // Renamed to avoid naming conflict
const generalReducer_1 = require("../stores/reducers/generalReducer");
const react_2 = require("@wallet-standard/react");
const bip322_js_1 = require("bip322-js");
const __1 = require("..");
const errorHandler_1 = require("../utils/errorHandler");
const network_1 = require("../utils/network");
const SatsConnectNamespace = "sats-connect:";
const useMessageSign = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { wallets: testWallets } = (0, react_2.useWallets)();
    const reduxNetwork = (0, react_redux_1.useSelector)((s) => s.general.network);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [result, setResult] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const verifyAndSetResult = (address, message, response) => {
        const validity = bip322_js_1.Verifier.verifySignature(address, message, response);
        if (!validity) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.SIGNATURE_VERIFICATION_FAILED, "Invalid signature verification failed", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'message_signing_verification',
                    additionalData: {
                        address,
                        message: message.substring(0, 50) + '...' // Truncate for security
                    }
                }
            });
        }
        dispatch((0, generalReducer_1.setSignature)(response));
        setResult(response);
    };
    const signMessage = (0, react_1.useCallback)((options) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        setLoading(true);
        setResult(null);
        setError(null);
        if (!options.wallet) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_CONNECTED, "Wallet must be connected to sign messages", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    walletType: 'unknown',
                    operation: 'message_signing',
                    network: reduxNetwork
                }
            });
            return;
        }
        // Validate address vs selected network
        if (!(0, network_1.validateAddressesMatchNetwork)([options.address], reduxNetwork)) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.NETWORK_MISMATCH, "Selected network and address network do not match", {
                severity: errorHandler_1.BWAErrorSeverity.MEDIUM,
                context: {
                    walletType: options.wallet,
                    operation: 'message_signing',
                    network: reduxNetwork,
                    additionalData: { address: options.address }
                },
                recoverable: true
            });
        }
        try {
            const walletKey = options.wallet.toLowerCase();
            if (walletKey === "xverse") {
                const signMessageOptions = {
                    payload: {
                        network: { type: (0, network_1.toSatsConnectNetwork)(reduxNetwork) },
                        address: options.address,
                        message: options.message,
                    },
                    onFinish: (response) => {
                        try {
                            verifyAndSetResult(options.address, options.message, response);
                        }
                        catch (err) {
                            console.log({ err });
                            setError(err instanceof Error ? err : new Error("An unknown error occurred"));
                        }
                        finally {
                            setLoading(false);
                        }
                    },
                    onCancel: () => {
                        setError(new Error("User canceled the operation"));
                        setLoading(false);
                    },
                };
                //@ts-ignore
                yield (0, sats_connect_1.signMessage)(signMessageOptions);
            }
            else if (typeof window.unisat !== "undefined" &&
                walletKey === "unisat") {
                const sign = yield window.unisat.signMessage(options.message);
                verifyAndSetResult(options.address, options.message, sign);
            }
            else if (typeof window.btc !== "undefined" &&
                walletKey === "leather") {
                const sign = yield window.btc.request("signMessage", {
                    message: options.message,
                    paymentType: "p2tr",
                    network: reduxNetwork.toLowerCase(),
                });
                verifyAndSetResult(options.address, options.message, sign.result.signature);
            }
            else if (typeof (window === null || window === void 0 ? void 0 : window.phantom) !== "undefined" &&
                walletKey === "phantom") {
                const message = new TextEncoder().encode(options.message);
                const { signature } = yield ((_b = (_a = window === null || window === void 0 ? void 0 : window.phantom) === null || _a === void 0 ? void 0 : _a.bitcoin) === null || _b === void 0 ? void 0 : _b.signMessage(options.address, message));
                const base64 = (0, __1.bytesToBase64)(signature);
                verifyAndSetResult(options.address, new TextDecoder().decode(message), base64);
            }
            else if (typeof (window === null || window === void 0 ? void 0 : window.okxwallet) !== "undefined" &&
                walletKey === "okx") {
                const Okx = (0, network_1.getOkxProvider)(window, reduxNetwork, { fractal: options.fractal });
                if (!Okx) {
                    (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "OKX provider for selected network is not available", { context: { walletType: options.wallet, operation: 'message_signing', network: reduxNetwork } });
                }
                const signature = yield Okx.signMessage(options.message, "ecdsa");
                verifyAndSetResult(options.address, options.message, signature);
            }
            else if (walletKey === "magiceden") {
                const wallet = testWallets.filter((a) => a.name === "Magic Eden")[0];
                const signMessageOptions = {
                    getProvider: () => __awaiter(void 0, void 0, void 0, function* () {
                        var _c;
                        return (_c = wallet.features[SatsConnectNamespace]) === null || _c === void 0 ? void 0 : _c.provider;
                    }),
                    payload: {
                        network: { type: (0, network_1.toSatsConnectNetwork)(reduxNetwork) },
                        address: options.address,
                        message: options.message,
                    },
                    onFinish: (response) => {
                        try {
                            verifyAndSetResult(options.address, options.message, response);
                        }
                        catch (err) {
                            console.log({ err });
                            setError(err instanceof Error ? err : new Error("An unknown error occurred"));
                        }
                        finally {
                            setLoading(false);
                        }
                    },
                    onCancel: () => {
                        setError(new Error("User canceled the operation"));
                        setLoading(false);
                    },
                };
                //@ts-ignore
                yield (0, sats_connect_1.signMessage)(signMessageOptions);
            }
            else {
                (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.UNSUPPORTED_WALLET, `Unsupported wallet: ${options.wallet}`, {
                    severity: errorHandler_1.BWAErrorSeverity.HIGH,
                    context: {
                        walletType: options.wallet,
                        operation: 'message_signing',
                        network: reduxNetwork,
                        additionalData: {
                            supportedWallets: ['Xverse', 'Unisat', 'Leather', 'Phantom', 'Okx', 'MagicEden']
                        }
                    },
                    recoverable: true
                });
            }
        }
        catch (err) {
            console.log({ err });
            const wrappedError = err instanceof errorHandler_1.BWAError ? err : new errorHandler_1.BWAError(errorHandler_1.BWAErrorCode.MESSAGE_SIGNING_FAILED, err instanceof Error ? err.message : "An unknown error occurred during message signing", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    walletType: options.wallet,
                    operation: 'message_signing',
                    network: reduxNetwork
                },
                originalError: err instanceof Error ? err : undefined
            });
            setError(wrappedError);
        }
        finally {
            setLoading(false);
        }
    }), [dispatch, testWallets, reduxNetwork]);
    return { signMessage, loading, result, error };
};
exports.useMessageSign = useMessageSign;
