"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useWalletEffect = (walletDetails, disconnect, network, redux_network) => {
    (0, react_1.useEffect)(() => {
        const listeners = [];
        const addListener = (obj, events) => {
            events.forEach((event) => {
                obj.on(event, disconnect);
                listeners.push({
                    remove: () => obj.removeListener(event, disconnect),
                });
            });
        };
        if (walletDetails) {
            const wallet = walletDetails.wallet.toLowerCase();
            if (wallet === "okx") {
                const { bitcoin, fractalBitcoin, bitcoinTestnet } = window
                    .okxwallet;
                if (bitcoin)
                    addListener(bitcoin, ["accountsChanged", "accountChanged"]);
                if (fractalBitcoin)
                    addListener(fractalBitcoin, ["accountsChanged", "accountChanged"]);
                if ((network === "testnet" || redux_network === "testnet") &&
                    bitcoinTestnet) {
                    addListener(bitcoinTestnet, ["accountsChanged", "accountChanged"]);
                }
            }
            else if (wallet === "unisat") {
                const unisat = window.unisat;
                if (unisat)
                    addListener(unisat, ["accountsChanged", "networkChanged"]);
            }
        }
        // Cleanup function
        return () => {
            listeners.forEach((listener) => listener.remove());
        };
    }, [walletDetails, network, redux_network, disconnect]);
};
exports.default = useWalletEffect;
