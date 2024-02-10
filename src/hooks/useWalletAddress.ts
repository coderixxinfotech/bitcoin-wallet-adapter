import { useSelector } from "react-redux";
import { walletAddressSelector } from "../selectors/walletSelector";

export const useWalletAddress = () => {
  return useSelector(walletAddressSelector);
};
