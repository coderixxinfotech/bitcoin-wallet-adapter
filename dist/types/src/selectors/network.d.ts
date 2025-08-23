import { RootState } from "../stores";
export type Network = "mainnet" | "testnet";
export declare const selectNetwork: (state: RootState) => Network;
export declare const selectIsTestnet: (state: RootState) => boolean;
