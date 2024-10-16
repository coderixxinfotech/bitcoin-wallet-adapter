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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePayBTC = void 0;
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const sats_connect_1 = require("sats-connect");
const react_2 = require("@wallet-standard/react");
const notificationReducers_1 = require("../stores/reducers/notificationReducers");
const sats_connect_v2_1 = __importDefault(require("sats-connect-v2"));
const SatsConnectNamespace = "sats-connect:";
const usePayBTC = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { wallets: testWallets } = (0, react_2.useWallets)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [result, setResult] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const walletDetails = (0, react_redux_1.useSelector)((state) => state.general.walletDetails);
    const SetResult = (response) => {
        setResult(response);
    };
    const handleError = (err) => {
        console.error("PAY ERROR:", err);
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        dispatch((0, notificationReducers_1.addNotification)({
            id: Date.now(),
            message: errorMessage,
            open: true,
            severity: "error",
        }));
        setError(new Error(errorMessage));
    };
    const payBTC = (0, react_1.useCallback)((options) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        setLoading(true);
        setResult(null);
        setError(null);
        if (!(walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.connected)) {
            setError(new Error("Wallet not connected"));
            setLoading(false);
            return;
        }
        console.log({ options });
        try {
            let txid;
            switch (walletDetails.wallet) {
                case "Leather":
                    const resp = yield ((_a = window.btc) === null || _a === void 0 ? void 0 : _a.request("sendTransfer", {
                        address: options.address,
                        amount: options.amount,
                    }));
                    txid = resp === null || resp === void 0 ? void 0 : resp.result.txid;
                    break;
                case "Xverse":
                    const response = yield sats_connect_v2_1.default.request("sendTransfer", {
                        recipients: [
                            {
                                address: options.address,
                                amount: Number(options.amount),
                            },
                        ],
                    });
                    console.log({ response });
                    txid = response.result.txid;
                    break;
                case "MagicEden":
                    const wallet = walletDetails.wallet === "MagicEden"
                        ? testWallets.find((a) => a.name === "Magic Eden")
                        : undefined;
                    const sendBtcOptions = Object.assign(Object.assign({}, (walletDetails.wallet === "MagicEden" && {
                        getProvider: () => __awaiter(void 0, void 0, void 0, function* () {
                            var _b;
                            return (_b = wallet.features[SatsConnectNamespace]) === null || _b === void 0 ? void 0 : _b.provider;
                        }),
                    })), { payload: {
                            network: {
                                type: options.network === "mainnet"
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
                        }, onFinish: (response) => {
                            console.log({ response });
                            SetResult(response);
                            setLoading(false);
                            if (typeof response === "string") {
                                txid = response;
                            }
                            else if (response && typeof response.txid === "string") {
                                txid = response.txid;
                            }
                            else {
                                throw new Error("Invalid response format");
                            }
                        }, onCancel: () => {
                            // throw new Error("Transaction cancelled");
                            console.log("Cancelled ");
                        } });
                    txid = (yield (0, sats_connect_1.sendBtcTransaction)(sendBtcOptions));
                    console.log({ txid });
                    break;
                case "Unisat":
                    txid = yield window.unisat.sendBitcoin(options.address, options.amount);
                    break;
                case "Okx":
                    const Okx = options.fractal
                        ? window.okxwallet.fractalBitcoin
                        : options.network === "testnet"
                            ? window.okxwallet.bitcoinTestnet
                            : window.okxwallet.bitcoin;
                    txid = yield Okx.sendBitcoin(options.address, options.amount);
                    break;
                case "Phantom":
                    throw new Error("Phantom wallet BTC payment not implemented");
                default:
                    throw new Error("Unsupported wallet");
            }
            setResult(txid);
        }
        catch (err) {
            handleError(err);
        }
        finally {
            setLoading(false);
        }
    }), [dispatch, walletDetails, testWallets]);
    return { payBTC, loading, result, error };
};
exports.usePayBTC = usePayBTC;
