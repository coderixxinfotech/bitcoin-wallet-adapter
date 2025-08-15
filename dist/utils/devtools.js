"use strict";
/**
 * Redux DevTools utilities for Bitcoin Wallet Adapter
 *
 * This module provides utilities for enhanced Redux debugging experience
 * when developing applications with the Bitcoin Wallet Adapter.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDevTools = exports.setupDevTools = exports.DevToolsUtils = void 0;
const stores_1 = require("../stores");
/**
 * Enhanced Redux DevTools helper functions
 */
exports.DevToolsUtils = {
    /**
     * Get current store state (useful for debugging)
     */
    getState: () => stores_1.bwaStore.getState(),
    /**
     * Dispatch action for debugging purposes
     */
    dispatch: (action) => stores_1.bwaStore.dispatch(action),
    /**
     * Subscribe to store changes for debugging
     */
    subscribe: (listener) => stores_1.bwaStore.subscribe(listener),
    /**
     * Log current state to console (development only)
     */
    logState: () => {
        if (process.env.NODE_ENV !== 'production') {
            console.group('🪙 Bitcoin Wallet Adapter - Redux State');
            console.log('Current State:', stores_1.bwaStore.getState());
            console.groupEnd();
        }
    },
    /**
     * Log specific state slice to console (development only)
     */
    logStateSlice: (sliceName) => {
        if (process.env.NODE_ENV !== 'production') {
            const state = stores_1.bwaStore.getState();
            const sliceNameStr = String(sliceName);
            console.group(`🪙 Bitcoin Wallet Adapter - ${sliceNameStr} State`);
            console.log(`${sliceNameStr}:`, state[sliceName]);
            console.groupEnd();
        }
    },
    /**
     * Get store instance for advanced debugging
     */
    getStore: () => stores_1.bwaStore,
    /**
     * Check if Redux DevTools are available
     */
    isDevToolsAvailable: () => {
        return !!window.__REDUX_DEVTOOLS_EXTENSION__;
    },
    /**
     * Time-travel debugging helper (works with DevTools)
     */
    jumpToAction: (actionId) => {
        if (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION__) {
            console.log('Use Redux DevTools to jump to action:', actionId);
        }
    },
};
/**
 * Development-only function to setup enhanced debugging
 * Call this in your app's development environment for better debugging experience
 */
const setupDevTools = () => {
    if (process.env.NODE_ENV !== 'production') {
        // Add global access to DevTools utilities in development
        window.bwaDevTools = exports.DevToolsUtils;
        console.log('%c🪙 Bitcoin Wallet Adapter - DevTools Ready!', 'color: #f7931a; font-weight: bold; font-size: 14px;');
        console.log('Access DevTools via: window.bwaDevTools');
        console.log('Available methods:', Object.keys(exports.DevToolsUtils));
        // Log initial state
        exports.DevToolsUtils.logState();
    }
};
exports.setupDevTools = setupDevTools;
/**
 * Hook for easier access to DevTools utilities in React components
 */
const useDevTools = () => {
    if (process.env.NODE_ENV !== 'production') {
        return exports.DevToolsUtils;
    }
    return null;
};
exports.useDevTools = useDevTools;
