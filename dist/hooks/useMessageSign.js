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
const SatsConnectNamespace = "sats-connect:";
const useMessageSign = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { wallets: testWallets } = (0, react_2.useWallets)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [result, setResult] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const signMessage = (0, react_1.useCallback)((options) => __awaiter(void 0, void 0, void 0, function* () {
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
                setLoading(true);
                const signMessageOptions = {
                    payload: {
                        network: {
                            type: options.network === "mainnet" ? "Mainnet" : "Testnet",
                        },
                        address: options.address,
                        message: options.message,
                    },
                    onFinish: (response) => {
                        dispatch((0, generalReducer_1.setSignature)(response));
                        setResult(response);
                        setLoading(false);
                    },
                    onCancel: () => {
                        setError(new Error("User canceled the operation"));
                        setLoading(false);
                    },
                };
                // Call the signMessageApi with the options
                //@ts-ignore
                yield (0, sats_connect_1.signMessage)(signMessageOptions);
            }
            else if (typeof window.unisat !== "undefined" &&
                options.wallet === "Unisat") {
                setLoading(true);
                try {
                    const sign = yield window.unisat.signMessage(options.message);
                    dispatch((0, generalReducer_1.setSignature)(sign));
                    setResult(sign);
                }
                catch (err) {
                    setError(err instanceof Error
                        ? err
                        : new Error("An error occurred during message signing"));
                }
                finally {
                    setLoading(false);
                }
            }
            else if (typeof window.btc !== "undefined" &&
                options.wallet === "Leather") {
                setLoading(true);
                try {
                    const sign = yield window.btc.request("signMessage", {
                        message: options.message,
                        paymentType: "p2tr",
                    });
                    dispatch((0, generalReducer_1.setSignature)(sign.result.signature));
                    setResult(sign.result.signature);
                }
                catch (err) {
                    setError(err instanceof Error
                        ? err
                        : new Error("An error occurred during message signing"));
                }
                finally {
                    setLoading(false);
                }
            }
            else if (options.wallet === "MagicEden") {
                setLoading(true);
                const wallet = testWallets.filter((a) => a.name === "Magic Eden")[0];
                const signMessageOptions = {
                    getProvider: () => __awaiter(void 0, void 0, void 0, function* () {
                        var _a;
                        return (_a = wallet.features[SatsConnectNamespace]) === null || _a === void 0 ? void 0 : _a.provider;
                    }),
                    payload: {
                        network: {
                            type: options.network === "mainnet"
                                ? sats_connect_1.BitcoinNetworkType.Mainnet
                                : sats_connect_1.BitcoinNetworkType.Testnet,
                        },
                        address: options.address,
                        message: options.message,
                    },
                    onFinish: (response) => {
                        dispatch((0, generalReducer_1.setSignature)(response));
                        setResult(response);
                        setLoading(false);
                    },
                    onCancel: () => {
                        setError(new Error("User canceled the operation"));
                        setLoading(false);
                    },
                };
                // Call the signMessageApi with the options
                //@ts-ignore
                yield (0, sats_connect_1.signMessage)(signMessageOptions);
            }
        }
        catch (err) {
            console.log({ err });
            setError(err instanceof Error ? err : new Error("An unknown error occurred"));
            setLoading(false);
            throw new Error("Error signing message");
        }
    }), []);
    return { signMessage, loading, result, error };
};
exports.useMessageSign = useMessageSign;
