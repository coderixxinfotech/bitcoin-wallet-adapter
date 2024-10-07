import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import {
  BitcoinNetworkType,
  signMessage as signMessageApi,
} from "sats-connect"; // Renamed to avoid naming conflict
import { setSignature } from "../stores/reducers/generalReducer";
import { useWallets } from "@wallet-standard/react";
import type { WalletWithFeatures } from "@wallet-standard/base";

import { Verifier } from "bip322-js";
import { bytesToBase64 } from "..";

interface CustomWindow extends Window {
  LeatherProvider?: any;
  unisat?: any;
  BitcoinProvider?: any;
  btc?: any;
  phantom?: any;
  okxwallet?: any;
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

  const verifyAndSetResult = (
    address: string,
    message: string,
    response: any
  ) => {
    const validity = Verifier.verifySignature(address, message, response);
    // console.log({ validity });
    if (!validity) throw new Error("Invalid signature");
    dispatch(setSignature(response));
    setResult(response);
  };

  const signMessage = useCallback(
    async (options: MessageOptions) => {
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
          const signMessageOptions = {
            payload: {
              network: {
                type:
                  options.network.toLowerCase() === "mainnet"
                    ? "Mainnet"
                    : "Testnet",
              },
              address: options.address,
              message: options.message,
            },
            onFinish: (response: any) => {
              verifyAndSetResult(options.address, options.message, response);
              setLoading(false);
            },
            onCancel: () => {
              setError(new Error("User canceled the operation"));
              setLoading(false);
            },
          };
          //@ts-ignore
          await signMessageApi(signMessageOptions);
        } else if (
          typeof window.unisat !== "undefined" &&
          options.wallet === "Unisat"
        ) {
          const sign = await window.unisat.signMessage(options.message);
          verifyAndSetResult(options.address, options.message, sign);
        } else if (
          typeof window.btc !== "undefined" &&
          options.wallet === "Leather"
        ) {
          const sign = await window.btc.request("signMessage", {
            message: options.message,
            paymentType: "p2tr",
            network: options.network.toLowerCase(),
          });
          verifyAndSetResult(
            options.address,
            options.message,
            sign.result.signature
          );
        } else if (
          typeof window?.phantom !== "undefined" &&
          options.wallet === "Phantom"
        ) {
          const message = new TextEncoder().encode(options.message);
          const { signature } = await window?.phantom?.bitcoin?.signMessage(
            options.address,
            message
          );

          const base64 = bytesToBase64(signature);

          verifyAndSetResult(
            options.address,
            new TextDecoder().decode(message),
            base64
          );
        }

        // okx wallett
        else if (
          typeof window?.okxwallet !== "undefined" &&
          options.wallet === "Okx"
        ) {
          const signature = await window.okxwallet.bitcoin.signMessage(
            options.message,
            "ecdsa"
          );

          verifyAndSetResult(options.address, options.message, signature);
        } else if (options.wallet === "MagicEden") {
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
                  options.network.toLowerCase() === "mainnet"
                    ? BitcoinNetworkType.Mainnet
                    : BitcoinNetworkType.Testnet,
              },
              address: options.address,
              message: options.message,
            },
            onFinish: (response: any) => {
              verifyAndSetResult(options.address, options.message, response);
              setLoading(false);
            },
            onCancel: () => {
              setError(new Error("User canceled the operation"));
              setLoading(false);
            },
          };
          //@ts-ignore
          await signMessageApi(signMessageOptions);
        } else {
          throw new Error("Unsupported wallet");
        }
      } catch (err) {
        console.log({ err });
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      } finally {
        setLoading(false);
      }
    },
    [dispatch, testWallets]
  );

  return { signMessage, loading, result, error };
};
