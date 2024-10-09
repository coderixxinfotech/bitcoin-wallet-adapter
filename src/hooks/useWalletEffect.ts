import { useEffect } from "react";

interface WalletDetails {
  wallet: string;
}

const useWalletEffect = (
  walletDetails: WalletDetails | null,
  disconnect: () => void,
  network?: string,
  redux_network?: string
) => {
  useEffect(() => {
    const listeners: Array<{ remove: () => void }> = [];

    const addListener = (obj: any, events: string[]) => {
      events.forEach((event) => {
        obj.on(event, disconnect);
        listeners.push({
          remove: () => obj.removeListener(event, disconnect),
        });
      });
    };

    if (walletDetails) {
      const wallet = walletDetails.wallet.toLowerCase() as string;

      if (wallet === "okx") {
        const { bitcoin, fractalBitcoin, bitcoinTestnet } = (window as any)
          .okxwallet;
        if (bitcoin)
          addListener(bitcoin, ["accountsChanged", "accountChanged"]);
        if (fractalBitcoin)
          addListener(fractalBitcoin, ["accountsChanged", "accountChanged"]);
        if (
          (network === "testnet" || redux_network === "testnet") &&
          bitcoinTestnet
        ) {
          addListener(bitcoinTestnet, ["accountsChanged", "accountChanged"]);
        }
      } else if (wallet === "unisat") {
        const unisat = (window as any).unisat;
        if (unisat) addListener(unisat, ["accountsChanged", "networkChanged"]);
      }
    }

    // Cleanup function
    return () => {
      listeners.forEach((listener) => listener.remove());
    };
  }, [walletDetails, network, redux_network, disconnect]);
};

export default useWalletEffect;
