import { WalletDetails } from "../../types";
export interface GeneralState {
    walletDetails: WalletDetails | null;
    lastWallet: string;
    signature: string;
    network: "mainnet" | "testnet";
}
export declare const setWalletDetails: import("@reduxjs/toolkit").ActionCreatorWithPayload<WalletDetails | null, "wallet/setWalletDetails">, setLastWallet: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "wallet/setLastWallet">, setNetwork: import("@reduxjs/toolkit").ActionCreatorWithPayload<"mainnet" | "testnet", "wallet/setNetwork">, setSignature: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "wallet/setSignature">;
declare const _default: import("redux").Reducer<GeneralState>;
export default _default;
