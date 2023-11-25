"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWalletAddress = void 0;
const react_redux_1 = require("react-redux");
const useWalletAddress = () => {
    const walletDetails = (0, react_redux_1.useSelector)((state) => state.general.walletDetails);
    const ordinal_address = (walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.ordinal) || null;
    const cardinal_address = (walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.cardinal) || null;
    const ordinal_pubkey = (walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.ordinalPubkey) || null;
    const cardinal_pubkey = (walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.cardinalPubkey) || null;
    const connected = (walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.connected) || false;
    const wallet = (walletDetails === null || walletDetails === void 0 ? void 0 : walletDetails.wallet) || null;
    return {
        ordinal_address,
        cardinal_address,
        ordinal_pubkey,
        cardinal_pubkey,
        wallet,
        connected,
    };
};
exports.useWalletAddress = useWalletAddress;
