"use strict";
// What happens in this file:
// - Defines `useDisconnect()` hook used to fully disconnect a wallet session
// - Clears persisted wallet keys from localStorage (lastWallet, wallet-detail, wallet*)
// - Resets Redux session state: lastWallet, walletDetails, and transient `signature`
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const generalReducer_1 = require("../stores/reducers/generalReducer");
const errorHandler_1 = require("../utils/errorHandler");
const useDisconnect = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const disconnect = (0, react_1.useCallback)(() => {
        try {
            localStorage.removeItem("lastWallet");
            localStorage.removeItem("wallet-detail");
            // Iterate over all items in localStorage
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (key && key.startsWith("wallet")) {
                    // Remove items that start with 'wallet'
                    localStorage.removeItem(key);
                }
            }
            dispatch((0, generalReducer_1.setLastWallet)(""));
            dispatch((0, generalReducer_1.setWalletDetails)(null));
            // Clear transient signature captured from message/wallet connection
            dispatch((0, generalReducer_1.setSignature)(""));
        }
        catch (err) {
            (0, errorHandler_1.wrapAndThrowError)(err, errorHandler_1.BWAErrorCode.WALLET_DISCONNECTION_FAILED, "Failed to disconnect wallet and clear session data", {
                operation: 'wallet_disconnect',
                timestamp: Date.now()
            });
        }
    }, [dispatch]);
    return disconnect;
};
exports.default = useDisconnect;
