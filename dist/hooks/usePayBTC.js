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
const sats_connect_v2_1 = __importDefault(require("sats-connect-v2"));
const errorHandler_1 = require("../utils/errorHandler");
const SatsConnectNamespace = "sats-connect:";
const usePayBTC = () => {
    const { wallets: testWallets } = (0, react_2.useWallets)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [result, setResult] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const walletDetails = (0, react_redux_1.useSelector)((state) => state.general.walletDetails);
    const SetResult = (response) => {
        setResult(response);
    };
    // Remove handleError - we'll use throwBWAError directly
    const payBTC = (0, react_1.useCallback)((options) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        setLoading(true);
        setResult(null);
        setError(null);
        if (!(walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.connected)) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_CONNECTED, "No wallet is currently connected. Please connect a wallet to make BTC payments.", {
                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                context: {
                    operation: 'btc_payment',
                    additionalData: { address: options.address, amount: options.amount }
                }
            });
        }
        console.log({ options });
        try {
            let txid;
            switch (walletDetails.wallet) {
                case "Leather":
                    if (!window.LeatherProvider) {
                        (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "Leather wallet is not available for BTC payments", {
                            severity: errorHandler_1.BWAErrorSeverity.HIGH,
                            context: {
                                operation: 'btc_payment',
                                walletType: 'Leather'
                            }
                        });
                    }
                    try {
                        const resp = yield window.LeatherProvider.request("sendTransfer", {
                            recipients: [
                                {
                                    address: options.address,
                                    amount: options.amount.toString(), // Leather expects string
                                },
                            ],
                            network: options.network,
                        });
                        if (!((_a = resp === null || resp === void 0 ? void 0 : resp.result) === null || _a === void 0 ? void 0 : _a.txid)) {
                            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.PAYMENT_FAILED, "Invalid response from Leather wallet - no transaction ID returned", {
                                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                                context: {
                                    operation: 'btc_payment',
                                    walletType: 'Leather',
                                    additionalData: { response: resp }
                                }
                            });
                        }
                        txid = resp.result.txid;
                        setResult(txid);
                    }
                    catch (leatherError) {
                        // Handle Leather-specific errors
                        if ((_b = leatherError === null || leatherError === void 0 ? void 0 : leatherError.error) === null || _b === void 0 ? void 0 : _b.code) {
                            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.PAYMENT_FAILED, `Leather wallet error: ${leatherError.error.message || 'Unknown error'}`, {
                                severity: errorHandler_1.BWAErrorSeverity.HIGH,
                                context: {
                                    operation: 'btc_payment',
                                    walletType: 'Leather',
                                    additionalData: {
                                        leatherErrorCode: leatherError.error.code,
                                        leatherErrorMessage: leatherError.error.message
                                    }
                                }
                            });
                        }
                        else {
                            // Re-throw if it's already a BWA error
                            throw leatherError;
                        }
                    }
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
                    setResult(txid);
                    break;
                case "MagicEden":
                    const wallet = walletDetails.wallet === "MagicEden"
                        ? testWallets.find((a) => a.name === "Magic Eden")
                        : undefined;
                    const sendBtcOptions = Object.assign(Object.assign({}, (walletDetails.wallet === "MagicEden" && {
                        getProvider: () => __awaiter(void 0, void 0, void 0, function* () {
                            var _c;
                            return (_c = wallet.features[SatsConnectNamespace]) === null || _c === void 0 ? void 0 : _c.provider;
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
                            setLoading(false);
                            if (typeof response === "string") {
                                txid = response;
                                setLoading(false);
                                setResult(response);
                            }
                            else if (response && typeof response.txid === "string") {
                                txid = response.txid;
                                setResult(response.txid);
                                setLoading(false);
                            }
                            else {
                                (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.PAYMENT_FAILED, "Invalid payment response format from MagicEden wallet", {
                                    severity: errorHandler_1.BWAErrorSeverity.HIGH,
                                    context: {
                                        operation: 'btc_payment',
                                        walletType: 'MagicEden',
                                        additionalData: { response }
                                    }
                                });
                            }
                        }, onCancel: () => {
                            console.log("Cancelled ");
                        } });
                    (yield (0, sats_connect_1.sendBtcTransaction)(sendBtcOptions));
                    break;
                case "Unisat":
                    txid = yield window.unisat.sendBitcoin(options.address, options.amount);
                    setResult(txid);
                    break;
                case "Okx":
                    const Okx = options.fractal
                        ? window.okxwallet.fractalBitcoin
                        : options.network === "testnet"
                            ? window.okxwallet.bitcoinTestnet
                            : window.okxwallet.bitcoin;
                    txid = yield Okx.sendBitcoin(options.address, options.amount);
                    setResult(txid);
                    break;
                case "Phantom":
                    (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.UNSUPPORTED_OPERATION, "Phantom wallet does not support BTC payments yet.", {
                        severity: errorHandler_1.BWAErrorSeverity.HIGH,
                        context: {
                            operation: 'btc_payment',
                            walletType: 'Phantom'
                        }
                    });
                default:
                    (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.UNSUPPORTED_WALLET, `${walletDetails.wallet} wallet is not supported for BTC payments.`, {
                        severity: errorHandler_1.BWAErrorSeverity.HIGH,
                        context: {
                            operation: 'btc_payment',
                            walletType: walletDetails.wallet
                        }
                    });
            }
        }
        catch (err) {
            setLoading(false);
            if (err instanceof Error && err.name === 'BWAError') {
                // BWA errors are already handled by the error manager, just re-throw
                throw err;
            }
            else {
                // Wrap unexpected errors with professional context
                const errorToWrap = err instanceof Error ? err : new Error(String(err));
                (0, errorHandler_1.wrapAndThrowError)(errorToWrap, errorHandler_1.BWAErrorCode.PAYMENT_FAILED, `BTC payment failed with ${walletDetails.wallet} wallet`, {
                    operation: 'btc_payment',
                    walletType: walletDetails.wallet,
                    network: options.network
                });
            }
        }
        finally {
            setLoading(false);
        }
    }), [walletDetails, testWallets]);
    return { payBTC, loading, result, error };
};
exports.usePayBTC = usePayBTC;
