"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
//mui
const ThemeProvider_1 = __importDefault(require("./mui/ThemeProvider"));
//Leather Wallet
const connect_react_1 = require("@stacks/connect-react");
const use_auth_1 = require("../common/stacks/use-auth");
const context_1 = require("../common/stacks/context");
// Redux
const react_redux_1 = require("react-redux");
const stores_1 = require("../stores");
function WalletProvider({ children, customAuthOptions }) {
    const { authOptions, state } = (0, use_auth_1.useAuth)(customAuthOptions);
    return (react_1.default.createElement(ThemeProvider_1.default, null,
        react_1.default.createElement(react_redux_1.Provider, { store: stores_1.store },
            react_1.default.createElement(connect_react_1.Connect, { authOptions: authOptions },
                react_1.default.createElement(context_1.AppContext.Provider, { value: state }, children)))));
}
exports.default = WalletProvider;
