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
// What happens in this file:
// - Exposes `useLeatherSign` hook to sign PSBTs with Leather via window.LeatherProvider.request
// - Avoids reliance on @stacks/connect-react to prevent postMessage collisions with Leather inpage script
// - Validates inputs (hex PSBT) and adds robust null checks + BWAError-based error reporting
const react_1 = require("react");
const errorHandler_1 = require("../utils/errorHandler");
const utils_1 = require("../utils");
const useLeatherSign = (defaultOptions = {}) => {
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [result, setResult] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const sign = (0, react_1.useCallback)((commonOptions) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
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
            // provider presence check
            // @ts-ignore - window typing for injected provider
            const provider = typeof window !== 'undefined' ? window === null || window === void 0 ? void 0 : window.LeatherProvider : undefined;
            if (!provider || typeof provider.request !== 'function') {
                (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND, "Leather wallet is not available or not installed", {
                    severity: errorHandler_1.BWAErrorSeverity.MEDIUM,
                    context: { walletType: 'Leather', operation: 'transaction_signing', network }
                });
            }
            const signAtIndex = inputs.map((input) => input.index).flat();
            const mergedOptions = Object.assign(Object.assign({}, defaultOptions), { hex: psbt, signAtIndex, 
                // publicKey: inputs[0].publickey,
                // network:
                //   network === "Mainnet" ? stacksMainnetNetwork : stacksTestnetNetwork,
                allowedSighash: [0x00, 0x01, 0x02, 0x03, 0x80, 0x81, 0x82, 0x83] });
            // @ts-ignore - injected provider API
            const response = yield provider.request("signPsbt", mergedOptions);
            const signedHex = (_a = response === null || response === void 0 ? void 0 : response.result) === null || _a === void 0 ? void 0 : _a.hex;
            if (!signedHex || typeof signedHex !== 'string' || !(0, utils_1.isHex)(signedHex)) {
                (0, errorHandler_1.throwBWAError)(errorHandler_1.BWAErrorCode.TRANSACTION_SIGNING_FAILED, "Leather returned an invalid signature payload", {
                    severity: errorHandler_1.BWAErrorSeverity.HIGH,
                    context: { walletType: 'Leather', operation: 'transaction_signing', network },
                });
            }
            const base64Result = (0, utils_1.hexToBase64)(signedHex);
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
    }), [defaultOptions]);
    return { loading, result, error, sign };
};
exports.useLeatherSign = useLeatherSign;
