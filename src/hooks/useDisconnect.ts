// File: src/index.ts (or src/index.js if not using TypeScript)

import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  setLastWallet,
  setWalletDetails,
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
