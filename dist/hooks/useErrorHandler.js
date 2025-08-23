"use strict";
/**
 * React Hook for Professional Error Handling in User Applications
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCriticalErrors = exports.useTransactionErrors = exports.useWalletErrors = exports.useErrorHandler = void 0;
const react_1 = require("react");
const errorHandler_1 = require("../utils/errorHandler");
function useErrorHandler(options = {}) {
    const { onError, filterCodes, filterSeverity, autoClearTimeout, maxErrors = 10 } = options;
    const [errors, setErrors] = (0, react_1.useState)([]);
    const shouldHandleError = (0, react_1.useCallback)((error) => {
        // Filter by error codes
        if (filterCodes && !filterCodes.includes(error.code)) {
            return false;
        }
        // Filter by severity
        if (filterSeverity && !filterSeverity.includes(error.severity)) {
            return false;
        }
        return true;
    }, [filterCodes, filterSeverity]);
    const handleError = (0, react_1.useCallback)((error) => {
        console.log('🔥 useErrorHandler - handleError called with:', error);
        if (!shouldHandleError(error)) {
            console.log('🚫 useErrorHandler - Error filtered out by shouldHandleError');
            return;
        }
        console.log('✅ useErrorHandler - Processing error');
        // Add error to state
        setErrors(prevErrors => {
            const newErrors = [error, ...prevErrors];
            console.log('📋 useErrorHandler - Updated errors state:', newErrors);
            return newErrors.slice(0, maxErrors);
        });
        // Call user-provided error handler
        console.log('🎯 useErrorHandler - Calling onError callback');
        onError === null || onError === void 0 ? void 0 : onError(error);
        // Auto-clear if timeout is specified
        if (autoClearTimeout) {
            setTimeout(() => {
                setErrors(prevErrors => prevErrors.filter(e => e.timestamp !== error.timestamp));
            }, autoClearTimeout);
        }
    }, [shouldHandleError, onError, maxErrors, autoClearTimeout]);
    // Register error handler
    (0, react_1.useEffect)(() => {
        const unsubscribe = errorHandler_1.bwaErrorManager.onError(handleError);
        return unsubscribe;
    }, [handleError]);
    const clearErrors = (0, react_1.useCallback)(() => {
        setErrors([]);
    }, []);
    const clearError = (0, react_1.useCallback)((timestamp) => {
        setErrors(prevErrors => prevErrors.filter(error => error.timestamp !== timestamp));
    }, []);
    const hasError = (0, react_1.useCallback)((code) => {
        if (code) {
            return errors.some(error => error.code === code);
        }
        return errors.length > 0;
    }, [errors]);
    const getErrorsByCode = (0, react_1.useCallback)((code) => {
        return errors.filter(error => error.code === code);
    }, [errors]);
    const getErrorHistory = (0, react_1.useCallback)(() => {
        return errorHandler_1.bwaErrorManager.getErrorHistory();
    }, []);
    return {
        errors,
        latestError: errors[0] || null,
        errorCount: errors.length,
        clearErrors,
        clearError,
        hasError,
        getErrorsByCode,
        getErrorHistory
    };
}
exports.useErrorHandler = useErrorHandler;
// Specialized hooks for common use cases
function useWalletErrors(onError) {
    return useErrorHandler({
        onError,
        filterCodes: [
            errorHandler_1.BWAErrorCode.WALLET_NOT_FOUND,
            errorHandler_1.BWAErrorCode.WALLET_NOT_CONNECTED,
            errorHandler_1.BWAErrorCode.WALLET_CONNECTION_FAILED,
            errorHandler_1.BWAErrorCode.WALLET_DISCONNECTION_FAILED,
            errorHandler_1.BWAErrorCode.UNSUPPORTED_WALLET
        ]
    });
}
exports.useWalletErrors = useWalletErrors;
function useTransactionErrors(onError) {
    return useErrorHandler({
        onError,
        filterCodes: [
            errorHandler_1.BWAErrorCode.TRANSACTION_SIGNING_FAILED,
            errorHandler_1.BWAErrorCode.TRANSACTION_BROADCASTING_FAILED,
            errorHandler_1.BWAErrorCode.PSBT_INVALID,
            errorHandler_1.BWAErrorCode.PSBT_SIGNING_FAILED,
            errorHandler_1.BWAErrorCode.PAYMENT_FAILED,
            errorHandler_1.BWAErrorCode.INSUFFICIENT_FUNDS
        ]
    });
}
exports.useTransactionErrors = useTransactionErrors;
function useCriticalErrors(onError) {
    return useErrorHandler({
        onError,
        filterSeverity: ['critical', 'high'],
        autoClearTimeout: 10000 // Auto-clear critical errors after 10 seconds
    });
}
exports.useCriticalErrors = useCriticalErrors;
