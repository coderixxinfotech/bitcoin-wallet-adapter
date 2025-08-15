/**
 * Professional Error Handling System for Bitcoin Wallet Adapter
 * Provides structured error propagation from library to user applications
 */
export declare enum BWAErrorCode {
    WALLET_NOT_FOUND = "WALLET_NOT_FOUND",
    WALLET_NOT_CONNECTED = "WALLET_NOT_CONNECTED",
    WALLET_CONNECTION_FAILED = "WALLET_CONNECTION_FAILED",
    WALLET_DISCONNECTION_FAILED = "WALLET_DISCONNECTION_FAILED",
    TRANSACTION_SIGNING_FAILED = "TRANSACTION_SIGNING_FAILED",
    TRANSACTION_BROADCASTING_FAILED = "TRANSACTION_BROADCASTING_FAILED",
    PSBT_INVALID = "PSBT_INVALID",
    PSBT_SIGNING_FAILED = "PSBT_SIGNING_FAILED",
    MESSAGE_SIGNING_FAILED = "MESSAGE_SIGNING_FAILED",
    SIGNATURE_VERIFICATION_FAILED = "SIGNATURE_VERIFICATION_FAILED",
    NETWORK_MISMATCH = "NETWORK_MISMATCH",
    NETWORK_ERROR = "NETWORK_ERROR",
    PAYMENT_FAILED = "PAYMENT_FAILED",
    INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS",
    USER_CANCELLED = "USER_CANCELLED",
    USER_REJECTED = "USER_REJECTED",
    INVALID_CONFIGURATION = "INVALID_CONFIGURATION",
    UNSUPPORTED_WALLET = "UNSUPPORTED_WALLET",
    UNSUPPORTED_OPERATION = "UNSUPPORTED_OPERATION",
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
    VALIDATION_ERROR = "VALIDATION_ERROR"
}
export declare enum BWAErrorSeverity {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
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
export declare class BWAError extends Error {
    readonly code: BWAErrorCode;
    readonly severity: BWAErrorSeverity;
    readonly context: BWAErrorContext;
    readonly originalError?: Error;
    readonly recoverable: boolean;
    readonly timestamp: number;
    constructor(code: BWAErrorCode, message: string, options?: BWAErrorOptions);
    toJSON(): {
        name: string;
        code: BWAErrorCode;
        message: string;
        severity: BWAErrorSeverity;
        context: BWAErrorContext;
        recoverable: boolean;
        timestamp: number;
        stack: string | undefined;
        originalError: {
            name: string;
            message: string;
            stack: string | undefined;
        } | undefined;
    };
}
export interface ErrorHandler {
    (error: BWAError): void;
}
declare class BWAErrorManager {
    private handlers;
    private errorHistory;
    private maxHistorySize;
    onError(handler: ErrorHandler): () => void;
    emitError(error: BWAError): void;
    getErrorHistory(): BWAError[];
    clearErrorHistory(): void;
    createAndEmitError(code: BWAErrorCode, message: string, options?: BWAErrorOptions): BWAError;
}
export declare const bwaErrorManager: BWAErrorManager;
export declare function throwBWAError(code: BWAErrorCode, message: string, options?: BWAErrorOptions): never;
export declare function wrapAndThrowError(originalError: Error, code: BWAErrorCode, message?: string, context?: BWAErrorContext): never;
export declare function withErrorHandling<T>(operation: () => Promise<T>, errorCode: BWAErrorCode, context?: BWAErrorContext): Promise<T>;
export { bwaErrorManager as errorManager };
