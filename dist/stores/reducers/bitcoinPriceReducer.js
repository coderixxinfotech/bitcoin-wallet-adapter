"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearPriceData = exports.clearError = exports.setAutoRefresh = exports.getCachedBitcoinPrice = exports.fetchBitcoinPrice = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const bitcoinPriceService_1 = require("../../services/bitcoinPriceService");
const initialState = {
    data: null,
    loading: false,
    error: null,
    autoRefreshEnabled: true,
    lastFetchTimestamp: 0,
};
// Async thunk for fetching bitcoin price
exports.fetchBitcoinPrice = (0, toolkit_1.createAsyncThunk)('bitcoinPrice/fetchPrice', (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { rejectWithValue }) {
    try {
        const priceData = yield bitcoinPriceService_1.bitcoinPriceService.fetchAllPrices();
        return priceData;
    }
    catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch bitcoin price');
    }
}));
// Async thunk for getting cached price data
exports.getCachedBitcoinPrice = (0, toolkit_1.createAsyncThunk)('bitcoinPrice/getCachedPrice', (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { rejectWithValue }) {
    try {
        const cachedData = bitcoinPriceService_1.bitcoinPriceService.getCachedData();
        if (cachedData) {
            return cachedData;
        }
        else {
            // If no cached data, fetch fresh data
            const priceData = yield bitcoinPriceService_1.bitcoinPriceService.fetchAllPrices();
            return priceData;
        }
    }
    catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : 'Failed to get bitcoin price');
    }
}));
const bitcoinPriceSlice = (0, toolkit_1.createSlice)({
    name: 'bitcoinPrice',
    initialState,
    reducers: {
        setAutoRefresh: (state, action) => {
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
            bitcoinPriceService_1.bitcoinPriceService.clearCache();
        },
    },
    extraReducers: (builder) => {
        // Handle fetchBitcoinPrice
        builder
            .addCase(exports.fetchBitcoinPrice.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(exports.fetchBitcoinPrice.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
            state.lastFetchTimestamp = Date.now();
        })
            .addCase(exports.fetchBitcoinPrice.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        // Handle getCachedBitcoinPrice
        builder
            .addCase(exports.getCachedBitcoinPrice.pending, (state) => {
            // Don't set loading for cached requests to avoid UI flicker
            if (!state.data) {
                state.loading = true;
            }
            state.error = null;
        })
            .addCase(exports.getCachedBitcoinPrice.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
            state.lastFetchTimestamp = Date.now();
        })
            .addCase(exports.getCachedBitcoinPrice.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});
_a = bitcoinPriceSlice.actions, exports.setAutoRefresh = _a.setAutoRefresh, exports.clearError = _a.clearError, exports.clearPriceData = _a.clearPriceData;
exports.default = bitcoinPriceSlice.reducer;
