"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDummyUtxos = exports.setMempoolBalance = exports.setBalance = exports.setOrdUrl = exports.setMempoolUrl = exports.setBTCPrice = exports.setLastWallet = exports.setWalletDetails = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    walletDetails: null,
    lastWallet: "",
    btc_price_in_dollar: 0,
    mempool_url: "https://mempool.space",
    ord_url: "",
    balance: 0,
    in_mempool_balance: 0,
    dummy_utxos: 0,
};
const walletSlice = (0, toolkit_1.createSlice)({
    name: "wallet",
    initialState,
    reducers: {
        setWalletDetails: (state, action) => {
            state.walletDetails = action.payload;
        },
        setLastWallet: (state, action) => {
            state.lastWallet = action.payload;
        },
        setBTCPrice: (state, action) => {
            state.btc_price_in_dollar = action.payload;
        },
        setMempoolUrl: (state, action) => {
            state.mempool_url = action.payload;
        },
        setOrdUrl: (state, action) => {
            state.ord_url = action.payload;
        },
        setBalance: (state, action) => {
            state.balance = action.payload;
        },
        setMempoolBalance: (state, action) => {
            state.in_mempool_balance = action.payload;
        },
        setDummyUtxos: (state, action) => {
            state.dummy_utxos = action.payload;
        },
    },
});
_a = walletSlice.actions, exports.setWalletDetails = _a.setWalletDetails, exports.setLastWallet = _a.setLastWallet, exports.setBTCPrice = _a.setBTCPrice, exports.setMempoolUrl = _a.setMempoolUrl, exports.setOrdUrl = _a.setOrdUrl, exports.setBalance = _a.setBalance, exports.setMempoolBalance = _a.setMempoolBalance, exports.setDummyUtxos = _a.setDummyUtxos;
exports.default = walletSlice.reducer;
