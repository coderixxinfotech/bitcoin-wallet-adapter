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
exports.usePhantomSign = void 0;
const react_1 = require("react");
const utils_1 = require("../utils");
const __1 = require("..");
const errorHandler_1 = require("../utils/errorHandler");
const usePhantomSign = () => {
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [result, setResult] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const sign = (0, react_1.useCallback)((options) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const { psbt, network, action, inputs } = options;
        if (!(0, utils_1.isHex)(psbt)) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.PSBT_INVALID, "Phantom wallet requires PSBT in hex format", {
                severity: errorHandler_1.BWAErrorSeverity.MEDIUM,
                context: {
                    walletType: 'Phantom',
                    operation: 'transaction_signing'
                }
            });
        }
        setLoading(true);
        try {
            const phantomInputs = inputs.map(({ address, index, sighash }) => (Object.assign({ address, signingIndexes: index }, (action == "sell" && { sigHash: sighash }))));
            const options = {
                inputsToSign: phantomInputs,
                // autoFinalized: false,
            };
            const phantom = (_b = (_a = window.window) === null || _a === void 0 ? void 0 : _a.phantom) === null || _b === void 0 ? void 0 : _b.bitcoin;
            console.log({ phantom });
            console.log({ psbt, options });
            // @ts-ignore
            const signedPsbt = yield phantom.signPSBT((0, utils_1.BytesFromHex)(psbt), options);
            setResult((0, __1.bytesToBase64)(signedPsbt));
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
                    (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.TRANSACTION_SIGNING_FAILED, (e === null || e === void 0 ? void 0 : e.message) || "Phantom transaction signing failed", {
                        severity: errorHandler_1.BWAErrorSeverity.HIGH,
                        context: {
                            walletType: 'Phantom',
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
    return {
        loading,
        result,
        error,
        sign,
    };
};
exports.usePhantomSign = usePhantomSign;
