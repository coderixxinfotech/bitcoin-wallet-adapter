// What happens in this file:
// - Acts as the package entry point for all public exports
// - Re-exports providers, components, hooks, types, and utilities
// - Includes network switching hook `useNetwork` for global mainnet/testnet state
// Styles
import "./styles.css";

// Providers
import WalletProvider from "./common/Provider";

// Components
import ConnectMultiButton from "./components/ConnectMultiButton";
import Notification from "./components/Notification";
import PayButton from "./components/PayButton";

// Backward-compatibility alias for tests and legacy imports
export const ConnectButton = ConnectMultiButton;

// Hooks
import {
  useWalletAddress,
  useXverseSign,
  useUnisatSign,
  useLeatherSign,
  useSignTx,
  useMessageSign,
  useDisconnect,
  usePayBTC,
  useWalletConnect,
  useWalletBalance,
  useWalletSigning,
  useBitcoinPrice,
  useNetwork,
} from "./hooks";

// Export Providers
export { WalletProvider };

// Export Components
export { ConnectMultiButton, Notification, PayButton };

// Export notification system
export { addNotification, removeNotification } from "./stores/reducers/notificationReducers";

export function bytesToBase64(bytes: any) {
  const binString = String.fromCodePoint(...bytes);
  return btoa(binString);
}

// Export Redux DevTools utilities for development
export { DevToolsUtils, setupDevTools, useDevTools } from "./utils/devtools";

// Export professional error handling system
export {
  BWAError,
  BWAErrorCode,
  BWAErrorSeverity,
  bwaErrorManager,
  throwBWAError,
  wrapAndThrowError,
  withErrorHandling,
  errorManager
} from "./utils/errorHandler";

export type {
  BWAErrorContext,
  BWAErrorOptions,
  ErrorHandler
} from "./utils/errorHandler";

// Export error handling hooks
export {
  useErrorHandler,
  useWalletErrors,
  useTransactionErrors,
  useCriticalErrors
} from "./hooks/useErrorHandler";

export type {
  UseErrorHandlerOptions,
  UseErrorHandlerReturn
} from "./hooks/useErrorHandler";

// Export store types for advanced usage
export type { RootState, AppDispatch, BWAStore } from "./stores";

// Export Hooks
export {
  useWalletAddress,
  useXverseSign,
  useUnisatSign,
  useLeatherSign,
  useSignTx,
  useMessageSign,
  useDisconnect,
  usePayBTC,
  useWalletConnect,
  useWalletBalance,
  useWalletSigning,
  useBitcoinPrice,
  useNetwork,
};

// Export Bitcoin Price functionality
export {
  fetchBitcoinPrice,
  getCachedBitcoinPrice,
  setAutoRefresh,
  clearError,
  clearPriceData,
} from "./stores/reducers/bitcoinPriceReducer";

export type {
  BitcoinPriceData,
  BitcoinPriceResponse,
  PriceSourceError,
  UseBitcoinPriceReturn,
} from "./hooks/useBitcoinPrice";

// Export network type
export type { Network } from "./hooks";
