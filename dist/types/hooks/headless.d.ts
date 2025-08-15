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
export { useWalletConnect } from './useWalletConnect';
export { useWalletBalance } from './useWalletBalance';
export { useWalletSigning } from './useWalletSigning';
export { useWalletAddress } from './useWalletAddress';
export { default as useDisconnect } from './useDisconnect';
export type { UseWalletConnectReturn, } from './useWalletConnect';
export type { UseWalletBalanceReturn, WalletBalance, } from './useWalletBalance';
export type { UseWalletSigningReturn, SignMessageOptions, SignTransactionOptions, } from './useWalletSigning';
export declare const checkHeadlessHooksCompatibility: () => {
    compatible: boolean;
    version: string;
    features: string[];
};
