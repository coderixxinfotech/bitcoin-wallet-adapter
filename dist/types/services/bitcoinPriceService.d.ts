/**
 * Bitcoin Price Service
 * Fetches Bitcoin price from multiple sources for reliability
 */
export interface BitcoinPriceData {
    price: number;
    source: string;
    timestamp: number;
    currency: string;
}
export interface PriceSourceError {
    source: string;
    error: string;
    timestamp: number;
}
export interface BitcoinPriceResponse {
    prices: BitcoinPriceData[];
    errors: PriceSourceError[];
    averagePrice: number;
    lastUpdated: number;
}
declare class BitcoinPriceService {
    private readonly sources;
    private cache;
    private cacheExpiry;
    private lastFetch;
    /**
     * Fetch Bitcoin price from a single source
     */
    private fetchFromSource;
    /**
     * Fetch Bitcoin prices from all sources
     */
    fetchAllPrices(): Promise<BitcoinPriceResponse>;
    /**
     * Get cached data without making a new request
     */
    getCachedData(): BitcoinPriceResponse | null;
    /**
     * Check if cache is expired
     */
    isCacheExpired(): boolean;
    /**
     * Clear the cache
     */
    clearCache(): void;
}
export declare const bitcoinPriceService: BitcoinPriceService;
export {};
