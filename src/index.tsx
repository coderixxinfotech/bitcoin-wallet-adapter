// Styles
import "./styles.css";

// Providers
import WalletProvider from "./common/Provider";

// Components
import ConnectMultiButton from "./components/ConnectMultiButton";
import Notification from "./components/Notification";
import PayButton from "./components/PayButton";

// Hooks
import {
  useWalletAddress,
  useXverseSign,
  useUnisatSign,
  useLeatherSign,
  useSignTx,
  useMessageSign,
  useDisconnect,
} from "./hooks";

// Export Providers
export { WalletProvider };

// Export Components
export { ConnectMultiButton, Notification, PayButton };

export function bytesToBase64(bytes: any) {
  const binString = String.fromCodePoint(...bytes);
  return btoa(binString);
}

// Export Hooks
export {
  useWalletAddress,
  useXverseSign,
  useUnisatSign,
  useLeatherSign,
  useSignTx,
  useMessageSign,
  useDisconnect,
};
