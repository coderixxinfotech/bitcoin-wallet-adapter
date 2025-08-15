"use strict";
/**
 * Bitcoin Price Service
 * Fetches Bitcoin price from multiple sources for reliability
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bitcoinPriceService = void 0;
class BitcoinPriceService {
    constructor() {
        this.sources = [
            {
                name: 'CoinGecko',
                url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
                parser: (data) => { var _a; return (_a = data.bitcoin) === null || _a === void 0 ? void 0 : _a.usd; },
            },
            {
                name: 'CoinDesk',
                url: 'https://api.coindesk.com/v1/bpi/currentprice/USD.json',
                parser: (data) => { var _a, _b; return parseFloat((_b = (_a = data.bpi) === null || _a === void 0 ? void 0 : _a.USD) === null || _b === void 0 ? void 0 : _b.rate_float); },
            },
            {
                name: 'Binance',
                url: 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT',
                parser: (data) => parseFloat(data.price),
            },
            {
                name: 'Kraken',
                url: 'https://api.kraken.com/0/public/Ticker?pair=XBTUSD',
                parser: (data) => { var _a, _b, _c; return parseFloat((_c = (_b = (_a = data.result) === null || _a === void 0 ? void 0 : _a.XXBTZUSD) === null || _b === void 0 ? void 0 : _b.c) === null || _c === void 0 ? void 0 : _c[0]); },
            },
        ];
        this.cache = null;
        this.cacheExpiry = 30000; // 30 seconds
        this.lastFetch = 0;
    }
    /**
     * Fetch Bitcoin price from a single source
     */
    fetchFromSource(source) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(source.url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                const data = yield response.json();
                const price = source.parser(data);
                if (!price || isNaN(price)) {
                    throw new Error('Invalid price data received');
                }
                return {
                    price,
                    source: source.name,
                    timestamp: Date.now(),
                    currency: 'USD',
                };
            }
            catch (error) {
                return {
                    source: source.name,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    timestamp: Date.now(),
                };
            }
        });
    }
    /**
     * Fetch Bitcoin prices from all sources
     */
    fetchAllPrices() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            // Return cached data if still valid
            if (this.cache && (now - this.lastFetch) < this.cacheExpiry) {
                return this.cache;
            }
            console.log('🪙 Fetching Bitcoin prices from multiple sources...');
            const promises = this.sources.map(source => this.fetchFromSource(source));
            const results = yield Promise.allSettled(promises);
            const prices = [];
            const errors = [];
            results.forEach((result, index) => {
                var _a;
                if (result.status === 'fulfilled') {
                    const data = result.value;
                    if ('price' in data) {
                        prices.push(data);
                    }
                    else {
                        errors.push(data);
                    }
                }
                else {
                    errors.push({
                        source: this.sources[index].name,
                        error: ((_a = result.reason) === null || _a === void 0 ? void 0 : _a.message) || 'Promise rejected',
                        timestamp: now,
                    });
                }
            });
            // Calculate average price
            const averagePrice = prices.length > 0
                ? prices.reduce((sum, p) => sum + p.price, 0) / prices.length
                : 0;
            const response = {
                prices,
                errors,
                averagePrice,
                lastUpdated: now,
            };
            // Cache the response
            this.cache = response;
            this.lastFetch = now;
            console.log('🪙 Bitcoin price fetch complete:', {
                successfulSources: prices.length,
                failedSources: errors.length,
                averagePrice: averagePrice.toFixed(2),
            });
            return response;
        });
    }
    /**
     * Get cached data without making a new request
     */
    getCachedData() {
        const now = Date.now();
        if (this.cache && (now - this.lastFetch) < this.cacheExpiry) {
            return this.cache;
        }
        return null;
    }
    /**
     * Check if cache is expired
     */
    isCacheExpired() {
        const now = Date.now();
        return !this.cache || (now - this.lastFetch) >= this.cacheExpiry;
    }
    /**
     * Clear the cache
     */
    clearCache() {
        this.cache = null;
        this.lastFetch = 0;
    }
}
exports.bitcoinPriceService = new BitcoinPriceService();
