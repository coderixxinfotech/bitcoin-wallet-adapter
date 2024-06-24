import { WalletDetails } from "../../types";
export interface GeneralState {
    walletDetails: WalletDetails | null;
    lastWallet: string;
    btc_price_in_dollar: number;
    signature: string;
    network: "mainnet" | "testnet";
}
export declare const setWalletDetails: import("@reduxjs/toolkit").ActionCreatorWithPayload<WalletDetails | null, "wallet/setWalletDetails">, setLastWallet: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "wallet/setLastWallet">, setBTCPrice: import("@reduxjs/toolkit").ActionCreatorWithPayload<number, "wallet/setBTCPrice">, setNetwork: import("@reduxjs/toolkit").ActionCreatorWithPayload<"mainnet" | "testnet", "wallet/setNetwork">, setSignature: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "wallet/setSignature">;
declare const _default: import("redux").Reducer<GeneralState>;
export default _default;
