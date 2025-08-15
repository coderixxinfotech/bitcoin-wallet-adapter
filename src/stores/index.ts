import { combineReducers, configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import notificationsReducer from "./reducers/notificationReducers";
import generalReducer from "./reducers/generalReducer";
import bitcoinPriceReducer from "./reducers/bitcoinPriceReducer";

const rootReducer = combineReducers({
  notifications: notificationsReducer,
  general: generalReducer,
  bitcoinPrice: bitcoinPriceReducer,
});

// Enhanced Redux DevTools configuration
const devToolsConfig = process.env.NODE_ENV !== "production" ? {
  name: "Bitcoin Wallet Adapter",
  trace: true,
  traceLimit: 25,
  actionSanitizer: (action: any) => ({
    ...action,
    // Sanitize sensitive data in actions if needed
    type: action.type,
  }),
  stateSanitizer: (state: any) => ({
    ...state,
    // Hide sensitive data from DevTools if needed
  }),
} : false;

export const bwaStore = configureStore({
  reducer: rootReducer,
  devTools: devToolsConfig,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(thunk),
});

export type RootState = ReturnType<typeof bwaStore.getState>;
export type AppDispatch = typeof bwaStore.dispatch;

// Enhanced type for use with DevTools
export interface BWAStore {
  getState(): RootState;
  dispatch: AppDispatch;
}
