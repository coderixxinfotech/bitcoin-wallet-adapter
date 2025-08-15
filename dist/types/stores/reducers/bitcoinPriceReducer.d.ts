import { BitcoinPriceResponse } from '../../services/bitcoinPriceService';
export interface BitcoinPriceState {
    data: BitcoinPriceResponse | null;
    loading: boolean;
    error: string | null;
    autoRefreshEnabled: boolean;
    lastFetchTimestamp: number;
}
export declare const fetchBitcoinPrice: import("@reduxjs/toolkit").AsyncThunk<BitcoinPriceResponse, void, {
    state?: unknown;
    dispatch?: import("redux").Dispatch<import("redux").AnyAction> | undefined;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const getCachedBitcoinPrice: import("@reduxjs/toolkit").AsyncThunk<BitcoinPriceResponse, void, {
    state?: unknown;
    dispatch?: import("redux").Dispatch<import("redux").AnyAction> | undefined;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const setAutoRefresh: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "bitcoinPrice/setAutoRefresh">, clearError: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"bitcoinPrice/clearError">, clearPriceData: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"bitcoinPrice/clearPriceData">;
declare const _default: import("redux").Reducer<BitcoinPriceState>;
export default _default;
