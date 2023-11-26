"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWalletAddress = void 0;
const react_redux_1 = require("react-redux");
const walletSelector_1 = require("../selectors/walletSelector");
const useWalletAddress = () => {
    return (0, react_redux_1.useSelector)(walletSelector_1.walletAddressSelector);
};
exports.useWalletAddress = useWalletAddress;
