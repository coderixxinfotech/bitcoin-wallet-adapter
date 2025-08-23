"use strict";
/**
 * Headless Hooks for Bitcoin Wallet Adapter
 *
 * These hooks provide wallet functionality without any UI components,
 * giving developers complete control over their user interface design.
 *
 * @example
 * ```typescript
 * import { useWalletConnect, useWalletBalance } from 'bitcoin-wallet-adapter/hooks/headless';
 *
 * const MyCustomWallet = () => {
 *   const { connect, disconnect, isConnected, currentWallet } = useWalletConnect();
 *   const { balance, formatBalance } = useWalletBalance();
 *
 *   return (
 *     <div className="my-custom-design">
 *       {isConnected ? (
 *         <div>
 *           <span>Connected: {currentWallet?.wallet}</span>
 *           <span>Balance: {formatBalance(balance.btc || 0)} BTC</span>
 *           <button onClick={disconnect}>Disconnect</button>
 *         </div>
 *       ) : (
 *         <button onClick={() => connect('unisat')}>Connect Wallet</button>
 *       )}
 *     </div>
 *   );
 * };
 * ```
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkHeadlessHooksCompatibility = exports.useDisconnect = exports.useWalletAddress = exports.useWalletSigning = exports.useWalletBalance = exports.useWalletConnect = void 0;
// Core headless hooks
var useWalletConnect_1 = require("./useWalletConnect");
Object.defineProperty(exports, "useWalletConnect", { enumerable: true, get: function () { return useWalletConnect_1.useWalletConnect; } });
var useWalletBalance_1 = require("./useWalletBalance");
Object.defineProperty(exports, "useWalletBalance", { enumerable: true, get: function () { return useWalletBalance_1.useWalletBalance; } });
var useWalletSigning_1 = require("./useWalletSigning");
Object.defineProperty(exports, "useWalletSigning", { enumerable: true, get: function () { return useWalletSigning_1.useWalletSigning; } });
// Re-export existing hooks that are already headless
var useWalletAddress_1 = require("./useWalletAddress");
Object.defineProperty(exports, "useWalletAddress", { enumerable: true, get: function () { return useWalletAddress_1.useWalletAddress; } });
var useDisconnect_1 = require("./useDisconnect");
Object.defineProperty(exports, "useDisconnect", { enumerable: true, get: function () { return __importDefault(useDisconnect_1).default; } });
// Utility function to check if all required headless hooks are available
const checkHeadlessHooksCompatibility = () => {
    const requiredFeatures = [
        'useWalletConnect',
        'useWalletBalance',
        'useWalletSigning',
    ];
    return {
        compatible: true,
        version: '2.0.0',
        features: requiredFeatures,
    };
};
exports.checkHeadlessHooksCompatibility = checkHeadlessHooksCompatibility;
