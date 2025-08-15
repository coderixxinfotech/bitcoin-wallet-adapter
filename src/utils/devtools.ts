/**
 * Redux DevTools utilities for Bitcoin Wallet Adapter
 * 
 * This module provides utilities for enhanced Redux debugging experience
 * when developing applications with the Bitcoin Wallet Adapter.
 */

import { bwaStore } from '../stores';
import type { RootState } from '../stores';

/**
 * Enhanced Redux DevTools helper functions
 */
export const DevToolsUtils = {
  /**
   * Get current store state (useful for debugging)
   */
  getState: (): RootState => bwaStore.getState(),

  /**
   * Dispatch action for debugging purposes
   */
  dispatch: (action: any) => bwaStore.dispatch(action),

  /**
   * Subscribe to store changes for debugging
   */
  subscribe: (listener: () => void) => bwaStore.subscribe(listener),

  /**
   * Log current state to console (development only)
   */
  logState: () => {
    if (process.env.NODE_ENV !== 'production') {
      console.group('🪙 Bitcoin Wallet Adapter - Redux State');
      console.log('Current State:', bwaStore.getState());
      console.groupEnd();
    }
  },

  /**
   * Log specific state slice to console (development only)
   */
  logStateSlice: (sliceName: keyof RootState) => {
    if (process.env.NODE_ENV !== 'production') {
      const state = bwaStore.getState();
      const sliceNameStr = String(sliceName);
      console.group(`🪙 Bitcoin Wallet Adapter - ${sliceNameStr} State`);
      console.log(`${sliceNameStr}:`, state[sliceName]);
      console.groupEnd();
    }
  },

  /**
   * Get store instance for advanced debugging
   */
  getStore: () => bwaStore,

  /**
   * Check if Redux DevTools are available
   */
  isDevToolsAvailable: (): boolean => {
    return !!(window as any).__REDUX_DEVTOOLS_EXTENSION__;
  },

  /**
   * Time-travel debugging helper (works with DevTools)
   */
  jumpToAction: (actionId: number) => {
    if (process.env.NODE_ENV !== 'production' && (window as any).__REDUX_DEVTOOLS_EXTENSION__) {
      console.log('Use Redux DevTools to jump to action:', actionId);
    }
  },
};

/**
 * Development-only function to setup enhanced debugging
 * Call this in your app's development environment for better debugging experience
 */
export const setupDevTools = () => {
  if (process.env.NODE_ENV !== 'production') {
    // Add global access to DevTools utilities in development
    (window as any).bwaDevTools = DevToolsUtils;
    
    console.log(
      '%c🪙 Bitcoin Wallet Adapter - DevTools Ready!',
      'color: #f7931a; font-weight: bold; font-size: 14px;'
    );
    console.log('Access DevTools via: window.bwaDevTools');
    console.log('Available methods:', Object.keys(DevToolsUtils));
    
    // Log initial state
    DevToolsUtils.logState();
  }
};

/**
 * Hook for easier access to DevTools utilities in React components
 */
export const useDevTools = () => {
  if (process.env.NODE_ENV !== 'production') {
    return DevToolsUtils;
  }
  return null;
};
