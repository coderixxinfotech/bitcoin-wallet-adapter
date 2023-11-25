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
exports.useXverseSign = void 0;
const react_1 = require("react");
const sats_connect_1 = require("sats-connect");
const utils_1 = require("../utils");
const useXverseSign = () => {
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [result, setResult] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const sign = (0, react_1.useCallback)((options) => __awaiter(void 0, void 0, void 0, function* () {
        const { psbt, network, action, inputs } = options;
        // Check if the action is provided
        if (!action) {
            setError(new Error("Action must be provided: buy | sell | dummy | other"));
            return;
        }
        // Check if the inputs are provided and are not empty
        if (!inputs || inputs.length === 0) {
            setError(new Error("Inputs must be provided and cannot be empty"));
            return;
        }
        // Check if the network is provided
        if (!network) {
            setError(new Error("Network must be provided"));
            return;
        }
        // Make sure psbt is base64
        if (!(0, utils_1.isBase64)(psbt)) {
            console.warn("Xverse requires base64 PSBT");
            setError(new Error("Xverse requires base64 PSBT"));
            return;
        }
        setLoading(true);
        try {
            const xverseInputs = inputs.map(({ address, index, sighash }) => (Object.assign({ address, signingIndexes: index }, (action === "sell" && { sigHash: sighash }))));
            const signedPsbt = yield (0, sats_connect_1.signTransaction)({
                payload: {
                    network: {
                        type: network === "Mainnet"
                            ? sats_connect_1.BitcoinNetworkType.Mainnet
                            : sats_connect_1.BitcoinNetworkType.Testnet,
                    },
                    message: `Sign ${action} Transaction`,
                    psbtBase64: psbt,
                    broadcast: false,
                    inputsToSign: xverseInputs,
                },
                onFinish: (response) => setResult(response.psbtBase64),
                onCancel: () => setError(new Error("Operation cancelled by user")),
            });
        }
        catch (e) {
            setError(e);
        }
        finally {
            setLoading(false);
        }
    }), []);
    return { loading, result, error, sign };
};
exports.useXverseSign = useXverseSign;
