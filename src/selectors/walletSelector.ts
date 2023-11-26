import { createSelector } from "reselect";
import { RootState } from "../stores";

// Basic selector to get walletDetails from the state
const getWalletDetails = (state: RootState) => state.general.walletDetails;

// Memoized selector to compute the wallet address details
export const walletAddressSelector = createSelector(
  getWalletDetails,
  (walletDetails) => {
    if (!walletDetails) {
      return null;
    }

    const {
      ordinal = "",
      cardinal = "",
      ordinalPubkey = "",
      cardinalPubkey = "",
      wallet = null,
      connected = false,
    } = walletDetails;

    return {
      ordinal_address: ordinal,
      cardinal_address: cardinal,
      ordinal_pubkey: ordinalPubkey,
      cardinal_pubkey: cardinalPubkey,
      wallet,
      connected,
    };
  }
);
