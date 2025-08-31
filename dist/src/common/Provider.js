"use strict";
// What happens in this file:
// - Exposes `WalletProvider` that wires Wallet Standard, MUI Theme, ConnectionStatus, and Redux store
// - Applies initial network from `customAuthOptions.network` into Redux
// - Automatically disconnects the connected wallet whenever the Redux `network` changes
//   to prevent cross-network mismatches across all hooks and operations
// - Removed Stacks Connect provider to avoid setImmediate postMessage conflicts with Leather inpage script
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_2 = require("@wallet-standard/react");
const ConnectionStatus_1 = require("./ConnectionStatus");
//mui
const ThemeProvider_1 = __importDefault(require("./mui/ThemeProvider"));
// Redux
const react_redux_1 = require("react-redux");
const stores_1 = require("../stores");
const generalReducer_1 = require("../stores/reducers/generalReducer");
const useDisconnect_1 = __importDefault(require("../hooks/useDisconnect"));
const notificationReducers_1 = require("../stores/reducers/notificationReducers");
function WalletProvider({ children, customAuthOptions }) {
    return (react_1.default.createElement(ThemeProvider_1.default, null,
        react_1.default.createElement(react_2.WalletStandardProvider, null,
            react_1.default.createElement(ConnectionStatus_1.ConnectionStatusProvider, null,
                react_1.default.createElement(react_redux_1.Provider, { store: stores_1.bwaStore },
                    react_1.default.createElement(LeatherCompatPatches, null),
                    react_1.default.createElement(SetNetwork, { customAuthOptions: customAuthOptions }),
                    children)))));
}
// Small, safe runtime patch to avoid postMessage-based setImmediate polyfills
// interfering with Leather's inpage message parsing. Replaces setImmediate
// with a setTimeout(0) fallback. No-ops if setImmediate is absent.
const LeatherCompatPatches = () => {
    (0, react_1.useEffect)(() => {
        try {
            if (typeof window === "undefined")
                return;
            const w = window;
            if (typeof w.setImmediate === "function") {
                if (!w.__bwaSetImmediatePatched) {
                    const timeouts = new Map();
                    const patchedSetImmediate = (cb, ...args) => {
                        const id = Math.floor(Math.random() * 1e9);
                        const tid = window.setTimeout(() => {
                            try {
                                cb(...args);
                            }
                            catch (_a) {
                                // swallow to avoid unhandled errors in microtask replacement
                            }
                        }, 0);
                        timeouts.set(id, tid);
                        return id;
                    };
                    const patchedClearImmediate = (id) => {
                        const tid = timeouts.get(id);
                        if (tid != null) {
                            clearTimeout(tid);
                            timeouts.delete(id);
                        }
                    };
                    w.setImmediate = patchedSetImmediate;
                    w.clearImmediate = patchedClearImmediate;
                    w.__bwaSetImmediatePatched = true;
                }
            }
            // Note: Avoid patching window.postMessage to prevent breaking wallet detection.
            // Intercept setImmediate polyfill messages only (avoid interfering with wallet detection)
            const handler = (event) => {
                var _a;
                try {
                    if (event.source !== window)
                        return;
                    const data = event.data;
                    if (typeof data === "string") {
                        const trimmed = data.trim();
                        if (trimmed.startsWith("setImmediate$")) {
                            (_a = event.stopImmediatePropagation) === null || _a === void 0 ? void 0 : _a.call(event);
                            return;
                        }
                    }
                }
                catch (_b) {
                    // ignore
                }
            };
            window.addEventListener("message", handler, { capture: true });
            return () => {
                window.removeEventListener("message", handler, { capture: true });
            };
        }
        catch (_a) {
            // ignore
        }
    }, []);
    return null;
};
const SetNetwork = ({ customAuthOptions }) => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const network = (0, react_redux_1.useSelector)((s) => s.general.network);
    const walletDetails = (0, react_redux_1.useSelector)((s) => s.general.walletDetails);
    const disconnect = (0, useDisconnect_1.default)();
    const prevNetworkRef = (0, react_1.useRef)(network !== null && network !== void 0 ? network : null);
    // Apply initial network from customAuthOptions (if provided)
    (0, react_1.useEffect)(() => {
        if (customAuthOptions === null || customAuthOptions === void 0 ? void 0 : customAuthOptions.network) {
            dispatch((0, generalReducer_1.setNetwork)(customAuthOptions.network));
        }
        return () => { };
    }, [customAuthOptions === null || customAuthOptions === void 0 ? void 0 : customAuthOptions.network, dispatch]);
    // Auto-disconnect wallet whenever Redux network changes
    (0, react_1.useEffect)(() => {
        const prev = prevNetworkRef.current;
        if (prev && network && prev !== network) {
            if (walletDetails) {
                disconnect();
                // Notify user about the enforced disconnect on network switch
                dispatch((0, notificationReducers_1.addNotification)({
                    id: Date.now(),
                    message: `Network changed to ${network}. Wallet disconnected to prevent cross-network issues.`,
                    open: true,
                    severity: "info",
                }));
            }
        }
        prevNetworkRef.current = network !== null && network !== void 0 ? network : null;
    }, [network, walletDetails, disconnect]);
    return react_1.default.createElement(react_1.default.Fragment, null);
};
exports.default = WalletProvider;
