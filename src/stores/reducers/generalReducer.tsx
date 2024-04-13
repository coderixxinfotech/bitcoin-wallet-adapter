import { WalletDetails } from "../../types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GeneralState {
  walletDetails: WalletDetails | null;
  lastWallet: string;
  btc_price_in_dollar: number;
  network: "mainnet" | "testnet";
}

const initialState: GeneralState = {
  walletDetails: null,
  lastWallet: "",
  btc_price_in_dollar: 0,
  network: "mainnet",
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
    setNetwork: (state, action: PayloadAction<"mainnet" | "testnet">) => {
      state.network = action.payload;
    },
  },
});

export const { setWalletDetails, setLastWallet, setBTCPrice, setNetwork } =
  walletSlice.actions;
export default walletSlice.reducer;
