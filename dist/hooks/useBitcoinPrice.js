"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBitcoinPrice = useBitcoinPrice;
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const bitcoinPriceReducer_1 = require("../stores/reducers/bitcoinPriceReducer");
/**
 * Custom hook for managing Bitcoin price data with Redux
 * Provides automatic fetching, caching, and state management
 */
function useBitcoinPrice(options = {}) {
    var _a, _b;
    const { autoFetch = true, refreshInterval = 1800000 } = options; // 30 minutes = 30 * 60 * 1000 ms
    const dispatch = (0, react_redux_1.useDispatch)();
    const bitcoinPriceState = (0, react_redux_1.useSelector)((state) => state.bitcoinPrice);
    const fetchPrice = (0, react_1.useCallback)(() => {
        dispatch((0, bitcoinPriceReducer_1.fetchBitcoinPrice)());
    }, [dispatch]);
    const getCachedPrice = (0, react_1.useCallback)(() => {
        dispatch((0, bitcoinPriceReducer_1.getCachedBitcoinPrice)());
    }, [dispatch]);
    const enableAutoRefresh = (0, react_1.useCallback)((enabled) => {
        dispatch((0, bitcoinPriceReducer_1.setAutoRefresh)(enabled));
    }, [dispatch]);
    const clearPriceError = (0, react_1.useCallback)(() => {
        dispatch((0, bitcoinPriceReducer_1.clearError)());
    }, [dispatch]);
    const clearPrice = (0, react_1.useCallback)(() => {
        dispatch((0, bitcoinPriceReducer_1.clearPriceData)());
    }, [dispatch]);
    // Auto-fetch price data on mount and set up refresh interval
    (0, react_1.useEffect)(() => {
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
    (0, react_1.useEffect)(() => {
        if (autoFetch && !bitcoinPriceState.data && !bitcoinPriceState.loading) {
            fetchPrice();
        }
    }, [autoFetch, bitcoinPriceState.data, bitcoinPriceState.loading, fetchPrice]);
    const computed = {
        isLoading: bitcoinPriceState.loading,
        hasError: !!bitcoinPriceState.error,
        hasData: !!bitcoinPriceState.data,
        averagePrice: ((_a = bitcoinPriceState.data) === null || _a === void 0 ? void 0 : _a.averagePrice) || 0,
        lastUpdated: ((_b = bitcoinPriceState.data) === null || _b === void 0 ? void 0 : _b.lastUpdated) ? new Date(bitcoinPriceState.data.lastUpdated) : null,
    };
    return Object.assign({ bitcoinPrice: bitcoinPriceState, fetchPrice,
        getCachedPrice,
        enableAutoRefresh,
        clearPriceError,
        clearPrice }, computed);
}
