import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWallets } from "@wallet-standard/react";
import type { WalletWithFeatures } from "@wallet-standard/base";
import { 
  throwBWAError, 
  wrapAndThrowError, 
  BWAErrorCode,
  BWAErrorSeverity 
} from "../utils/errorHandler";
import {
  BitcoinNetworkType,
  getAddress,
} from "sats-connect";

import { 
  setLastWallet,
  setWalletDetails,
  setNetwork,
} from "../stores/reducers/generalReducer";
import { addNotification } from "../stores/reducers/notificationReducers";
import { RootState } from "../stores";
import { WalletDetails, IAvailableWallet, Account } from "../types";
import { getBTCPriceInDollars } from "../utils";

interface CustomWindow extends Window {
  LeatherProvider?: any;
  unisat?: any;
  BitcoinProvider?: any;
  magicEden?: any;
  phantom?: any;
  okxwallet?: any;
}

declare const window: CustomWindow;

const SatsConnectNamespace = "sats-connect:";
const purposes: string[] = ["ordinals", "payment"];

export interface UseWalletConnectReturn {
  // Connection State
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
  
  // Wallet Information
  currentWallet: WalletDetails | null;
  lastWallet: string;
  availableWallets: IAvailableWallet[];
  meWallets: readonly any[];
  
  // Actions
  connect: (walletType: string, options?: any) => Promise<void>;
  disconnect: () => void;
  
  // Utilities
  checkAvailableWallets: () => IAvailableWallet[];
  refreshBalance: () => Promise<void>;
}

/**
 * Headless hook for wallet connection and management
 * Provides all wallet connection logic without any UI components
 */
export const useWalletConnect = (): UseWalletConnectReturn => {
  const dispatch = useDispatch();
  const { wallets: meWallets } = useWallets();
  
  // State from Redux
  const walletDetails = useSelector((state: RootState) => state.general.walletDetails);
  const lastWallet = useSelector((state: RootState) => state.general.lastWallet);
  
  // Local State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [availableWallets, setAvailableWallets] = useState<IAvailableWallet[]>([]);

  // Derived State
  const isConnected = !!(walletDetails?.cardinal || walletDetails?.ordinal);

  /**
   * Check which wallets are available/installed
   */
  const checkAvailableWallets = useCallback((): IAvailableWallet[] => {
    const wallets: IAvailableWallet[] = [];

    // Check Leather Wallet
    if (window.LeatherProvider) {
      wallets.push({
        label: "Leather",
        logo: "/leather.png",
        connector: "leather",
        installed: true,
      });
    }

    // Check Unisat Wallet
    if (window.unisat) {
      wallets.push({
        label: "Unisat",
        logo: "/unisat.png", 
        connector: "unisat",
        installed: true,
      });
    }

    // Check Xverse Wallet (via sats-connect)
    if (typeof window !== "undefined") {
      wallets.push({
        label: "Xverse",
        logo: "/xverse.png",
        connector: "xverse",
        installed: true, // Always show as available since it uses web API
      });
    }

    // Check Phantom Wallet
    if (window.phantom?.bitcoin) {
      wallets.push({
        label: "Phantom",
        logo: "/phantom.png",
        connector: "phantom", 
        installed: true,
      });
    }

    // Check OKX Wallet
    if (window.okxwallet?.bitcoin) {
      wallets.push({
        label: "OKX Wallet",
        logo: "/okx.png",
        connector: "okx",
        installed: true,
      });
    }

    // Check Magic Eden Wallets
    if (meWallets && meWallets.length > 0) {
      meWallets.forEach((wallet: any) => {
        if (wallet.name && wallet.name.includes("Magic Eden")) {
          wallets.push({
            label: wallet.name,
            logo: "/magiceden.png",
            connector: "magiceden",
            installed: true,
          });
        }
      });
    }

    return wallets;
  }, [meWallets]);

  /**
   * Connect to a specific wallet
   */
  const connect = useCallback(async (walletType: string, options?: any) => {
    setIsLoading(true);
    setError(null);

    try {
      switch (walletType.toLowerCase()) {
        case "leather":
          await connectLeather();
          break;
        case "unisat":
          await connectUnisat();
          break;
        case "xverse":
          await connectXverse(options);
          break;
        case "phantom":
          await connectPhantom();
          break;
        case "okx":
          await connectOKX();
          break;
        case "magiceden":
          await connectMagicEden(options?.wallet);
          break;
        default:
          throwBWAError(
            BWAErrorCode.UNSUPPORTED_WALLET,
            `Unsupported wallet type: ${walletType}`,
            {
              severity: BWAErrorSeverity.HIGH,
              context: {
                walletType,
                operation: 'wallet_connect',
                additionalData: { supportedWallets: ['leather', 'unisat', 'xverse', 'phantom', 'okx', 'magiceden'] }
              },
              recoverable: true
            }
          );
      }

      // Store the last connected wallet
      localStorage.setItem("lastWallet", walletType);
      dispatch(setLastWallet(walletType));

    } catch (err) {
      wrapAndThrowError(
        err as Error,
        BWAErrorCode.WALLET_CONNECTION_FAILED,
        `Failed to connect to ${walletType} wallet`,
        {
          walletType,
          operation: 'wallet_connect',
          timestamp: Date.now()
        }
      );
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  /**
   * Disconnect current wallet
   */
  const disconnect = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem("lastWallet");
    localStorage.removeItem("walletDetails");
    
    // Clear wallet-related items from localStorage
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith("wallet")) {
        localStorage.removeItem(key);
      }
    }

    // Clear Redux state
    dispatch(setLastWallet(""));
    dispatch(setWalletDetails(null));
    
    setError(null);
  }, [dispatch]);

  /**
   * Refresh wallet balance
   * Note: Bitcoin price is now managed centrally by the useBitcoinPrice hook
   */
  const refreshBalance = useCallback(async () => {
    if ((walletDetails?.cardinal || walletDetails?.ordinal) && lastWallet) {
      try {
        // Bitcoin price fetching is now handled centrally
        console.log("Bitcoin price is managed centrally by the Redux state");
      } catch (err) {
        console.error("Failed to refresh balance:", err);
      }
    }
  }, [walletDetails?.cardinal, walletDetails?.ordinal, lastWallet, dispatch]);

  // Wallet-specific connection methods
  const connectLeather = async () => {
    if (!window.LeatherProvider) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_FOUND,
        "Leather wallet is not available or not installed",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'wallet_connection',
            additionalData: { walletType: 'Leather' }
          }
        }
      );
    }

    const response = await window.LeatherProvider.request("getAddresses");
    const btcAddress = response.result.addresses.find((addr: any) => 
      addr.symbol === "BTC"
    );

    if (!btcAddress) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_FOUND,
        "No Bitcoin address found in Leather wallet",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'wallet_connection',
            additionalData: { 
              walletType: 'Leather',
              addressType: 'BTC'
            }
          }
        }
      );
    }

    const walletDetail: WalletDetails = {
      cardinal: btcAddress.address,
      cardinalPubkey: btcAddress.publicKey || '',
      ordinal: btcAddress.address,
      ordinalPubkey: btcAddress.publicKey || '',
      connected: true,
      wallet: "Leather",
    };

    dispatch(setWalletDetails(walletDetail));
    localStorage.setItem("walletDetails", JSON.stringify(walletDetail));
  };

  const connectUnisat = async () => {
    if (!window.unisat) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_FOUND,
        "Unisat wallet is not available or not installed",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'wallet_connection',
            additionalData: { walletType: 'Unisat' }
          }
        }
      );
    }

    const accounts = await window.unisat.requestAccounts();
    if (!accounts || accounts.length === 0) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_FOUND,
        "No accounts found in Unisat wallet",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'wallet_connection',
            additionalData: { 
              walletType: 'Unisat',
              reason: 'no_accounts_available'
            }
          }
        }
      );
    }

    const address = accounts[0];
    // Get public key from Unisat wallet if available
    let publicKey = '';
    try {
      publicKey = await window.unisat.getPublicKey();
    } catch (err) {
      console.warn("Could not get public key from Unisat:", err);
    }
    
    const walletDetail: WalletDetails = {
      cardinal: address,
      cardinalPubkey: publicKey || '',
      ordinal: address,
      ordinalPubkey: publicKey || '',
      connected: true,
      wallet: "Unisat",
    };

    dispatch(setWalletDetails(walletDetail));
    localStorage.setItem("walletDetails", JSON.stringify(walletDetail));
  };

  const connectXverse = async (options: any = {}) => {
    const getAddressOptions = {
      payload: {
        purposes: purposes as any,
        message: "Address for receiving Ordinals and payments",
        network: {
          type: options.network || BitcoinNetworkType.Mainnet,
        },
      },
      onFinish: (response: any) => {
        const accounts = response.addresses;
        const paymentAccount = accounts.find((acc: Account) => acc.purpose === 'payment');
        const ordinalsAccount = accounts.find((acc: Account) => acc.purpose === 'ordinals');
        
        const walletDetail: WalletDetails = {
          cardinal: paymentAccount?.address || '',
          cardinalPubkey: paymentAccount?.publicKey || '',
          ordinal: ordinalsAccount?.address || '',
          ordinalPubkey: ordinalsAccount?.publicKey || '',
          connected: true,
          wallet: 'Xverse'
        };

        dispatch(setWalletDetails(walletDetail));
        localStorage.setItem("walletDetails", JSON.stringify(walletDetail));
      },
      onCancel: () => {
        throwBWAError(
          BWAErrorCode.USER_REJECTED,
          "User canceled Xverse wallet connection",
          {
            severity: BWAErrorSeverity.MEDIUM,
            context: { 
              operation: 'wallet_connection',
              additionalData: { walletType: 'Xverse' }
            }
          }
        );
      },
    };

    await getAddress(getAddressOptions);
  };

  const connectPhantom = async () => {
    if (!window.phantom?.bitcoin) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_FOUND,
        "Phantom wallet is not available or not installed",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'wallet_connection',
            additionalData: { walletType: 'Phantom' }
          }
        }
      );
    }

    const response = await window.phantom.bitcoin.requestAccounts();
    if (!response || response.length === 0) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_FOUND,
        "No accounts found in Phantom wallet",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'wallet_connection',
            additionalData: { 
              walletType: 'Phantom',
              reason: 'no_accounts_available'
            }
          }
        }
      );
    }

    const address = response[0].address;
    const walletDetail: WalletDetails = {
      cardinal: address,
      cardinalPubkey: response[0].publicKey || '',
      ordinal: address,
      ordinalPubkey: response[0].publicKey || '',
      connected: true,
      wallet: "Phantom",
    };

    dispatch(setWalletDetails(walletDetail));
    localStorage.setItem("wallet-detail", JSON.stringify(walletDetail));
  };

  const connectOKX = async () => {
    if (!window.okxwallet?.bitcoin) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_FOUND,
        "OKX wallet is not available or not installed",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'wallet_connection',
            additionalData: { walletType: 'OKX' }
          }
        }
      );
    }

    const response = await window.okxwallet.bitcoin.requestAccounts();
    if (!response || response.length === 0) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_FOUND,
        "No accounts found in OKX wallet",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'wallet_connection',
            additionalData: { 
              walletType: 'OKX',
              reason: 'no_accounts_available'
            }
          }
        }
      );
    }

    const address = response[0].address;
    const walletDetail: WalletDetails = {
      cardinal: address,
      cardinalPubkey: response[0].publicKey || '',
      ordinal: address,
      ordinalPubkey: response[0].publicKey || '',
      connected: true,
      wallet: "OKX",
    };

    dispatch(setWalletDetails(walletDetail));
    localStorage.setItem("wallet-detail", JSON.stringify(walletDetail));
  };

  const connectMagicEden = async (wallet?: WalletWithFeatures<any>) => {
    const wallets: any[] = [...(meWallets || [])];
    if (!wallet && (!wallets || wallets.length === 0)) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_FOUND,
        "Magic Eden wallet is not available or not installed",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'wallet_connection',
            additionalData: { walletType: 'Magic Eden' }
          }
        }
      );
    }

    const targetWallet = wallet || wallets.find(w => 
      w.name.includes("Magic Eden")
    );

    if (!targetWallet) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_FOUND,
        "Magic Eden wallet is not available or not found",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'wallet_connection',
            additionalData: { walletType: 'Magic Eden' }
          }
        }
      );
    }

    // Magic Eden wallet connection logic would go here
    // This is a placeholder - actual implementation depends on their API
    throwBWAError(
      BWAErrorCode.VALIDATION_ERROR,
      "Magic Eden wallet connection is not yet implemented",
      {
        severity: BWAErrorSeverity.MEDIUM,
        context: { 
          operation: 'wallet_connection',
          additionalData: { 
            walletType: 'Magic Eden',
            reason: 'feature_not_implemented'
          }
        }
      }
    );
  };

  // Initialize available wallets on mount
  useEffect(() => {
    setAvailableWallets(checkAvailableWallets());
  }, []);

  // Auto-reconnect on page load if there was a previous connection
  useEffect(() => {
    const savedWallet = localStorage.getItem("lastWallet");
    const savedWalletDetails = localStorage.getItem("wallet-detail");
    
    if (savedWallet && savedWalletDetails && !isConnected) {
      try {
        const walletDetail = JSON.parse(savedWalletDetails);
        dispatch(setWalletDetails(walletDetail));
        dispatch(setLastWallet(savedWallet));
      } catch (err) {
        console.error("Failed to restore wallet connection:", err);
        localStorage.removeItem("lastWallet");
        localStorage.removeItem("wallet-detail");
      }
    }
  }, [isConnected, dispatch]);

  return {
    // Connection State
    isConnected,
    isLoading,
    error,
    
    // Wallet Information
    currentWallet: walletDetails,
    lastWallet,
    availableWallets,
    meWallets,
    
    // Actions
    connect,
    disconnect,
    
    // Utilities
    checkAvailableWallets,
    refreshBalance,
  };
};
