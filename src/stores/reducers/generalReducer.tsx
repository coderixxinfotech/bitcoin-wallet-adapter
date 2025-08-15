import { WalletDetails } from "../../types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GeneralState {
  walletDetails: WalletDetails | null;
  lastWallet: string;
  signature: string;
  network: "mainnet" | "testnet";
}

const initialState: GeneralState = {
  walletDetails: null,
  lastWallet: "",
  signature: "",
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

    setNetwork: (state, action: PayloadAction<"mainnet" | "testnet">) => {
      state.network = action.payload;
    },
    setSignature: (state, action: PayloadAction<string>) => {
      state.signature = action.payload;
    },
  },
});

export const {
  setWalletDetails,
  setLastWallet,
  setNetwork,
  setSignature,
} = walletSlice.actions;
export default walletSlice.reducer;
