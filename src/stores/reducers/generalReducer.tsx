import { WalletDetails } from "../../types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GeneralState {
  walletDetails: WalletDetails | null;
  lastWallet: string;
  btc_price_in_dollar: number;
}

const initialState: GeneralState = {
  walletDetails: null,
  lastWallet: "",
  btc_price_in_dollar: 0,
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
  },
});

export const { setWalletDetails, setLastWallet, setBTCPrice } = walletSlice.actions;
export default walletSlice.reducer;
