/**
 * Redux DevTools utilities for Bitcoin Wallet Adapter
 *
 * This module provides utilities for enhanced Redux debugging experience
 * when developing applications with the Bitcoin Wallet Adapter.
 */
import type { RootState } from '../stores';
/**
 * Enhanced Redux DevTools helper functions
 */
export declare const DevToolsUtils: {
    /**
     * Get current store state (useful for debugging)
     */
    getState: () => RootState;
    /**
     * Dispatch action for debugging purposes
     */
    dispatch: (action: any) => any;
    /**
     * Subscribe to store changes for debugging
     */
    subscribe: (listener: () => void) => import("redux").Unsubscribe;
    /**
     * Log current state to console (development only)
     */
    logState: () => void;
    /**
     * Log specific state slice to console (development only)
     */
    logStateSlice: (sliceName: keyof RootState) => void;
    /**
     * Get store instance for advanced debugging
     */
    getStore: () => import("@reduxjs/toolkit/dist/configureStore").ToolkitStore<import("redux").EmptyObject & {
        notifications: import("../stores/reducers/notificationReducers").NotificationsState;
        general: import("../stores/reducers/generalReducer").GeneralState;
        bitcoinPrice: import("../stores/reducers/bitcoinPriceReducer").BitcoinPriceState;
    }, import("redux").AnyAction, import("@reduxjs/toolkit").MiddlewareArray<[import("redux-thunk").ThunkMiddleware<import("redux").CombinedState<{
        notifications: import("../stores/reducers/notificationReducers").NotificationsState;
        general: import("../stores/reducers/generalReducer").GeneralState;
        bitcoinPrice: import("../stores/reducers/bitcoinPriceReducer").BitcoinPriceState;
    }>, import("redux").AnyAction>, import("redux-thunk").ThunkMiddleware<any, import("redux").AnyAction, undefined> & {
        withExtraArgument<ExtraThunkArg, State = any, BasicAction extends import("redux").Action<any> = import("redux").AnyAction>(extraArgument: ExtraThunkArg): import("redux-thunk").ThunkMiddleware<State, BasicAction, ExtraThunkArg>;
    }]>>;
    /**
     * Check if Redux DevTools are available
     */
    isDevToolsAvailable: () => boolean;
    /**
     * Time-travel debugging helper (works with DevTools)
     */
    jumpToAction: (actionId: number) => void;
};
/**
 * Development-only function to setup enhanced debugging
 * Call this in your app's development environment for better debugging experience
 */
export declare const setupDevTools: () => void;
/**
 * Hook for easier access to DevTools utilities in React components
 */
export declare const useDevTools: () => {
    /**
     * Get current store state (useful for debugging)
     */
    getState: () => RootState;
    /**
     * Dispatch action for debugging purposes
     */
    dispatch: (action: any) => any;
    /**
     * Subscribe to store changes for debugging
     */
    subscribe: (listener: () => void) => import("redux").Unsubscribe;
    /**
     * Log current state to console (development only)
     */
    logState: () => void;
    /**
     * Log specific state slice to console (development only)
     */
    logStateSlice: (sliceName: keyof RootState) => void;
    /**
     * Get store instance for advanced debugging
     */
    getStore: () => import("@reduxjs/toolkit/dist/configureStore").ToolkitStore<import("redux").EmptyObject & {
        notifications: import("../stores/reducers/notificationReducers").NotificationsState;
        general: import("../stores/reducers/generalReducer").GeneralState;
        bitcoinPrice: import("../stores/reducers/bitcoinPriceReducer").BitcoinPriceState;
    }, import("redux").AnyAction, import("@reduxjs/toolkit").MiddlewareArray<[import("redux-thunk").ThunkMiddleware<import("redux").CombinedState<{
        notifications: import("../stores/reducers/notificationReducers").NotificationsState;
        general: import("../stores/reducers/generalReducer").GeneralState;
        bitcoinPrice: import("../stores/reducers/bitcoinPriceReducer").BitcoinPriceState;
    }>, import("redux").AnyAction>, import("redux-thunk").ThunkMiddleware<any, import("redux").AnyAction, undefined> & {
        withExtraArgument<ExtraThunkArg, State = any, BasicAction extends import("redux").Action<any> = import("redux").AnyAction>(extraArgument: ExtraThunkArg): import("redux-thunk").ThunkMiddleware<State, BasicAction, ExtraThunkArg>;
    }]>>;
    /**
     * Check if Redux DevTools are available
     */
    isDevToolsAvailable: () => boolean;
    /**
     * Time-travel debugging helper (works with DevTools)
     */
    jumpToAction: (actionId: number) => void;
} | null;
