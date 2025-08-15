export interface WalletBalance {
    btc: number | null;
    usd: number | null;
    confirmed: number | null;
    unconfirmed: number | null;
    total: number | null;
}
export interface UseWalletBalanceReturn {
    balance: WalletBalance;
    btcPrice: number | null;
    isLoading: boolean;
    error: Error | null;
    fetchBalance: () => Promise<void>;
    refreshPrice: () => Promise<void>;
    formatBalance: (amount: number, decimals?: number) => string;
    convertToUSD: (btcAmount: number) => number | null;
}
/**
 * Headless hook for wallet balance management
 * Provides balance fetching and formatting utilities without UI
 */
export declare const useWalletBalance: () => UseWalletBalanceReturn;
