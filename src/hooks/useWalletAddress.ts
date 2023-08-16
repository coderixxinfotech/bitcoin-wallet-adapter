import { useSelector } from "react-redux";
import { RootState } from "../stores";

export const useWalletAddress = () => {
  const walletDetails = useSelector(
    (state: RootState) => state.general.walletDetails
  );

  const ordinal_address = walletDetails?.ordinal;
  const cardinal_address = walletDetails?.cardinal;
  const ordinal_pubkey = walletDetails?.ordinalPubkey;
  const cardinal_pubkey = walletDetails?.cardinalPubkey;
  const connected = walletDetails?.connected;

  return {
    ordinal_address,
    cardinal_address,
    ordinal_pubkey,
    cardinal_pubkey,
    connected
  };
};
