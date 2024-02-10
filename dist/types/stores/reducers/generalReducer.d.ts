import { WalletDetails } from "../../types";
export interface GeneralState {
    walletDetails: WalletDetails | null;
    lastWallet: string;
    btc_price_in_dollar: number;
    mempool_url: string;
    ord_url: string;
    balance: number;
    in_mempool_balance: number;
    dummy_utxos: number;
}
export declare const setWalletDetails: import("@reduxjs/toolkit").ActionCreatorWithPayload<WalletDetails | null, "wallet/setWalletDetails">, setLastWallet: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "wallet/setLastWallet">, setBTCPrice: import("@reduxjs/toolkit").ActionCreatorWithPayload<number, "wallet/setBTCPrice">, setMempoolUrl: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "wallet/setMempoolUrl">, setOrdUrl: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "wallet/setOrdUrl">, setBalance: import("@reduxjs/toolkit").ActionCreatorWithPayload<number, "wallet/setBalance">, setMempoolBalance: import("@reduxjs/toolkit").ActionCreatorWithPayload<number, "wallet/setMempoolBalance">, setDummyUtxos: import("@reduxjs/toolkit").ActionCreatorWithPayload<number, "wallet/setDummyUtxos">;
declare const _default: import("redux").Reducer<GeneralState>;
export default _default;
