import { WalletDetails } from "../../types";
export interface GeneralState {
    walletDetails: WalletDetails | null;
    lastWallet: string;
    btc_price_in_dollar: number;
}
export declare const setWalletDetails: import("@reduxjs/toolkit").ActionCreatorWithPayload<WalletDetails | null, "wallet/setWalletDetails">, setLastWallet: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "wallet/setLastWallet">, setBTCPrice: import("@reduxjs/toolkit").ActionCreatorWithPayload<number, "wallet/setBTCPrice">;
declare const _default: import("redux").Reducer<GeneralState>;
export default _default;
