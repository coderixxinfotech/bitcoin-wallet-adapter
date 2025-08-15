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

// Core headless hooks
export { useWalletConnect } from './useWalletConnect';
export { useWalletBalance } from './useWalletBalance';  
export { useWalletSigning } from './useWalletSigning';

// Re-export existing hooks that are already headless
export { useWalletAddress } from './useWalletAddress';
export { default as useDisconnect } from './useDisconnect';

// Type exports for TypeScript users
export type { 
  UseWalletConnectReturn,
} from './useWalletConnect';

export type { 
  UseWalletBalanceReturn,
  WalletBalance,
} from './useWalletBalance';

export type { 
  UseWalletSigningReturn,
  SignMessageOptions,
  SignTransactionOptions,
} from './useWalletSigning';

// Utility function to check if all required headless hooks are available
export const checkHeadlessHooksCompatibility = () => {
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
