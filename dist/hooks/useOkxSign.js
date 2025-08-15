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
exports.useOkxSign = void 0;
const react_1 = require("react");
const utils_1 = require("../utils");
const errorHandler_1 = require("../utils/errorHandler");
const useOkxSign = () => {
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [result, setResult] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const sign = (0, react_1.useCallback)((options) => __awaiter(void 0, void 0, void 0, function* () {
        const { psbt, network, action, inputs, fractal } = options;
        // console.log({ options });
        if (!(0, utils_1.isHex)(psbt)) {
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.PSBT_INVALID, "OKX wallet requires hex PSBT", {
                severity: errorHandler_1.BWAErrorSeverity.MEDIUM,
                context: {
                    walletType: 'OKX',
                    operation: 'transaction_signing'
                }
            });
        }
        setLoading(true);
        try {
            const okxInputs = inputs.map(({ address, index, sighash, publickey }) => (Object.assign({ address, index: index[0] }, (action == "sell" && { sighashTypes: [sighash] }))));
            const options = {
                toSignInputs: okxInputs,
                autoFinalized: false,
            };
            // console.log({ options });
            const Okx = fractal
                ? window.okxwallet.fractalBitcoin
                : network === "testnet"
                    ? window.okxwallet.bitcoinTestnet
                    : window.okxwallet.bitcoin;
            // @ts-ignore
            const signedPsbt = yield Okx.signPsbt(psbt, options);
            // console.log({ signedPsbt });
            setResult((0, utils_1.hexToBase64)(signedPsbt));
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
                    (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.TRANSACTION_SIGNING_FAILED, (e === null || e === void 0 ? void 0 : e.message) || "OKX transaction signing failed", {
                        severity: errorHandler_1.BWAErrorSeverity.HIGH,
                        context: {
                            walletType: 'OKX',
                            operation: 'transaction_signing',
                            network,
                            additionalData: { fractal }
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
exports.useOkxSign = useOkxSign;
