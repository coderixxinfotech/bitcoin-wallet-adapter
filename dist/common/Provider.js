"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
//mui
const ThemeProvider_1 = __importDefault(require("./mui/ThemeProvider"));
const use_auth_1 = require("../common/stacks/use-auth");
// Redux
const react_redux_1 = require("react-redux");
const stores_1 = require("../stores");
const hooks_1 = require("../hooks");
const axios_1 = __importDefault(require("axios"));
const generalReducer_1 = require("../stores/reducers/generalReducer");
const utils_1 = require("../utils");
function WalletProvider({ children, customAuthOptions, mempoolUrl, ord_url, apikey, }) {
    const { authOptions, state } = (0, use_auth_1.useAuth)(customAuthOptions);
    return (react_1.default.createElement(ThemeProvider_1.default, null,
        react_1.default.createElement(react_redux_1.Provider, { store: stores_1.store },
            children,
            react_1.default.createElement(DispatchDefaultData, { mempool_url: mempoolUrl || "https://mempool.space/api", ord_url: ord_url, apikey: apikey }))));
}
const DispatchDefaultData = ({ mempool_url, ord_url, apikey, }) => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const wd = (0, hooks_1.useWalletAddress)();
    const fetchWalletBalance = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!wd)
                throw Error("Wallet not connected");
            let dummyUtxos = 0;
            const cacheKey = `walletBalance`;
            const cachedData = localStorage.getItem(cacheKey);
            const now = new Date().getTime();
            let shouldFetchDummyUtxos = true; // Default to true if no cached data or cache is expired
            if (cachedData) {
                const { timestamp } = JSON.parse(cachedData);
                if (now - timestamp < 5 * 60 * 1000) {
                    // Less than 5 minutes
                    // Use cached data to update state and skip new balance fetch
                    const { balance, mempoolBalance, dummyUtxos: cacheddummyUtxos, } = JSON.parse(cachedData);
                    if (cacheddummyUtxos)
                        dummyUtxos = cacheddummyUtxos;
                    dispatch((0, generalReducer_1.setMempoolBalance)(mempoolBalance));
                    dispatch((0, generalReducer_1.setBalance)(balance));
                    dispatch((0, generalReducer_1.setDummyUtxos)(cacheddummyUtxos));
                    shouldFetchDummyUtxos = false; // Data is recent, no need to fetch dummy UTXOs
                    return; // Exit function early
                }
                console.log("no cache / expired ", now - timestamp);
            }
            // Proceed to fetch new balance data
            const { data } = yield axios_1.default.get(`${mempool_url}/address/${wd === null || wd === void 0 ? void 0 : wd.cardinal_address}`);
            if (data) {
                const newBal = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
                const newMempoolBal = data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum;
                dispatch((0, generalReducer_1.setMempoolBalance)(newMempoolBal));
                dispatch((0, generalReducer_1.setBalance)(newBal));
                // Determine if need to fetch dummy UTXOs based on balance change
                if (cachedData) {
                    const { balance: cachedBalance } = JSON.parse(cachedData);
                    shouldFetchDummyUtxos = newBal !== cachedBalance;
                }
                // Fetch dummy UTXOs if necessary
                if (shouldFetchDummyUtxos) {
                    dummyUtxos = yield (0, utils_1.countDummyUtxos)(wd.cardinal_address, mempool_url, ord_url);
                    dispatch((0, generalReducer_1.setDummyUtxos)(dummyUtxos));
                }
                console.log("storing cache");
                // Update cache with new balance and timestamp
                localStorage.setItem(cacheKey, JSON.stringify({
                    balance: newBal,
                    mempoolBalance: newMempoolBal,
                    timestamp: now,
                    dummyUtxos: dummyUtxos,
                }));
            }
        }
        catch (e) {
            console.error("Error fetching wallet balance:", e);
        }
    }), [wd, mempool_url, ord_url]);
    (0, react_1.useEffect)(() => {
        if (wd && mempool_url) {
            dispatch((0, generalReducer_1.setMempoolUrl)(mempool_url));
            dispatch((0, generalReducer_1.setOrdUrl)(ord_url));
            fetchWalletBalance();
        }
    }, [mempool_url, wd]);
    return react_1.default.createElement(react_1.default.Fragment, null);
};
exports.default = WalletProvider;
