"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletAddressSelector = void 0;
const reselect_1 = require("reselect");
// Basic selector to get walletDetails from the state
const getWalletDetails = (state) => state.general.walletDetails;
// Memoized selector to compute the wallet address details
exports.walletAddressSelector = (0, reselect_1.createSelector)(getWalletDetails, (walletDetails) => {
    if (!walletDetails) {
        return null;
    }
    const { ordinal = "", cardinal = "", ordinalPubkey = "", cardinalPubkey = "", wallet = null, connected = false, } = walletDetails;
    return {
        ordinal_address: ordinal,
        cardinal_address: cardinal,
        ordinal_pubkey: ordinalPubkey,
        cardinal_pubkey: cardinalPubkey,
        wallet,
        connected,
    };
});
