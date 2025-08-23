// What happens in this file:
// - Exposes a React hook `useNetwork` to get/set the Bitcoin network (mainnet | testnet)
// - Reads from Redux (`general.network`) and dispatches `setNetwork`
// - Optionally persists the network to localStorage when `persist` is true
// - Provides helpers: `isTestnet` and `toggle`

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNetwork } from "../stores/reducers/generalReducer";
import type { RootState } from "../stores";

export type Network = "mainnet" | "testnet";

const STORAGE_KEY = "bwa_network";

export const useNetwork = (opts?: { persist?: boolean }) => {
  const dispatch = useDispatch();
  const network = useSelector((s: RootState) => s.general.network);
  const persist = opts?.persist ?? true;

  // persist on change
  useEffect(() => {
    if (!persist) return;
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, network);
    } catch {}
  }, [network, persist]);

  const set = useCallback(
    (n: Network) => {
      if (n !== "mainnet" && n !== "testnet") return;
      dispatch(setNetwork(n));
    },
    [dispatch]
  );

  const toggle = useCallback(() => {
    set(network === "mainnet" ? "testnet" : "mainnet");
  }, [network, set]);

  return {
    network,
    setNetwork: set,
    isTestnet: network === "testnet",
    toggle,
  } as const;
};
