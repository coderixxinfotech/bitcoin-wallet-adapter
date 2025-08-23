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
exports.useMESign = void 0;
const react_1 = require("react");
const sats_connect_1 = require("sats-connect");
const utils_1 = require("../utils");
const react_2 = require("@wallet-standard/react");
const errorHandler_1 = require("../utils/errorHandler");
const SatsConnectNamespace = "sats-connect:";
const useMESign = () => {
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [result, setResult] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const { wallets: testWallets } = (0, react_2.useWallets)();
    const sign = (0, react_1.useCallback)((options) => __awaiter(void 0, void 0, void 0, function* () {
        const { psbt, network, action, inputs } = options;
        // Check if the action is provided
        if (!action) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.VALIDATION_ERROR, "Action must be provided: buy | sell | dummy | other", {
                severity: errorHandler_1.BWAErrorSeverity.MEDIUM,
                context: {
                    walletType: 'MagicEden',
                    operation: 'transaction_signing'
                }
            });
        }
        // Check if the inputs are provided and are not empty
        if (!inputs || inputs.length === 0) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.VALIDATION_ERROR, "Inputs must be provided and cannot be empty", {
                severity: errorHandler_1.BWAErrorSeverity.MEDIUM,
                context: {
                    walletType: 'MagicEden',
                    operation: 'transaction_signing'
                }
            });
        }
        // Check if the network is provided
        if (!network) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.NETWORK_ERROR, "Network must be provided", {
                severity: errorHandler_1.BWAErrorSeverity.MEDIUM,
                context: {
                    walletType: 'MagicEden',
                    operation: 'transaction_signing'
                }
            });
        }
        // Make sure psbt is base64
        if (!(0, utils_1.isBase64)(psbt)) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.PSBT_INVALID, "MagicEden requires base64 PSBT", {
                severity: errorHandler_1.BWAErrorSeverity.MEDIUM,
                context: {
                    walletType: 'MagicEden',
                    operation: 'transaction_signing'
                }
            });
        }
        setLoading(true);
        try {
            const xverseInputs = inputs.map(({ address, index, sighash }) => (Object.assign({ address, signingIndexes: index }, (action === "sell" && { sigHash: sighash }))));
            const wallet = testWallets.filter((a) => a.name === "Magic Eden")[0];
            yield (0, sats_connect_1.signTransaction)({
                getProvider: () => __awaiter(void 0, void 0, void 0, function* () {
                    var _a;
                    return (_a = wallet.features[SatsConnectNamespace]) === null || _a === void 0 ? void 0 : _a.provider;
                }),
                payload: {
                    network: {
                        type: network.toLowerCase() === "mainnet"
                            ? sats_connect_1.BitcoinNetworkType.Mainnet
                            : sats_connect_1.BitcoinNetworkType.Testnet,
                    },
                    message: `Sign ${action} Transaction`,
                    psbtBase64: psbt,
                    broadcast: false,
                    inputsToSign: xverseInputs,
                },
                onFinish: (response) => setResult(response.psbtBase64),
                onCancel: () => {
                    try {
                        (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.USER_CANCELLED, "Transaction signing was cancelled by the user", {
                            severity: errorHandler_1.BWAErrorSeverity.LOW,
                            recoverable: true,
                            context: {
                                walletType: 'MagicEden',
                                operation: 'transaction_signing',
                                network
                            }
                        });
                    }
                    catch (e) {
                        setError(e);
                    }
                },
            });
        }
        catch (e) {
            setLoading(false);
            if (e instanceof Error && e.name === 'BWAError') {
                // BWA errors are already handled by the error manager, just set error state
                setError(e);
            }
            else {
                // Wrap unexpected errors with professional context
                try {
                    (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.TRANSACTION_SIGNING_FAILED, (e === null || e === void 0 ? void 0 : e.message) || "MagicEden transaction signing failed", {
                        severity: errorHandler_1.BWAErrorSeverity.HIGH,
                        context: {
                            walletType: 'MagicEden',
                            operation: 'transaction_signing',
                            network
                        },
                        originalError: e instanceof Error ? e : undefined
                    });
                }
                catch (bwaError) {
                    setError(bwaError);
                }
            }
        }
        finally {
            setLoading(false);
        }
    }), []);
    return { loading, result, error, sign };
};
exports.useMESign = useMESign;
