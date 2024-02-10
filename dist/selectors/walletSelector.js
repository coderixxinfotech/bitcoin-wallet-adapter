"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletAddressSelector = void 0;
const reselect_1 = require("reselect");
// Basic selector to get walletDetails from the state
const getWalletDetails = (state) => state.general.walletDetails;
// Additional selectors
const getBalance = (state) => state.general.balance;
const getMempoolBalance = (state) => state.general.in_mempool_balance;
const getDummyUtxos = (state) => state.general.dummy_utxos;
// Memoized selector to compute the wallet address details
exports.walletAddressSelector = (0, reselect_1.createSelector)([getWalletDetails, getBalance, getMempoolBalance, getDummyUtxos], // include all relevant selectors here
(walletDetails, balance, mempoolBalance, dummyUtxos) => {
    // these are the computed values from above selectors
    if (!walletDetails) {
        return null;
    }
    const { ordinal = "", cardinal = "", ordinalPubkey = "", cardinalPubkey = "", wallet = null, connected = false, } = walletDetails;
    return {
        ordinal_address: ordinal,
        cardinal_address: cardinal,
        ordinal_pubkey: ordinalPubkey,
        cardinal_pubkey: cardinalPubkey,
        balance,
        mempool_balance: mempoolBalance,
        dummy_utxos: dummyUtxos,
        wallet,
        connected,
    };
});
