"use strict";
/**
 * Professional Error Handling System for Bitcoin Wallet Adapter
 * Provides structured error propagation from library to user applications
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorManager = exports.bwaErrorManager = exports.BWAError = exports.BWAErrorSeverity = exports.BWAErrorCode = void 0;
exports.throwBWAError = throwBWAError;
exports.wrapAndThrowError = wrapAndThrowError;
exports.withErrorHandling = withErrorHandling;
// Custom Error Types
var BWAErrorCode;
(function (BWAErrorCode) {
    // Wallet Connection Errors
    BWAErrorCode["WALLET_NOT_FOUND"] = "WALLET_NOT_FOUND";
    BWAErrorCode["WALLET_NOT_CONNECTED"] = "WALLET_NOT_CONNECTED";
    BWAErrorCode["WALLET_CONNECTION_FAILED"] = "WALLET_CONNECTION_FAILED";
    BWAErrorCode["WALLET_DISCONNECTION_FAILED"] = "WALLET_DISCONNECTION_FAILED";
    // Transaction Errors
    BWAErrorCode["TRANSACTION_SIGNING_FAILED"] = "TRANSACTION_SIGNING_FAILED";
    BWAErrorCode["TRANSACTION_BROADCASTING_FAILED"] = "TRANSACTION_BROADCASTING_FAILED";
    BWAErrorCode["PSBT_INVALID"] = "PSBT_INVALID";
    BWAErrorCode["PSBT_SIGNING_FAILED"] = "PSBT_SIGNING_FAILED";
    // Message Signing Errors
    BWAErrorCode["MESSAGE_SIGNING_FAILED"] = "MESSAGE_SIGNING_FAILED";
    BWAErrorCode["SIGNATURE_VERIFICATION_FAILED"] = "SIGNATURE_VERIFICATION_FAILED";
    // Network Errors
    BWAErrorCode["NETWORK_MISMATCH"] = "NETWORK_MISMATCH";
    BWAErrorCode["NETWORK_ERROR"] = "NETWORK_ERROR";
    // Payment Errors
    BWAErrorCode["PAYMENT_FAILED"] = "PAYMENT_FAILED";
    BWAErrorCode["INSUFFICIENT_FUNDS"] = "INSUFFICIENT_FUNDS";
    // User Action Errors
    BWAErrorCode["USER_CANCELLED"] = "USER_CANCELLED";
    BWAErrorCode["USER_REJECTED"] = "USER_REJECTED";
    // Configuration Errors
    BWAErrorCode["INVALID_CONFIGURATION"] = "INVALID_CONFIGURATION";
    BWAErrorCode["UNSUPPORTED_WALLET"] = "UNSUPPORTED_WALLET";
    BWAErrorCode["UNSUPPORTED_OPERATION"] = "UNSUPPORTED_OPERATION";
    // General Errors
    BWAErrorCode["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
    BWAErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
})(BWAErrorCode || (exports.BWAErrorCode = BWAErrorCode = {}));
var BWAErrorSeverity;
(function (BWAErrorSeverity) {
    BWAErrorSeverity["LOW"] = "low";
    BWAErrorSeverity["MEDIUM"] = "medium";
    BWAErrorSeverity["HIGH"] = "high";
    BWAErrorSeverity["CRITICAL"] = "critical";
})(BWAErrorSeverity || (exports.BWAErrorSeverity = BWAErrorSeverity = {}));
class BWAError extends Error {
    constructor(code, message, options = {}) {
        var _a, _b;
        super(message);
        this.name = 'BWAError';
        this.code = code;
        this.severity = options.severity || BWAErrorSeverity.MEDIUM;
        this.context = Object.assign({ timestamp: Date.now(), userAgent: typeof window !== 'undefined' ? (_a = window.navigator) === null || _a === void 0 ? void 0 : _a.userAgent : undefined, url: typeof window !== 'undefined' ? (_b = window.location) === null || _b === void 0 ? void 0 : _b.href : undefined }, options.context);
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
exports.BWAError = BWAError;
// Global Error Manager
class BWAErrorManager {
    constructor() {
        this.handlers = new Set();
        this.errorHistory = [];
        this.maxHistorySize = 100;
    }
    // Register error handler
    onError(handler) {
        this.handlers.add(handler);
        // Return unsubscribe function
        return () => {
            this.handlers.delete(handler);
        };
    }
    // Emit error to all registered handlers
    emitError(error) {
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
            }
            catch (handlerError) {
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
    getErrorHistory() {
        return [...this.errorHistory];
    }
    // Clear error history
    clearErrorHistory() {
        this.errorHistory = [];
    }
    // Create and emit error
    createAndEmitError(code, message, options = {}) {
        const error = new BWAError(code, message, options);
        this.emitError(error);
        return error;
    }
}
// Global instance
exports.bwaErrorManager = new BWAErrorManager();
exports.errorManager = exports.bwaErrorManager;
// Helper function to create and throw BWA errors
function throwBWAError(code, message, options = {}) {
    const error = new BWAError(code, message, options);
    exports.bwaErrorManager.emitError(error);
    throw error;
}
// Helper function to wrap and throw existing errors
function wrapAndThrowError(originalError, code, message, context) {
    const error = new BWAError(code, message || originalError.message, {
        originalError,
        context,
        severity: BWAErrorSeverity.HIGH
    });
    exports.bwaErrorManager.emitError(error);
    throw error;
}
// Helper to handle async operations with error wrapping
function withErrorHandling(operation, errorCode, context) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield operation();
        }
        catch (error) {
            return wrapAndThrowError(error, errorCode, `Operation failed: ${errorCode}`, context);
        }
    });
}
