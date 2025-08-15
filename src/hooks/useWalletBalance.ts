import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../stores";
import { throwBWAError, BWAErrorCode, BWAErrorSeverity } from "../utils/errorHandler";

export interface WalletBalance {
  btc: number | null;
  usd: number | null;
  confirmed: number | null;
  unconfirmed: number | null;
  total: number | null;
}

export interface UseWalletBalanceReturn {
  // Balance State
  balance: WalletBalance;
  btcPrice: number | null;
  isLoading: boolean;
  error: Error | null;
  
  // Actions
  fetchBalance: () => Promise<void>;
  refreshPrice: () => Promise<void>;
  
  // Utilities
  formatBalance: (amount: number, decimals?: number) => string;
  convertToUSD: (btcAmount: number) => number | null;
}

interface CustomWindow extends Window {
  unisat?: any;
  LeatherProvider?: any;
  phantom?: any;
  okxwallet?: any;
}

declare const window: CustomWindow;

/**
 * Headless hook for wallet balance management
 * Provides balance fetching and formatting utilities without UI
 */
export const useWalletBalance = (): UseWalletBalanceReturn => {
  const walletDetails = useSelector((state: RootState) => state.general.walletDetails);
  const bitcoinPriceState = useSelector((state: RootState) => state.bitcoinPrice);
  const btcPrice = bitcoinPriceState.data?.averagePrice || null;
  
  const [balance, setBalance] = useState<WalletBalance>({
    btc: null,
    usd: null,
    confirmed: null,
    unconfirmed: null,
    total: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch balance from the connected wallet
   */
  const fetchBalance = useCallback(async () => {
    if (!walletDetails?.cardinal || !walletDetails?.wallet) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let walletBalance: Partial<WalletBalance> = {};

      switch (walletDetails.wallet.toLowerCase()) {
        case "unisat":
          walletBalance = await fetchUnisatBalance();
          break;
        case "leather":
          walletBalance = await fetchLeatherBalance();
          break;
        case "phantom":
          walletBalance = await fetchPhantomBalance();
          break;
        case "okx":
          walletBalance = await fetchOKXBalance();
          break;
        default:
          // For other wallets, use a generic API or blockchain explorer
          walletBalance = await fetchGenericBalance();
          break;
      }

      // Calculate USD value if BTC amount and price are available
      if (walletBalance.btc && btcPrice) {
        walletBalance.usd = walletBalance.btc * btcPrice;
      }

      setBalance(prevBalance => ({
        ...prevBalance,
        ...walletBalance,
      }));

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch balance');
      setError(error);
      console.error("Balance fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [walletDetails?.cardinal, walletDetails?.wallet, btcPrice]);

  /**
   * Refresh BTC price from external API
   * Note: This now uses the centralized bitcoin price Redux state
   */
  const refreshPrice = useCallback(async () => {
    try {
      // The bitcoin price is now managed centrally by the useBitcoinPrice hook
      // This function is kept for backward compatibility but doesn't need to do anything
      console.log("Bitcoin price is now managed by the centralized Redux state");
    } catch (err) {
      console.error("Failed to refresh BTC price:", err);
    }
  }, []);

  /**
   * Format balance amount for display
   */
  const formatBalance = useCallback((amount: number, decimals: number = 8): string => {
    if (amount === 0) return "0";
    
    // For very small amounts, show more decimals
    if (amount < 0.001) {
      return amount.toFixed(decimals);
    }
    
    // For larger amounts, show fewer decimals
    if (amount >= 1) {
      return amount.toFixed(4);
    }
    
    return amount.toFixed(6);
  }, []);

  /**
   * Convert BTC amount to USD
   */
  const convertToUSD = useCallback((btcAmount: number): number | null => {
    if (!btcPrice || btcAmount === 0) return null;
    return btcAmount * btcPrice;
  }, [btcPrice]);

  // Wallet-specific balance fetching methods
  const fetchUnisatBalance = async (): Promise<Partial<WalletBalance>> => {
    if (!window.unisat) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_FOUND,
        "Unisat wallet is not available for balance fetch",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'balance_fetch',
            additionalData: { walletType: 'Unisat' }
          }
        }
      );
    }

    const balance = await window.unisat.getBalance();
    
    return {
      btc: balance.total / 100000000, // Convert satoshis to BTC
      confirmed: balance.confirmed / 100000000,
      unconfirmed: balance.unconfirmed / 100000000,
      total: balance.total / 100000000,
    };
  };

  const fetchLeatherBalance = async (): Promise<Partial<WalletBalance>> => {
    if (!window.LeatherProvider) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_FOUND,
        "Leather wallet is not available for balance fetch",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'balance_fetch',
            additionalData: { walletType: 'Leather' }
          }
        }
      );
    }

    try {
      // Try the getBalance method first, but fall back to address-based lookup if it fails
      try {
        const response = await window.LeatherProvider.request("getBalance");
        if (response?.result) {
          const btcBalance = response.result.find((balance: any) => 
            balance.symbol === "BTC" || balance.currency === "BTC"
          );

          if (btcBalance) {
            const btcAmount = parseFloat(btcBalance.total || btcBalance.amount || btcBalance.balance) / 100000000;
            
            return {
              btc: btcAmount,
              total: btcAmount,
              confirmed: btcAmount, // Leather doesn't separate confirmed/unconfirmed
              unconfirmed: 0,
            };
          }
        }
      } catch (balanceError) {
        console.warn("Leather getBalance method failed, trying fallback:", balanceError);
      }

      // Fallback: Use generic balance fetching with the wallet address
      if (walletDetails?.cardinal) {
        console.log("Using fallback balance fetch for Leather wallet");
        return await fetchGenericBalance();
      }

      // If all else fails, return zero balance instead of throwing an error
      console.warn("Could not fetch Leather wallet balance, returning zero");
      return {
        btc: 0,
        total: 0,
        confirmed: 0,
        unconfirmed: 0,
      };

    } catch (err) {
      console.error("Leather balance fetch error:", err);
      // Return zero balance instead of throwing to prevent UI breaking
      return {
        btc: 0,
        total: 0,
        confirmed: 0,
        unconfirmed: 0,
      };
    }
  };

  const fetchPhantomBalance = async (): Promise<Partial<WalletBalance>> => {
    if (!window.phantom?.bitcoin) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_FOUND,
        "Phantom wallet is not available for balance fetch",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'balance_fetch',
            additionalData: { walletType: 'Phantom' }
          }
        }
      );
    }

    try {
      // Phantom may not have a direct balance API, so we might need to use a blockchain explorer
      return await fetchGenericBalance();
    } catch (err) {
      throwBWAError(
        BWAErrorCode.NETWORK_ERROR,
        "Failed to fetch Phantom wallet balance",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'balance_fetch',
            additionalData: { 
              walletType: 'Phantom',
              originalError: String(err)
            }
          }
        }
      );
    }
  };

  const fetchOKXBalance = async (): Promise<Partial<WalletBalance>> => {
    if (!window.okxwallet?.bitcoin) {
      throwBWAError(
        BWAErrorCode.WALLET_NOT_FOUND,
        "OKX wallet is not available for balance fetch",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'balance_fetch',
            additionalData: { walletType: 'OKX' }
          }
        }
      );
    }

    try {
      // OKX may not have a direct balance API, so we might need to use a blockchain explorer
      return await fetchGenericBalance();
    } catch (err) {
      throwBWAError(
        BWAErrorCode.NETWORK_ERROR,
        "Failed to fetch OKX wallet balance",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'balance_fetch',
            additionalData: { 
              walletType: 'OKX',
              originalError: String(err)
            }
          }
        }
      );
    }
  };

  const fetchGenericBalance = async (): Promise<Partial<WalletBalance>> => {
    if (!walletDetails?.cardinal) {
      throwBWAError(
        BWAErrorCode.VALIDATION_ERROR,
        "No wallet address available for balance fetch",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'balance_fetch',
            additionalData: { reason: 'no_wallet_address' }
          }
        }
      );
    }

    try {
      // Use a blockchain explorer API (e.g., BlockCypher, Mempool.space)
      // This is a placeholder - you'd implement actual API calls here
      
      // Example using BlockCypher API (requires API key for production)
      const response = await fetch(
        `https://api.blockcypher.com/v1/btc/main/addrs/${walletDetails.cardinal}/balance`
      );

      if (!response.ok) {
        throwBWAError(
          BWAErrorCode.NETWORK_ERROR,
          "Blockchain API request failed during balance fetch",
          {
            severity: BWAErrorSeverity.HIGH,
            context: { 
              operation: 'balance_fetch',
              additionalData: { 
                apiStatus: response.status,
                apiUrl: 'blockcypher.com'
              }
            }
          }
        );
      }

      const data = await response.json();
      
      return {
        btc: data.balance / 100000000, // Convert satoshis to BTC
        confirmed: data.balance / 100000000,
        unconfirmed: data.unconfirmed_balance / 100000000,
        total: (data.balance + data.unconfirmed_balance) / 100000000,
      };
    } catch (err) {
      // Fallback: return zero balance rather than failing completely
      console.warn("Failed to fetch balance from blockchain API:", err);
      return {
        btc: 0,
        confirmed: 0,
        unconfirmed: 0,
        total: 0,
      };
    }
  };

  // Auto-fetch balance when wallet connects
  useEffect(() => {
    if (walletDetails?.cardinal && walletDetails?.connected) {
      fetchBalance();
    } else {
      // Reset balance when wallet disconnects
      setBalance({
        btc: null,
        usd: null,
        confirmed: null,
        unconfirmed: null,
        total: null,
      });
      setError(null);
    }
  }, [walletDetails?.cardinal, walletDetails?.connected, fetchBalance]);

  // Update USD value when BTC price changes
  useEffect(() => {
    if (balance.btc && btcPrice) {
      setBalance(prev => ({
        ...prev,
        usd: prev.btc ? prev.btc * btcPrice : null,
      }));
    }
  }, [balance.btc, btcPrice]);

  return {
    // Balance State
    balance,
    btcPrice,
    isLoading,
    error,
    
    // Actions
    fetchBalance,
    refreshPrice,
    
    // Utilities
    formatBalance,
    convertToUSD,
  };
};
