/**
 * React Hook for Professional Error Handling in User Applications
 */
import { BWAError, BWAErrorCode } from '../utils/errorHandler';
export interface UseErrorHandlerOptions {
    onError?: (error: BWAError) => void;
    filterCodes?: BWAErrorCode[];
    filterSeverity?: string[];
    autoClearTimeout?: number;
    maxErrors?: number;
}
export interface UseErrorHandlerReturn {
    errors: BWAError[];
    latestError: BWAError | null;
    errorCount: number;
    clearErrors: () => void;
    clearError: (timestamp: number) => void;
    hasError: (code?: BWAErrorCode) => boolean;
    getErrorsByCode: (code: BWAErrorCode) => BWAError[];
    getErrorHistory: () => BWAError[];
}
export declare function useErrorHandler(options?: UseErrorHandlerOptions): UseErrorHandlerReturn;
export declare function useWalletErrors(onError?: (error: BWAError) => void): UseErrorHandlerReturn;
export declare function useTransactionErrors(onError?: (error: BWAError) => void): UseErrorHandlerReturn;
export declare function useCriticalErrors(onError?: (error: BWAError) => void): UseErrorHandlerReturn;
