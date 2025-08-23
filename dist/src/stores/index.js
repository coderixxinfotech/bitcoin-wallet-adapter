"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bwaStore = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const redux_thunk_1 = __importDefault(require("redux-thunk"));
const notificationReducers_1 = __importDefault(require("./reducers/notificationReducers"));
const generalReducer_1 = __importDefault(require("./reducers/generalReducer"));
const bitcoinPriceReducer_1 = __importDefault(require("./reducers/bitcoinPriceReducer"));
const rootReducer = (0, toolkit_1.combineReducers)({
    notifications: notificationReducers_1.default,
    general: generalReducer_1.default,
    bitcoinPrice: bitcoinPriceReducer_1.default,
});
// Enhanced Redux DevTools configuration
const devToolsConfig = process.env.NODE_ENV !== "production" ? {
    name: "Bitcoin Wallet Adapter",
    trace: true,
    traceLimit: 25,
    actionSanitizer: (action) => (Object.assign(Object.assign({}, action), { 
        // Sanitize sensitive data in actions if needed
        type: action.type })),
    stateSanitizer: (state) => (Object.assign({}, state)),
} : false;
exports.bwaStore = (0, toolkit_1.configureStore)({
    reducer: rootReducer,
    devTools: devToolsConfig,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
    }).concat(redux_thunk_1.default),
});
