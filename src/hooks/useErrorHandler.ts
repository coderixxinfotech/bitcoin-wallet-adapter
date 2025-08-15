/**
 * React Hook for Professional Error Handling in User Applications
 */

import { useEffect, useCallback, useState } from 'react';
import { BWAError, BWAErrorCode, bwaErrorManager, ErrorHandler } from '../utils/errorHandler';

export interface UseErrorHandlerOptions {
  // Callback when an error occurs
  onError?: (error: BWAError) => void;
  
  // Filter errors by codes (only handle specified error codes)
  filterCodes?: BWAErrorCode[];
  
  // Filter errors by severity
  filterSeverity?: string[];
  
  // Auto-clear errors after specified time (ms)
  autoClearTimeout?: number;
  
  // Maximum number of errors to keep in state
  maxErrors?: number;
}

export interface UseErrorHandlerReturn {
  // Current errors
  errors: BWAError[];
  
  // Latest error
  latestError: BWAError | null;
  
  // Error count
  errorCount: number;
  
  // Clear all errors
  clearErrors: () => void;
  
  // Clear specific error by timestamp
  clearError: (timestamp: number) => void;
  
  // Check if there are errors of specific code
  hasError: (code?: BWAErrorCode) => boolean;
  
  // Get errors by code
  getErrorsByCode: (code: BWAErrorCode) => BWAError[];
  
  // Get error history from manager
  getErrorHistory: () => BWAError[];
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}): UseErrorHandlerReturn {
  const {
    onError,
    filterCodes,
    filterSeverity,
    autoClearTimeout,
    maxErrors = 10
  } = options;

  const [errors, setErrors] = useState<BWAError[]>([]);

  const shouldHandleError = useCallback((error: BWAError): boolean => {
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

  const handleError: ErrorHandler = useCallback((error: BWAError) => {
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
    onError?.(error);

    // Auto-clear if timeout is specified
    if (autoClearTimeout) {
      setTimeout(() => {
        setErrors(prevErrors => prevErrors.filter(e => e.timestamp !== error.timestamp));
      }, autoClearTimeout);
    }
  }, [shouldHandleError, onError, maxErrors, autoClearTimeout]);

  // Register error handler
  useEffect(() => {
    const unsubscribe = bwaErrorManager.onError(handleError);
    return unsubscribe;
  }, [handleError]);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const clearError = useCallback((timestamp: number) => {
    setErrors(prevErrors => prevErrors.filter(error => error.timestamp !== timestamp));
  }, []);

  const hasError = useCallback((code?: BWAErrorCode) => {
    if (code) {
      return errors.some(error => error.code === code);
    }
    return errors.length > 0;
  }, [errors]);

  const getErrorsByCode = useCallback((code: BWAErrorCode) => {
    return errors.filter(error => error.code === code);
  }, [errors]);

  const getErrorHistory = useCallback(() => {
    return bwaErrorManager.getErrorHistory();
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

// Specialized hooks for common use cases

export function useWalletErrors(onError?: (error: BWAError) => void) {
  return useErrorHandler({
    onError,
    filterCodes: [
      BWAErrorCode.WALLET_NOT_FOUND,
      BWAErrorCode.WALLET_NOT_CONNECTED,
      BWAErrorCode.WALLET_CONNECTION_FAILED,
      BWAErrorCode.WALLET_DISCONNECTION_FAILED,
      BWAErrorCode.UNSUPPORTED_WALLET
    ]
  });
}

export function useTransactionErrors(onError?: (error: BWAError) => void) {
  return useErrorHandler({
    onError,
    filterCodes: [
      BWAErrorCode.TRANSACTION_SIGNING_FAILED,
      BWAErrorCode.TRANSACTION_BROADCASTING_FAILED,
      BWAErrorCode.PSBT_INVALID,
      BWAErrorCode.PSBT_SIGNING_FAILED,
      BWAErrorCode.PAYMENT_FAILED,
      BWAErrorCode.INSUFFICIENT_FUNDS
    ]
  });
}

export function useCriticalErrors(onError?: (error: BWAError) => void) {
  return useErrorHandler({
    onError,
    filterSeverity: ['critical', 'high'],
    autoClearTimeout: 10000 // Auto-clear critical errors after 10 seconds
  });
}
