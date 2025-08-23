// This file exposes selectors for accessing network state from Redux.

import { RootState } from "../stores";

export type Network = "mainnet" | "testnet";

export const selectNetwork = (state: RootState): Network => state.general.network;
export const selectIsTestnet = (state: RootState): boolean => state.general.network === "testnet";
