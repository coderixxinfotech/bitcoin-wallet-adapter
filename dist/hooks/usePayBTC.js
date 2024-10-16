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
exports.usePayBTC = void 0;
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const sats_connect_1 = require("sats-connect");
const react_2 = require("@wallet-standard/react");
const notificationReducers_1 = require("../stores/reducers/notificationReducers");
const SatsConnectNamespace = "sats-connect:";
const usePayBTC = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { wallets: testWallets } = (0, react_2.useWallets)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [result, setResult] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const walletDetails = (0, react_redux_1.useSelector)((state) => state.general.walletDetails);
    const lastWallet = (0, react_redux_1.useSelector)((state) => state.general.lastWallet);
    const payBTC = (0, react_1.useCallback)((options) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        setLoading(true);
        setResult(null);
        setError(null);
        if (!(walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.connected)) {
            setError(new Error("Wallet not connected"));
            setLoading(false);
            return;
        }
        try {
            let txid;
            switch (options.wallet) {
                case "Leather":
                    //@ts-ignore
                    const resp = yield ((_a = window.btc) === null || _a === void 0 ? void 0 : _a.request("sendTransfer", {
                        address: options.address,
                        amount: options.amount,
                    }));
                    txid = resp === null || resp === void 0 ? void 0 : resp.id;
                    break;
                case "Xverse":
                    const sendBtcOptions = {
                        payload: {
                            network: {
                                type: options.network === "mainnet" ? "Mainnet" : "Testnet",
                            },
                            recipients: [
                                {
                                    address: options.address,
                                    amountSats: options.amount,
                                },
                            ],
                            senderAddress: walletDetails.cardinal,
                        },
                        onFinish: (response) => {
                            return response;
                        },
                        onCancel: () => {
                            throw Error("Cancelled");
                        },
                    };
                    //@ts-ignore
                    txid = yield (0, sats_connect_1.sendBtcTransaction)(sendBtcOptions);
                    break;
                case "MagicEden":
                    const wallet = testWallets.filter((a) => a.name === "Magic Eden")[0];
                    // TODO: Implement Magic Eden wallet BTC payment
                    const sendBtcMEOptions = {
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
                            recipients: [
                                {
                                    address: options.address,
                                    amountSats: BigInt(options.amount),
                                },
                            ],
                            senderAddress: walletDetails.cardinal,
                        },
                        onFinish: (response) => {
                            return response;
                        },
                        onCancel: () => {
                            throw Error("Cancelled");
                        },
                    };
                    //@ts-ignore
                    txid = yield (0, sats_connect_1.sendBtcTransaction)(sendBtcMEOptions);
                    break;
                case "Unisat":
                    //@ts-ignore
                    txid = yield window.unisat.sendBitcoin(options.address, options.amount);
                    break;
                case "Phantom":
                    // TODO: Implement Phantom wallet BTC payment
                    throw new Error("Phantom wallet BTC payment not implemented");
                case "Okx":
                    const Okx = options.fractal
                        ? window.okxwallet.fractalBitcoin
                        : options.network === "testnet"
                            ? window.okxwallet.bitcoinTestnet
                            : window.okxwallet.bitcoin;
                    txid = yield Okx.bitcoin.sendBitcoin(options.address, options.amount);
                    // TODO: Implement OKX wallet BTC payment
                    break;
                default:
                    throw new Error("Unsupported wallet");
            }
            setResult(txid);
        }
        catch (err) {
            console.log("PAY ERROR:", err);
            dispatch((0, notificationReducers_1.addNotification)({
                id: new Date().valueOf(),
                message: ((_b = err === null || err === void 0 ? void 0 : err.error) === null || _b === void 0 ? void 0 : _b.message) || (err === null || err === void 0 ? void 0 : err.message) || err,
                open: true,
                severity: "error",
            }));
            setError(err instanceof Error ? err : new Error("An unknown error occurred"));
        }
        finally {
            setLoading(false);
        }
    }), [dispatch, walletDetails, lastWallet]);
    return { payBTC, loading, result, error };
};
exports.usePayBTC = usePayBTC;
