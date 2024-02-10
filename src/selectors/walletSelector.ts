import { createSelector } from "reselect";
import { RootState } from "../stores";

// Basic selector to get walletDetails from the state
const getWalletDetails = (state: RootState) => state.general.walletDetails;

// Additional selectors
const getBalance = (state: RootState) => state.general.balance;
const getMempoolBalance = (state: RootState) =>
  state.general.in_mempool_balance;
const getDummyUtxos = (state: RootState) => state.general.dummy_utxos;

// Memoized selector to compute the wallet address details
export const walletAddressSelector = createSelector(
  [getWalletDetails, getBalance, getMempoolBalance, getDummyUtxos], // include all relevant selectors here
  (walletDetails, balance, mempoolBalance, dummyUtxos) => {
    // these are the computed values from above selectors
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
      balance, // computed balance from the state
      mempool_balance: mempoolBalance, // computed mempool balance from the state
      dummy_utxos: dummyUtxos, // computed dummy_utxos from the state
      wallet,
      connected,
    };
  }
);
