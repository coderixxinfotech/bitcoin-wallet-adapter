import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../stores';
import {
  fetchBitcoinPrice,
  getCachedBitcoinPrice,
  setAutoRefresh,
  clearError,
  clearPriceData,
} from '../stores/reducers/bitcoinPriceReducer';

export interface UseBitcoinPriceReturn {
  // Data
  bitcoinPrice: RootState['bitcoinPrice'];
  
  // Actions
  fetchPrice: () => void;
  getCachedPrice: () => void;
  enableAutoRefresh: (enabled: boolean) => void;
  clearPriceError: () => void;
  clearPrice: () => void;
  
  // Computed values
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
export function useBitcoinPrice(options: {
  autoFetch?: boolean;
  refreshInterval?: number;
} = {}): UseBitcoinPriceReturn {
  const { autoFetch = true, refreshInterval = 1800000 } = options; // 30 minutes = 30 * 60 * 1000 ms
  
  const dispatch = useDispatch<AppDispatch>();
  const bitcoinPriceState = useSelector((state: RootState) => state.bitcoinPrice);
  
  const fetchPrice = useCallback(() => {
    dispatch(fetchBitcoinPrice());
  }, [dispatch]);
  
  const getCachedPrice = useCallback(() => {
    dispatch(getCachedBitcoinPrice());
  }, [dispatch]);
  
  const enableAutoRefresh = useCallback((enabled: boolean) => {
    dispatch(setAutoRefresh(enabled));
  }, [dispatch]);
  
  const clearPriceError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);
  
  const clearPrice = useCallback(() => {
    dispatch(clearPriceData());
  }, [dispatch]);
  
  // Auto-fetch price data on mount and set up refresh interval
  useEffect(() => {
    if (autoFetch) {
      // Get cached data first for immediate display
      getCachedPrice();
      
      // Set up refresh interval if auto-refresh is enabled
      if (bitcoinPriceState.autoRefreshEnabled) {
        const interval = setInterval(() => {
          fetchPrice();
        }, refreshInterval);
        
        return () => clearInterval(interval);
      }
    }
  }, [autoFetch, bitcoinPriceState.autoRefreshEnabled, refreshInterval, fetchPrice, getCachedPrice]);
  
  // Auto-fetch fresh data if we don't have any data yet
  useEffect(() => {
    if (autoFetch && !bitcoinPriceState.data && !bitcoinPriceState.loading) {
      fetchPrice();
    }
  }, [autoFetch, bitcoinPriceState.data, bitcoinPriceState.loading, fetchPrice]);
  
  const computed = {
    isLoading: bitcoinPriceState.loading,
    hasError: !!bitcoinPriceState.error,
    hasData: !!bitcoinPriceState.data,
    averagePrice: bitcoinPriceState.data?.averagePrice || 0,
    lastUpdated: bitcoinPriceState.data?.lastUpdated ? new Date(bitcoinPriceState.data.lastUpdated) : null,
  };
  
  return {
    bitcoinPrice: bitcoinPriceState,
    fetchPrice,
    getCachedPrice,
    enableAutoRefresh,
    clearPriceError,
    clearPrice,
    ...computed,
  };
}

// Export types for convenience
export type { BitcoinPriceData, BitcoinPriceResponse, PriceSourceError } from '../services/bitcoinPriceService';
