"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBitcoinPrice = exports.useWalletSigning = exports.useWalletBalance = exports.useWalletConnect = exports.usePayBTC = exports.useDisconnect = exports.useMessageSign = exports.useSignTx = exports.useWalletAddress = exports.useUnisatSign = exports.useXverseSign = exports.useLeatherSign = void 0;
// Legacy wallet-specific hooks
const useLeatherSign_1 = require("./useLeatherSign");
Object.defineProperty(exports, "useLeatherSign", { enumerable: true, get: function () { return useLeatherSign_1.useLeatherSign; } });
const useXverseSign_1 = require("./useXverseSign");
Object.defineProperty(exports, "useXverseSign", { enumerable: true, get: function () { return useXverseSign_1.useXverseSign; } });
const useUnisatSign_1 = require("./useUnisatSign");
Object.defineProperty(exports, "useUnisatSign", { enumerable: true, get: function () { return useUnisatSign_1.useUnisatSign; } });
const useWalletAddress_1 = require("./useWalletAddress");
Object.defineProperty(exports, "useWalletAddress", { enumerable: true, get: function () { return useWalletAddress_1.useWalletAddress; } });
const useSignTx_1 = require("./useSignTx");
Object.defineProperty(exports, "useSignTx", { enumerable: true, get: function () { return useSignTx_1.useSignTx; } });
const useMessageSign_1 = require("./useMessageSign");
Object.defineProperty(exports, "useMessageSign", { enumerable: true, get: function () { return useMessageSign_1.useMessageSign; } });
const useDisconnect_1 = __importDefault(require("./useDisconnect"));
exports.useDisconnect = useDisconnect_1.default;
const usePayBTC_1 = require("./usePayBTC");
Object.defineProperty(exports, "usePayBTC", { enumerable: true, get: function () { return usePayBTC_1.usePayBTC; } });
// New headless hooks (recommended)
const useWalletConnect_1 = require("./useWalletConnect");
Object.defineProperty(exports, "useWalletConnect", { enumerable: true, get: function () { return useWalletConnect_1.useWalletConnect; } });
const useWalletBalance_1 = require("./useWalletBalance");
Object.defineProperty(exports, "useWalletBalance", { enumerable: true, get: function () { return useWalletBalance_1.useWalletBalance; } });
const useWalletSigning_1 = require("./useWalletSigning");
Object.defineProperty(exports, "useWalletSigning", { enumerable: true, get: function () { return useWalletSigning_1.useWalletSigning; } });
const useBitcoinPrice_1 = require("./useBitcoinPrice");
Object.defineProperty(exports, "useBitcoinPrice", { enumerable: true, get: function () { return useBitcoinPrice_1.useBitcoinPrice; } });
