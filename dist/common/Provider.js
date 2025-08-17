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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_2 = require("@wallet-standard/react");
const ConnectionStatus_1 = require("./ConnectionStatus");
//mui
const ThemeProvider_1 = __importDefault(require("./mui/ThemeProvider"));
//Leather Wallet
const connect_react_1 = require("@stacks/connect-react");
const use_auth_1 = require("../common/stacks/use-auth");
const context_1 = require("../common/stacks/context");
// Redux
const react_redux_1 = require("react-redux");
const stores_1 = require("../stores");
const generalReducer_1 = require("../stores/reducers/generalReducer");
function WalletProvider({ children, customAuthOptions }) {
    const { authOptions, state } = (0, use_auth_1.useAuth)(customAuthOptions);
    // console.log({ customAuthOptions });
    return (react_1.default.createElement(ThemeProvider_1.default, null,
        react_1.default.createElement(react_2.WalletStandardProvider, null,
            react_1.default.createElement(ConnectionStatus_1.ConnectionStatusProvider, null,
                react_1.default.createElement(react_redux_1.Provider, { store: stores_1.bwaStore },
                    react_1.default.createElement(connect_react_1.Connect, { authOptions: authOptions },
                        react_1.default.createElement(context_1.AppContext.Provider, { value: state },
                            react_1.default.createElement(SetNetwork, { customAuthOptions: customAuthOptions }),
                            children)))))));
}
const SetNetwork = ({ customAuthOptions }) => {
    const dispatch = (0, react_redux_1.useDispatch)();
    (0, react_1.useEffect)(() => {
        if (customAuthOptions === null || customAuthOptions === void 0 ? void 0 : customAuthOptions.network)
            dispatch((0, generalReducer_1.setNetwork)(customAuthOptions === null || customAuthOptions === void 0 ? void 0 : customAuthOptions.network));
        return () => { };
    }, [customAuthOptions === null || customAuthOptions === void 0 ? void 0 : customAuthOptions.network]);
    return react_1.default.createElement(react_1.default.Fragment, null);
};
exports.default = WalletProvider;
