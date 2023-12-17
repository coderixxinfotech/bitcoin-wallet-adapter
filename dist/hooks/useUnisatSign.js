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
exports.useUnisatSign = void 0;
const react_1 = require("react");
const utils_1 = require("../utils");
const useUnisatSign = () => {
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [result, setResult] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const sign = (0, react_1.useCallback)((options) => __awaiter(void 0, void 0, void 0, function* () {
        const { psbt, network, action, inputs } = options;
        if (!(0, utils_1.isHex)(psbt)) {
            setError(new Error("Unisat requires hexPsbt"));
            return;
        }
        setLoading(true);
        try {
            const unisatInputs = inputs.map(({ address, index, sighash }) => (Object.assign({ address,
                index }, (action == "sell" && { sighashTypes: [sighash] }))));
            const options = {
                toSignInputs: unisatInputs,
                autoFinalized: false,
            };
            // @ts-ignore (Assuming unisat.signPsbt is defined elsewhere in your code)
            const signedPsbt = yield window.unisat.signPsbt(psbt, options);
            setResult((0, utils_1.hexToBase64)(signedPsbt));
        }
        catch (e) {
            setError(e);
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
exports.useUnisatSign = useUnisatSign;
