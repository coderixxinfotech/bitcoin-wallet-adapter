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
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const sats_connect_1 = require("sats-connect"); // Renamed to avoid naming conflict
const generalReducer_1 = require("../stores/reducers/generalReducer");
const react_2 = require("@wallet-standard/react");
const bip322_js_1 = require("bip322-js");
const __1 = require("..");
const SatsConnectNamespace = "sats-connect:";
const useMessageSign = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { wallets: testWallets } = (0, react_2.useWallets)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [result, setResult] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const verifyAndSetResult = (address, message, response) => {
        const validity = bip322_js_1.Verifier.verifySignature(address, message, response);
        // console.log({ validity });
        if (!validity)
            throw new Error("Invalid signature");
        dispatch((0, generalReducer_1.setSignature)(response));
        setResult(response);
    };
    const signMessage = (0, react_1.useCallback)((options) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        setLoading(true);
        setResult(null);
        setError(null);
        if (!options.wallet) {
            setError(new Error("Wallet Not Connected"));
            setLoading(false);
            return;
        }
        try {
            if (options.wallet === "Xverse") {
                const signMessageOptions = {
                    payload: {
                        network: {
                            type: options.network.toLowerCase() === "mainnet"
                                ? "Mainnet"
                                : "Testnet",
                        },
                        address: options.address,
                        message: options.message,
                    },
                    onFinish: (response) => {
                        verifyAndSetResult(options.address, options.message, response);
                        setLoading(false);
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
                options.wallet === "Unisat") {
                const sign = yield window.unisat.signMessage(options.message);
                verifyAndSetResult(options.address, options.message, sign);
            }
            else if (typeof window.btc !== "undefined" &&
                options.wallet === "Leather") {
                const sign = yield window.btc.request("signMessage", {
                    message: options.message,
                    paymentType: "p2tr",
                    network: options.network.toLowerCase(),
                });
                verifyAndSetResult(options.address, options.message, sign.result.signature);
            }
            else if (typeof (window === null || window === void 0 ? void 0 : window.phantom) !== "undefined" &&
                options.wallet === "Phantom") {
                const message = new TextEncoder().encode(options.message);
                const { signature } = yield ((_b = (_a = window === null || window === void 0 ? void 0 : window.phantom) === null || _a === void 0 ? void 0 : _a.bitcoin) === null || _b === void 0 ? void 0 : _b.signMessage(options.address, message));
                const base64 = (0, __1.bytesToBase64)(signature);
                verifyAndSetResult(options.address, new TextDecoder().decode(message), base64);
            }
            // okx wallett
            else if (typeof (window === null || window === void 0 ? void 0 : window.okxwallet) !== "undefined" &&
                options.wallet === "Okx") {
                const signature = yield window.okxwallet.bitcoin.signMessage(options.message, "ecdsa");
                verifyAndSetResult(options.address, options.message, signature);
            }
            else if (options.wallet === "MagicEden") {
                const wallet = testWallets.filter((a) => a.name === "Magic Eden")[0];
                const signMessageOptions = {
                    getProvider: () => __awaiter(void 0, void 0, void 0, function* () {
                        var _c;
                        return (_c = wallet.features[SatsConnectNamespace]) === null || _c === void 0 ? void 0 : _c.provider;
                    }),
                    payload: {
                        network: {
                            type: options.network.toLowerCase() === "mainnet"
                                ? sats_connect_1.BitcoinNetworkType.Mainnet
                                : sats_connect_1.BitcoinNetworkType.Testnet,
                        },
                        address: options.address,
                        message: options.message,
                    },
                    onFinish: (response) => {
                        verifyAndSetResult(options.address, options.message, response);
                        setLoading(false);
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
                throw new Error("Unsupported wallet");
            }
        }
        catch (err) {
            console.log({ err });
            setError(err instanceof Error ? err : new Error("An unknown error occurred"));
        }
        finally {
            setLoading(false);
        }
    }), [dispatch, testWallets]);
    return { signMessage, loading, result, error };
};
exports.useMessageSign = useMessageSign;
