import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { bitcoinPriceService, BitcoinPriceResponse } from '../../services/bitcoinPriceService';

export interface BitcoinPriceState {
  data: BitcoinPriceResponse | null;
  loading: boolean;
  error: string | null;
  autoRefreshEnabled: boolean;
  lastFetchTimestamp: number;
}

const initialState: BitcoinPriceState = {
  data: null,
  loading: false,
  error: null,
  autoRefreshEnabled: true,
  lastFetchTimestamp: 0,
};

// Async thunk for fetching bitcoin price
export const fetchBitcoinPrice = createAsyncThunk(
  'bitcoinPrice/fetchPrice',
  async (_, { rejectWithValue }) => {
    try {
      const priceData = await bitcoinPriceService.fetchAllPrices();
      return priceData;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch bitcoin price'
      );
    }
  }
);

// Async thunk for getting cached price data
export const getCachedBitcoinPrice = createAsyncThunk(
  'bitcoinPrice/getCachedPrice',
  async (_, { rejectWithValue }) => {
    try {
      const cachedData = bitcoinPriceService.getCachedData();
      if (cachedData) {
        return cachedData;
      } else {
        // If no cached data, fetch fresh data
        const priceData = await bitcoinPriceService.fetchAllPrices();
        return priceData;
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to get bitcoin price'
      );
    }
  }
);

const bitcoinPriceSlice = createSlice({
  name: 'bitcoinPrice',
  initialState,
  reducers: {
    setAutoRefresh: (state, action: PayloadAction<boolean>) => {
      state.autoRefreshEnabled = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearPriceData: (state) => {
      state.data = null;
      state.error = null;
      state.lastFetchTimestamp = 0;
      // Clear the service cache as well
      bitcoinPriceService.clearCache();
    },
  },
  extraReducers: (builder) => {
    // Handle fetchBitcoinPrice
    builder
      .addCase(fetchBitcoinPrice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBitcoinPrice.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
        state.lastFetchTimestamp = Date.now();
      })
      .addCase(fetchBitcoinPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Handle getCachedBitcoinPrice
    builder
      .addCase(getCachedBitcoinPrice.pending, (state) => {
        // Don't set loading for cached requests to avoid UI flicker
        if (!state.data) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(getCachedBitcoinPrice.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
        state.lastFetchTimestamp = Date.now();
      })
      .addCase(getCachedBitcoinPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setAutoRefresh, clearError, clearPriceData } = bitcoinPriceSlice.actions;

export default bitcoinPriceSlice.reducer;
