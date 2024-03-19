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
exports.useMessageSign = void 0;
const react_1 = require("react");
const index_1 = require("./index");
const sats_connect_1 = require("sats-connect"); // Renamed to avoid naming conflict
const useMessageSign = () => {
    const walletDetails = (0, index_1.useWalletAddress)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [result, setResult] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const signMessage = (0, react_1.useCallback)((options) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setResult(null);
        setError(null);
        if (!walletDetails) {
            setError(new Error("Wallet Not Connected"));
            setLoading(false);
            return;
        }
        try {
            if (walletDetails.wallet === "Xverse") {
                const signMessageOptions = {
                    payload: {
                        network: {
                            type: options.network,
                        },
                        address: options.address,
                        message: options.message,
                    },
                    onFinish: (response) => {
                        // Here you update the result with the response from the onFinish callback
                        setResult(response); // Assume response contains the data you want as result
                        setLoading(false);
                    },
                    onCancel: () => {
                        // Update the error state if the user cancels the operation
                        setError(new Error("User canceled the operation"));
                        setLoading(false);
                    },
                };
                // Call the signMessageApi with the options
                //@ts-ignore
                yield (0, sats_connect_1.signMessage)(signMessageOptions);
            }
            else if (typeof window.unisat !== "undefined" &&
                walletDetails.wallet === "Unisat") {
                setLoading(true); // Start loading
                try {
                    // Assuming window.unisat.signMessage returns a promise
                    const sign = yield window.unisat.signMessage(options.message);
                    setResult(sign); // Update the result with the signature
                }
                catch (err) {
                    // Handle any errors that occur during the signing process
                    setError(err instanceof Error
                        ? err
                        : new Error("An error occurred during message signing"));
                }
                finally {
                    setLoading(false); // End loading regardless of the outcome
                }
            }
            else if (typeof window.btc !== "undefined" &&
                walletDetails.wallet === "Leather") {
                setLoading(true); // Start loading
                try {
                    // Assuming window.unisat.signMessage returns a promise
                    const sign = window.btc.request("signMessage", {
                        message: options.message,
                        paymentType: "p2tr", // or 'p2wphk' (default)
                    });
                    setResult(sign.result); // Update the result with the signature
                }
                catch (err) {
                    // Handle any errors that occur during the signing process
                    setError(err instanceof Error
                        ? err
                        : new Error("An error occurred during message signing"));
                }
                finally {
                    setLoading(false); // End loading regardless of the outcome
                }
            }
            // Implement other wallet types...
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error("An unknown error occurred"));
            setLoading(false);
        }
    }), [walletDetails]);
    return { signMessage, loading, result, error };
};
exports.useMessageSign = useMessageSign;
