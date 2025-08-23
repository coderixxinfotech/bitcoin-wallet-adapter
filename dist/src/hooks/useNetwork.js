"use strict";
// What happens in this file:
// - Exposes a React hook `useNetwork` to get/set the Bitcoin network (mainnet | testnet)
// - Reads from Redux (`general.network`) and dispatches `setNetwork`
// - Optionally persists the network to localStorage when `persist` is true
// - Provides helpers: `isTestnet` and `toggle`
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNetwork = void 0;
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const generalReducer_1 = require("../stores/reducers/generalReducer");
const STORAGE_KEY = "bwa_network";
const useNetwork = (opts) => {
    var _a;
    const dispatch = (0, react_redux_1.useDispatch)();
    const network = (0, react_redux_1.useSelector)((s) => s.general.network);
    const persist = (_a = opts === null || opts === void 0 ? void 0 : opts.persist) !== null && _a !== void 0 ? _a : true;
    // persist on change
    (0, react_1.useEffect)(() => {
        if (!persist)
            return;
        if (typeof window === "undefined")
            return;
        try {
            window.localStorage.setItem(STORAGE_KEY, network);
        }
        catch (_a) { }
    }, [network, persist]);
    const set = (0, react_1.useCallback)((n) => {
        if (n !== "mainnet" && n !== "testnet")
            return;
        dispatch((0, generalReducer_1.setNetwork)(n));
    }, [dispatch]);
    const toggle = (0, react_1.useCallback)(() => {
        set(network === "mainnet" ? "testnet" : "mainnet");
    }, [network, set]);
    return {
        network,
        setNetwork: set,
        isTestnet: network === "testnet",
        toggle,
    };
};
exports.useNetwork = useNetwork;
