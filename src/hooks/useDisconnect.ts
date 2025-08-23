// What happens in this file:
// - Defines `useDisconnect()` hook used to fully disconnect a wallet session
// - Clears persisted wallet keys from localStorage (lastWallet, wallet-detail, wallet*)
// - Resets Redux session state: lastWallet, walletDetails, and transient `signature`

import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  setLastWallet,
  setWalletDetails,
  setSignature,
} from "../stores/reducers/generalReducer";
import { 
  wrapAndThrowError, 
  BWAErrorCode,
} from "../utils/errorHandler";

const useDisconnect = () => {
  const dispatch = useDispatch();
  const disconnect = useCallback(() => {
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
      dispatch(setLastWallet(""));
      dispatch(setWalletDetails(null));
      // Clear transient signature captured from message/wallet connection
      dispatch(setSignature(""));
    } catch (err) {
      wrapAndThrowError(
        err as Error,
        BWAErrorCode.WALLET_DISCONNECTION_FAILED,
        "Failed to disconnect wallet and clear session data",
        {
          operation: 'wallet_disconnect',
          timestamp: Date.now()
        }
      );
    }
  }, [dispatch]);

  return disconnect;
};
export default useDisconnect;
