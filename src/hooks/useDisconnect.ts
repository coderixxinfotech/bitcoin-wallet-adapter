// File: src/index.ts (or src/index.js if not using TypeScript)

import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  setLastWallet,
  setWalletDetails,
} from "../stores/reducers/generalReducer";

const useDisconnect = () => {
  const dispatch = useDispatch();
  const disconnect = useCallback(() => {
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
  }, []);

  return disconnect;
};
export default useDisconnect;
