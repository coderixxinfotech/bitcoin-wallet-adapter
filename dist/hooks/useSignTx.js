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
exports.useSignTx = void 0;
const react_1 = require("react");
const index_1 = require("./index");
const index_2 = require("./index");
const utils_1 = require("../utils");
const useMESign_1 = require("./useMESign");
const useSignTx = () => {
    const walletDetails = (0, index_2.useWalletAddress)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [result, setResult] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const { sign: leatherSign, result: leatherResult, error: leatherError, } = (0, index_1.useLeatherSign)();
    const { sign: xverseSign, result: xverseResult, error: xverseError, } = (0, index_1.useXverseSign)();
    const { sign: meSign, result: meResult, error: meError } = (0, useMESign_1.useMESign)();
    const { sign: unisatSign, result: unisatResult, error: unisatError, } = (0, index_1.useUnisatSign)();
    const signTx = (0, react_1.useCallback)((props) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            if (!walletDetails)
                throw Error("Wallet Not Connected");
            const options = {
                psbt: walletDetails.wallet === "Xverse" ||
                    walletDetails.wallet === "MagicEden"
                    ? props.psbt
                    : (0, utils_1.base64ToHex)(props.psbt),
                network: props.network.toLowerCase(),
                action: props.action,
                inputs: props.inputs,
            };
            // console.log({ walletDetails }, "in useSignTx");
            if (walletDetails.wallet === "Leather") {
                //@ts-ignore
                leatherSign(options);
            }
            else if (walletDetails.wallet === "Xverse") {
                //@ts-ignore
                xverseSign(options);
            }
            else if (walletDetails.wallet === "MagicEden") {
                //@ts-ignore
                meSign(options);
            }
            else if (walletDetails.wallet === "Unisat") {
                //@ts-ignore
                unisatSign(options);
            }
        }
        catch (err) {
            setError(err);
            setLoading(false);
        }
    }), [walletDetails, leatherSign, xverseSign, unisatSign, meSign]);
    (0, react_1.useEffect)(() => {
        if (leatherResult || xverseResult || unisatResult || meResult) {
            setResult(leatherResult || xverseResult || unisatResult || meResult);
            setLoading(false);
        }
        if (leatherError || xverseError || unisatError || meError) {
            setError(leatherError || xverseError || unisatError || meError);
            setLoading(false);
        }
    }, [
        leatherResult,
        leatherError,
        xverseResult,
        xverseError,
        unisatResult,
        unisatError,
        meResult,
        meError,
    ]);
    return { signTx, loading, result, error };
};
exports.useSignTx = useSignTx;
