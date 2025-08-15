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

class BitcoinPriceService {
  private readonly sources = [
    {
      name: 'CoinGecko',
      url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
      parser: (data: any) => data.bitcoin?.usd,
    },
    {
      name: 'CoinDesk',
      url: 'https://api.coindesk.com/v1/bpi/currentprice/USD.json',
      parser: (data: any) => parseFloat(data.bpi?.USD?.rate_float),
    },
    {
      name: 'Binance',
      url: 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT',
      parser: (data: any) => parseFloat(data.price),
    },
    {
      name: 'Kraken',
      url: 'https://api.kraken.com/0/public/Ticker?pair=XBTUSD',
      parser: (data: any) => parseFloat(data.result?.XXBTZUSD?.c?.[0]),
    },
  ];

  private cache: BitcoinPriceResponse | null = null;
  private cacheExpiry = 30000; // 30 seconds
  private lastFetch = 0;

  /**
   * Fetch Bitcoin price from a single source
   */
  private async fetchFromSource(source: typeof this.sources[0]): Promise<BitcoinPriceData | PriceSourceError> {
    try {
      const response = await fetch(source.url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
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
    } catch (error) {
      return {
        source: source.name,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Fetch Bitcoin prices from all sources
   */
  async fetchAllPrices(): Promise<BitcoinPriceResponse> {
    const now = Date.now();
    
    // Return cached data if still valid
    if (this.cache && (now - this.lastFetch) < this.cacheExpiry) {
      return this.cache;
    }

    console.log('🪙 Fetching Bitcoin prices from multiple sources...');

    const promises = this.sources.map(source => this.fetchFromSource(source));
    const results = await Promise.allSettled(promises);

    const prices: BitcoinPriceData[] = [];
    const errors: PriceSourceError[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const data = result.value;
        if ('price' in data) {
          prices.push(data);
        } else {
          errors.push(data);
        }
      } else {
        errors.push({
          source: this.sources[index].name,
          error: result.reason?.message || 'Promise rejected',
          timestamp: now,
        });
      }
    });

    // Calculate average price
    const averagePrice = prices.length > 0 
      ? prices.reduce((sum, p) => sum + p.price, 0) / prices.length
      : 0;

    const response: BitcoinPriceResponse = {
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
  }

  /**
   * Get cached data without making a new request
   */
  getCachedData(): BitcoinPriceResponse | null {
    const now = Date.now();
    if (this.cache && (now - this.lastFetch) < this.cacheExpiry) {
      return this.cache;
    }
    return null;
  }

  /**
   * Check if cache is expired
   */
  isCacheExpired(): boolean {
    const now = Date.now();
    return !this.cache || (now - this.lastFetch) >= this.cacheExpiry;
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache = null;
    this.lastFetch = 0;
  }
}

export const bitcoinPriceService = new BitcoinPriceService();
