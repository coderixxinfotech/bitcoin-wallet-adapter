// Legacy wallet-specific hooks
import { useLeatherSign } from "./useLeatherSign";
import { useXverseSign } from "./useXverseSign";
import { useUnisatSign } from "./useUnisatSign";
import { useWalletAddress } from "./useWalletAddress";
import { useSignTx } from "./useSignTx";
import { useMessageSign } from "./useMessageSign";
import useDisconnect from "./useDisconnect";
import { usePayBTC } from "./usePayBTC";

// New headless hooks (recommended)
import { useWalletConnect } from "./useWalletConnect";
import { useWalletBalance } from "./useWalletBalance";
import { useWalletSigning } from "./useWalletSigning";
import { useBitcoinPrice } from "./useBitcoinPrice";
import { useNetwork } from "./useNetwork";

// Legacy exports (maintained for backward compatibility)
export {
  useLeatherSign,
  useXverseSign,
  useUnisatSign,
  useWalletAddress,
  useSignTx,
  useMessageSign,
  useDisconnect,
  usePayBTC,
};

// New headless hooks exports
export {
  useWalletConnect,
  useWalletBalance,
  useWalletSigning,
  useBitcoinPrice,
  useNetwork,
};

// Type exports
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

export type {
  UseBitcoinPriceReturn,
  BitcoinPriceData,
  BitcoinPriceResponse,
  PriceSourceError,
} from './useBitcoinPrice';

export type { Network } from './useNetwork';
