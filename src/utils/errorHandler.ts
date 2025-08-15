/**
 * Professional Error Handling System for Bitcoin Wallet Adapter
 * Provides structured error propagation from library to user applications
 */

// Custom Error Types
export enum BWAErrorCode {
  // Wallet Connection Errors
  WALLET_NOT_FOUND = 'WALLET_NOT_FOUND',
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  WALLET_CONNECTION_FAILED = 'WALLET_CONNECTION_FAILED',
  WALLET_DISCONNECTION_FAILED = 'WALLET_DISCONNECTION_FAILED',
  
  // Transaction Errors
  TRANSACTION_SIGNING_FAILED = 'TRANSACTION_SIGNING_FAILED',
  TRANSACTION_BROADCASTING_FAILED = 'TRANSACTION_BROADCASTING_FAILED',
  PSBT_INVALID = 'PSBT_INVALID',
  PSBT_SIGNING_FAILED = 'PSBT_SIGNING_FAILED',
  
  // Message Signing Errors
  MESSAGE_SIGNING_FAILED = 'MESSAGE_SIGNING_FAILED',
  SIGNATURE_VERIFICATION_FAILED = 'SIGNATURE_VERIFICATION_FAILED',
  
  // Network Errors
  NETWORK_MISMATCH = 'NETWORK_MISMATCH',
  NETWORK_ERROR = 'NETWORK_ERROR',
  
  // Payment Errors
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  
  // User Action Errors
  USER_CANCELLED = 'USER_CANCELLED',
  USER_REJECTED = 'USER_REJECTED',
  
  // Configuration Errors
  INVALID_CONFIGURATION = 'INVALID_CONFIGURATION',
  UNSUPPORTED_WALLET = 'UNSUPPORTED_WALLET',
  UNSUPPORTED_OPERATION = 'UNSUPPORTED_OPERATION',
  
  // General Errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}

export enum BWAErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface BWAErrorContext {
  walletType?: string;
  operation?: string;
  network?: string;
  timestamp?: number;
  userAgent?: string;
  url?: string;
  additionalData?: Record<string, any>;
}

export interface BWAErrorOptions {
  severity?: BWAErrorSeverity;
  context?: BWAErrorContext;
  originalError?: Error;
  recoverable?: boolean;
}

export class BWAError extends Error {
  public readonly code: BWAErrorCode;
  public readonly severity: BWAErrorSeverity;
  public readonly context: BWAErrorContext;
  public readonly originalError?: Error;
  public readonly recoverable: boolean;
  public readonly timestamp: number;

  constructor(
    code: BWAErrorCode,
    message: string,
    options: BWAErrorOptions = {}
  ) {
    super(message);
    this.name = 'BWAError';
    this.code = code;
    this.severity = options.severity || BWAErrorSeverity.MEDIUM;
    this.context = {
      timestamp: Date.now(),
      userAgent: typeof window !== 'undefined' ? window.navigator?.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location?.href : undefined,
      ...options.context
    };
    this.originalError = options.originalError;
    this.recoverable = options.recoverable || false;
    this.timestamp = Date.now();
    
    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BWAError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      severity: this.severity,
      context: this.context,
      recoverable: this.recoverable,
      timestamp: this.timestamp,
      stack: this.stack,
      originalError: this.originalError ? {
        name: this.originalError.name,
        message: this.originalError.message,
        stack: this.originalError.stack
      } : undefined
    };
  }
}

// Error Handler Interface
export interface ErrorHandler {
  (error: BWAError): void;
}

// Global Error Manager
class BWAErrorManager {
  private handlers: Set<ErrorHandler> = new Set();
  private errorHistory: BWAError[] = [];
  private maxHistorySize = 100;

  // Register error handler
  onError(handler: ErrorHandler): () => void {
    this.handlers.add(handler);
    
    // Return unsubscribe function
    return () => {
      this.handlers.delete(handler);
    };
  }

  // Emit error to all registered handlers
  emitError(error: BWAError): void {
    console.log('🚀 BWAErrorManager - emitError called with:', error);
    console.log('📝 BWAErrorManager - Registered handlers count:', this.handlers.size);
    
    this.errorHistory.push(error);
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory = this.errorHistory.slice(-this.maxHistorySize);
    }
    
    let handlerIndex = 0;
    this.handlers.forEach((handler) => {
      handlerIndex++;
      console.log(`💬 BWAErrorManager - Calling handler ${handlerIndex}`);
      try {
        handler(error);
      } catch (handlerError) {
        console.error('Error handler failed:', handlerError);
      }
    });

    // Emit custom event for additional integration
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('bwa-error', {
        detail: error.toJSON()
      });
      window.dispatchEvent(event);
    }

    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 BWA ${error.severity.toUpperCase()} Error: ${error.code}`);
      console.error('Message:', error.message);
      console.error('Context:', error.context);
      if (error.originalError) {
        console.error('Original Error:', error.originalError);
      }
      console.error('Stack:', error.stack);
      console.groupEnd();
    }
  }

  // Get error history
  getErrorHistory(): BWAError[] {
    return [...this.errorHistory];
  }

  // Clear error history
  clearErrorHistory(): void {
    this.errorHistory = [];
  }

  // Create and emit error
  createAndEmitError(
    code: BWAErrorCode,
    message: string,
    options: BWAErrorOptions = {}
  ): BWAError {
    const error = new BWAError(code, message, options);
    this.emitError(error);
    return error;
  }
}

// Global instance
export const bwaErrorManager = new BWAErrorManager();

// Helper function to create and throw BWA errors
export function throwBWAError(
  code: BWAErrorCode,
  message: string,
  options: BWAErrorOptions = {}
): never {
  const error = new BWAError(code, message, options);
  bwaErrorManager.emitError(error);
  throw error;
}

// Helper function to wrap and throw existing errors
export function wrapAndThrowError(
  originalError: Error,
  code: BWAErrorCode,
  message?: string,
  context?: BWAErrorContext
): never {
  const error = new BWAError(
    code,
    message || originalError.message,
    {
      originalError,
      context,
      severity: BWAErrorSeverity.HIGH
    }
  );
  bwaErrorManager.emitError(error);
  throw error;
}

// Helper to handle async operations with error wrapping
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorCode: BWAErrorCode,
  context?: BWAErrorContext
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    return wrapAndThrowError(
      error as Error,
      errorCode,
      `Operation failed: ${errorCode}`,
      context
    );
  }
}

// Export the error manager for direct access
export { bwaErrorManager as errorManager };
