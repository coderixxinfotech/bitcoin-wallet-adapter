"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSignature = exports.setNetwork = exports.setBTCPrice = exports.setLastWallet = exports.setWalletDetails = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    walletDetails: null,
    lastWallet: "",
    btc_price_in_dollar: 0,
    signature: "",
    network: "mainnet",
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
        setNetwork: (state, action) => {
            state.network = action.payload;
        },
        setSignature: (state, action) => {
            state.signature = action.payload;
        },
    },
});
_a = walletSlice.actions, exports.setWalletDetails = _a.setWalletDetails, exports.setLastWallet = _a.setLastWallet, exports.setBTCPrice = _a.setBTCPrice, exports.setNetwork = _a.setNetwork, exports.setSignature = _a.setSignature;
exports.default = walletSlice.reducer;
