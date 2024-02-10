import { WalletDetails } from "../../types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

const initialState: GeneralState = {
  walletDetails: null,
  lastWallet: "",
  btc_price_in_dollar: 0,
  mempool_url: "https://mempool.space",
  ord_url: "",
  balance: 0,
  in_mempool_balance: 0,
  dummy_utxos: 0,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWalletDetails: (state, action: PayloadAction<WalletDetails | null>) => {
      state.walletDetails = action.payload;
    },
    setLastWallet: (state, action: PayloadAction<string>) => {
      state.lastWallet = action.payload;
    },
    setBTCPrice: (state, action: PayloadAction<number>) => {
      state.btc_price_in_dollar = action.payload;
    },
    setMempoolUrl: (state, action: PayloadAction<string>) => {
      state.mempool_url = action.payload;
    },
    setOrdUrl: (state, action: PayloadAction<string>) => {
      state.ord_url = action.payload;
    },
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
    setMempoolBalance: (state, action: PayloadAction<number>) => {
      state.in_mempool_balance = action.payload;
    },
    setDummyUtxos: (state, action: PayloadAction<number>) => {
      state.dummy_utxos = action.payload;
    },
  },
});

export const {
  setWalletDetails,
  setLastWallet,
  setBTCPrice,
  setMempoolUrl,
  setOrdUrl,
  setBalance,
  setMempoolBalance,
  setDummyUtxos,
} = walletSlice.actions;
export default walletSlice.reducer;
