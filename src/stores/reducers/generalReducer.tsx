import { WalletDetails, WalletState } from "../../types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: WalletState = {
  walletDetails: null,
  lastWallet: "",
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
  },
});

export const { setWalletDetails, setLastWallet } = walletSlice.actions;
export default walletSlice.reducer;
