import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import {
  BitcoinNetworkType,
  signMessage as signMessageApi,
} from "sats-connect"; // Renamed to avoid naming conflict
import { setSignature } from "../stores/reducers/generalReducer";
import { useWallets } from "@wallet-standard/react";
import type { WalletWithFeatures } from "@wallet-standard/base";

interface CustomWindow extends Window {
  LeatherProvider?: any;
  unisat?: any;
  BitcoinProvider?: any;
  btc?: any;
}

const SatsConnectNamespace = "sats-connect:";
declare const window: CustomWindow;

export const useMessageSign = () => {
  const dispatch = useDispatch();

  const { wallets: testWallets } = useWallets();

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<Error | null>(null);

  type MessageOptions = {
    network: string;
    address: string;
    message: string;
    wallet: string;
  };

  const signMessage = useCallback(async (options: MessageOptions) => {
    setLoading(true);
    setResult(null);
    setError(null);

    if (!options.wallet) {
      setError(new Error("Wallet Not Connected"));
      setLoading(false);
      return;
    }

    try {
      if (options.wallet === "Xverse") {
        setLoading(true);
        const signMessageOptions = {
          payload: {
            network: {
              type: options.network === "mainnet" ? "Mainnet" : "Testnet",
            },
            address: options.address,
            message: options.message,
          },
          onFinish: (response: any) => {
            dispatch(setSignature(response));
            setResult(response);
            setLoading(false);
          },
          onCancel: () => {
            setError(new Error("User canceled the operation"));
            setLoading(false);
          },
        };
        // Call the signMessageApi with the options
        //@ts-ignore
        await signMessageApi(signMessageOptions);
      } else if (
        typeof window.unisat !== "undefined" &&
        options.wallet === "Unisat"
      ) {
        setLoading(true);
        try {
          const sign = await window.unisat.signMessage(options.message);
          dispatch(setSignature(sign));
          setResult(sign);
        } catch (err) {
          setError(
            err instanceof Error
              ? err
              : new Error("An error occurred during message signing")
          );
        } finally {
          setLoading(false);
        }
      } else if (
        typeof window.btc !== "undefined" &&
        options.wallet === "Leather"
      ) {
        setLoading(true);
        try {
          const sign = await window.btc.request("signMessage", {
            message: options.message,
            paymentType: "p2tr",
          });
          dispatch(setSignature(sign.result.signature));
          setResult(sign.result.signature);
        } catch (err) {
          setError(
            err instanceof Error
              ? err
              : new Error("An error occurred during message signing")
          );
        } finally {
          setLoading(false);
        }
      } else if (options.wallet === "MagicEden") {
        setLoading(true);

        const wallet = testWallets.filter(
          (a: any) => a.name === "Magic Eden"
        )[0];
        const signMessageOptions = {
          getProvider: async () =>
            (wallet as unknown as WalletWithFeatures<any>).features[
              SatsConnectNamespace
            ]?.provider,
          payload: {
            network: {
              type:
                options.network === "mainnet"
                  ? BitcoinNetworkType.Mainnet
                  : BitcoinNetworkType.Testnet,
            },
            address: options.address,
            message: options.message,
          },
          onFinish: (response: any) => {
            dispatch(setSignature(response));
            setResult(response);
            setLoading(false);
          },
          onCancel: () => {
            setError(new Error("User canceled the operation"));
            setLoading(false);
          },
        };
        // Call the signMessageApi with the options
        //@ts-ignore
        await signMessageApi(signMessageOptions);
      }
    } catch (err) {
      console.log({ err });
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
      setLoading(false);
      throw new Error("Error signing message");
    }
  }, []);

  return { signMessage, loading, result, error };
};
