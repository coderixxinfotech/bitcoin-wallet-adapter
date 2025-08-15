"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearPriceData = exports.clearError = exports.setAutoRefresh = exports.getCachedBitcoinPrice = exports.fetchBitcoinPrice = exports.useBitcoinPrice = exports.useWalletSigning = exports.useWalletBalance = exports.useWalletConnect = exports.usePayBTC = exports.useDisconnect = exports.useMessageSign = exports.useSignTx = exports.useLeatherSign = exports.useUnisatSign = exports.useXverseSign = exports.useWalletAddress = exports.useCriticalErrors = exports.useTransactionErrors = exports.useWalletErrors = exports.useErrorHandler = exports.errorManager = exports.withErrorHandling = exports.wrapAndThrowError = exports.throwBWAError = exports.bwaErrorManager = exports.BWAErrorSeverity = exports.BWAErrorCode = exports.BWAError = exports.useDevTools = exports.setupDevTools = exports.DevToolsUtils = exports.bytesToBase64 = exports.removeNotification = exports.addNotification = exports.PayButton = exports.Notification = exports.ConnectMultiButton = exports.WalletProvider = void 0;
// Styles
require("./styles.css");
// Providers
const Provider_1 = __importDefault(require("./common/Provider"));
exports.WalletProvider = Provider_1.default;
// Components
const ConnectMultiButton_1 = __importDefault(require("./components/ConnectMultiButton"));
exports.ConnectMultiButton = ConnectMultiButton_1.default;
const Notification_1 = __importDefault(require("./components/Notification"));
exports.Notification = Notification_1.default;
const PayButton_1 = __importDefault(require("./components/PayButton"));
exports.PayButton = PayButton_1.default;
// Hooks
const hooks_1 = require("./hooks");
Object.defineProperty(exports, "useWalletAddress", { enumerable: true, get: function () { return hooks_1.useWalletAddress; } });
Object.defineProperty(exports, "useXverseSign", { enumerable: true, get: function () { return hooks_1.useXverseSign; } });
Object.defineProperty(exports, "useUnisatSign", { enumerable: true, get: function () { return hooks_1.useUnisatSign; } });
Object.defineProperty(exports, "useLeatherSign", { enumerable: true, get: function () { return hooks_1.useLeatherSign; } });
Object.defineProperty(exports, "useSignTx", { enumerable: true, get: function () { return hooks_1.useSignTx; } });
Object.defineProperty(exports, "useMessageSign", { enumerable: true, get: function () { return hooks_1.useMessageSign; } });
Object.defineProperty(exports, "useDisconnect", { enumerable: true, get: function () { return hooks_1.useDisconnect; } });
Object.defineProperty(exports, "usePayBTC", { enumerable: true, get: function () { return hooks_1.usePayBTC; } });
Object.defineProperty(exports, "useWalletConnect", { enumerable: true, get: function () { return hooks_1.useWalletConnect; } });
Object.defineProperty(exports, "useWalletBalance", { enumerable: true, get: function () { return hooks_1.useWalletBalance; } });
Object.defineProperty(exports, "useWalletSigning", { enumerable: true, get: function () { return hooks_1.useWalletSigning; } });
Object.defineProperty(exports, "useBitcoinPrice", { enumerable: true, get: function () { return hooks_1.useBitcoinPrice; } });
// Export notification system
var notificationReducers_1 = require("./stores/reducers/notificationReducers");
Object.defineProperty(exports, "addNotification", { enumerable: true, get: function () { return notificationReducers_1.addNotification; } });
Object.defineProperty(exports, "removeNotification", { enumerable: true, get: function () { return notificationReducers_1.removeNotification; } });
function bytesToBase64(bytes) {
    const binString = String.fromCodePoint(...bytes);
    return btoa(binString);
}
exports.bytesToBase64 = bytesToBase64;
// Export Redux DevTools utilities for development
var devtools_1 = require("./utils/devtools");
Object.defineProperty(exports, "DevToolsUtils", { enumerable: true, get: function () { return devtools_1.DevToolsUtils; } });
Object.defineProperty(exports, "setupDevTools", { enumerable: true, get: function () { return devtools_1.setupDevTools; } });
Object.defineProperty(exports, "useDevTools", { enumerable: true, get: function () { return devtools_1.useDevTools; } });
// Export professional error handling system
var errorHandler_1 = require("./utils/errorHandler");
Object.defineProperty(exports, "BWAError", { enumerable: true, get: function () { return errorHandler_1.BWAError; } });
Object.defineProperty(exports, "BWAErrorCode", { enumerable: true, get: function () { return errorHandler_1.BWAErrorCode; } });
Object.defineProperty(exports, "BWAErrorSeverity", { enumerable: true, get: function () { return errorHandler_1.BWAErrorSeverity; } });
Object.defineProperty(exports, "bwaErrorManager", { enumerable: true, get: function () { return errorHandler_1.bwaErrorManager; } });
Object.defineProperty(exports, "throwBWAError", { enumerable: true, get: function () { return errorHandler_1.throwBWAError; } });
Object.defineProperty(exports, "wrapAndThrowError", { enumerable: true, get: function () { return errorHandler_1.wrapAndThrowError; } });
Object.defineProperty(exports, "withErrorHandling", { enumerable: true, get: function () { return errorHandler_1.withErrorHandling; } });
Object.defineProperty(exports, "errorManager", { enumerable: true, get: function () { return errorHandler_1.errorManager; } });
// Export error handling hooks
var useErrorHandler_1 = require("./hooks/useErrorHandler");
Object.defineProperty(exports, "useErrorHandler", { enumerable: true, get: function () { return useErrorHandler_1.useErrorHandler; } });
Object.defineProperty(exports, "useWalletErrors", { enumerable: true, get: function () { return useErrorHandler_1.useWalletErrors; } });
Object.defineProperty(exports, "useTransactionErrors", { enumerable: true, get: function () { return useErrorHandler_1.useTransactionErrors; } });
Object.defineProperty(exports, "useCriticalErrors", { enumerable: true, get: function () { return useErrorHandler_1.useCriticalErrors; } });
// Export Bitcoin Price functionality
var bitcoinPriceReducer_1 = require("./stores/reducers/bitcoinPriceReducer");
Object.defineProperty(exports, "fetchBitcoinPrice", { enumerable: true, get: function () { return bitcoinPriceReducer_1.fetchBitcoinPrice; } });
Object.defineProperty(exports, "getCachedBitcoinPrice", { enumerable: true, get: function () { return bitcoinPriceReducer_1.getCachedBitcoinPrice; } });
Object.defineProperty(exports, "setAutoRefresh", { enumerable: true, get: function () { return bitcoinPriceReducer_1.setAutoRefresh; } });
Object.defineProperty(exports, "clearError", { enumerable: true, get: function () { return bitcoinPriceReducer_1.clearError; } });
Object.defineProperty(exports, "clearPriceData", { enumerable: true, get: function () { return bitcoinPriceReducer_1.clearPriceData; } });
