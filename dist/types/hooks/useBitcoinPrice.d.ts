import { RootState } from '../stores';
export interface UseBitcoinPriceReturn {
    bitcoinPrice: RootState['bitcoinPrice'];
    fetchPrice: () => void;
    getCachedPrice: () => void;
    enableAutoRefresh: (enabled: boolean) => void;
    clearPriceError: () => void;
    clearPrice: () => void;
    isLoading: boolean;
    hasError: boolean;
    hasData: boolean;
    averagePrice: number;
    lastUpdated: Date | null;
}
/**
 * Custom hook for managing Bitcoin price data with Redux
 * Provides automatic fetching, caching, and state management
 */
export declare function useBitcoinPrice(options?: {
    autoFetch?: boolean;
    refreshInterval?: number;
}): UseBitcoinPriceReturn;
export type { BitcoinPriceData, BitcoinPriceResponse, PriceSourceError } from '../services/bitcoinPriceService';
