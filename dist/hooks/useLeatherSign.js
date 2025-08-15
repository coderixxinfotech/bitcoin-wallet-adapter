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
exports.useLeatherSign = void 0;
const react_1 = require("react");
const connect_react_1 = require("@stacks/connect-react");
const errorHandler_1 = require("../utils/errorHandler");
const utils_1 = require("../utils");
const useLeatherSign = (defaultOptions = {}) => {
    const { signPsbt } = (0, connect_react_1.useConnect)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [result, setResult] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const sign = (0, react_1.useCallback)((commonOptions) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        const { psbt, network, action, inputs } = commonOptions;
        if (!(0, utils_1.isHex)(psbt)) {
            setLoading(false);
            (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.PSBT_INVALID, "Leather wallet requires PSBT in HEX format", {
                severity: errorHandler_1.BWAErrorSeverity.MEDIUM,
                context: {
                    walletType: 'Leather',
                    operation: 'transaction_signing'
                }
            });
        }
        try {
            const signAtIndex = inputs.map((input) => input.index).flat();
            const mergedOptions = Object.assign(Object.assign({}, defaultOptions), { hex: psbt, signAtIndex, 
                // publicKey: inputs[0].publickey,
                // network:
                //   network === "Mainnet" ? stacksMainnetNetwork : stacksTestnetNetwork,
                allowedSighash: [0x00, 0x01, 0x02, 0x03, 0x80, 0x81, 0x82, 0x83] });
            // @ts-ignore
            const { result } = yield window.LeatherProvider.request("signPsbt", mergedOptions);
            const base64Result = (0, utils_1.hexToBase64)(result.hex);
            setResult(base64Result);
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
                    (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.TRANSACTION_SIGNING_FAILED, (e === null || e === void 0 ? void 0 : e.message) || "Leather transaction signing failed", {
                        severity: errorHandler_1.BWAErrorSeverity.HIGH,
                        context: {
                            walletType: 'Leather',
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
    }), [signPsbt, defaultOptions]);
    return { loading, result, error, sign };
};
exports.useLeatherSign = useLeatherSign;
