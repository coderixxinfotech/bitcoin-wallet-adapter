import { useSelector } from "react-redux";
import { RootState } from "../stores";

export const useWalletAddress = () => {
  const walletDetails = useSelector(
    (state: RootState) => state.general.walletDetails
  );

  const ordinal_address = walletDetails?.ordinal || null;
  const cardinal_address = walletDetails?.cardinal || null;
  const ordinal_pubkey = walletDetails?.ordinalPubkey || null;
  const cardinal_pubkey = walletDetails?.cardinalPubkey || null;
  const connected = walletDetails?.connected || false;
  const wallet = walletDetails?.wallet || null;

  return {
    ordinal_address,
    cardinal_address,
    ordinal_pubkey,
    cardinal_pubkey,
    wallet,
    connected,
  };
};
