// What happens in this file:
// - Exposes `useMessageSign` hook to sign messages with connected wallets
// - Reads selected network from Redux (no network param accepted)
// - Validates address/network mismatch and throws structured BWA errors
// - Uses centralized network mapping helpers for wallet SDKs
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BitcoinNetworkType,
  signMessage as signMessageApi,
} from "sats-connect"; // Renamed to avoid naming conflict
import { setSignature } from "../stores/reducers/generalReducer";
import { useWallets } from "@wallet-standard/react";
import type { WalletWithFeatures } from "@wallet-standard/base";

import { Verifier } from "bip322-js";
import { bytesToBase64 } from "..";
import { 
  throwBWAError, 
  BWAError,
  BWAErrorCode,
  BWAErrorSeverity 
} from "../utils/errorHandler";
import type { RootState } from "../stores";
import { 
  toSatsConnectNetwork, 
  getOkxProvider, 
  validateAddressesMatchNetwork 
} from "../utils/network";

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
  const reduxNetwork = useSelector((s: RootState) => s.general.network);

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<Error | null>(null);

  type MessageOptions = {
    address: string;
    message: string;
    wallet: string; // e.g., "Xverse" | "Unisat" | "Leather" | "Phantom" | "OKX" | "MagicEden"
    fractal?: boolean; // OKX fractal toggle
  };

  const verifyAndSetResult = (
    address: string,
    message: string,
    response: any
  ) => {
    const validity = Verifier.verifySignature(address, message, response);
    if (!validity) {
      throwBWAError(
        BWAErrorCode.SIGNATURE_VERIFICATION_FAILED,
        "Invalid signature verification failed",
        {
          severity: BWAErrorSeverity.HIGH,
          context: { 
            operation: 'message_signing_verification',
            additionalData: {
              address,
              message: message.substring(0, 50) + '...' // Truncate for security
            }
          }
        }
      );
    }
    dispatch(setSignature(response));
    setResult(response);
  };

  const signMessage = useCallback(
    async (options: MessageOptions) => {
      setLoading(true);
      setResult(null);
      setError(null);

      if (!options.wallet) {
        throwBWAError(
          BWAErrorCode.WALLET_NOT_CONNECTED,
          "Wallet must be connected to sign messages",
          {
            severity: BWAErrorSeverity.HIGH,
            context: {
              walletType: 'unknown',
              operation: 'message_signing',
              network: reduxNetwork
            }
          }
        );
        return;
      }

      // Validate address vs selected network
      if (!validateAddressesMatchNetwork([options.address], reduxNetwork)) {
        throwBWAError(
          BWAErrorCode.NETWORK_MISMATCH,
          "Selected network and address network do not match",
          {
            severity: BWAErrorSeverity.MEDIUM,
            context: {
              walletType: options.wallet,
              operation: 'message_signing',
              network: reduxNetwork,
              additionalData: { address: options.address }
            },
            recoverable: true
          }
        );
      }

      try {
        const walletKey = options.wallet.toLowerCase();
        if (walletKey === "xverse") {
          const signMessageOptions = {
            payload: {
              network: { type: toSatsConnectNetwork(reduxNetwork) },
              address: options.address,
              message: options.message,
            },
            onFinish: (response: any) => {
              try {
                verifyAndSetResult(options.address, options.message, response);
              } catch (err) {
                console.log({ err });
                setError(
                  err instanceof Error ? err : new Error("An unknown error occurred")
                );
              } finally {
                setLoading(false);
              }
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
          walletKey === "unisat"
        ) {
          const sign = await window.unisat.signMessage(options.message);
          verifyAndSetResult(options.address, options.message, sign);
        } else if (
          typeof window.btc !== "undefined" &&
          walletKey === "leather"
        ) {
          const sign = await window.btc.request("signMessage", {
            message: options.message,
            paymentType: "p2tr",
            network: reduxNetwork.toLowerCase(),
          });
          verifyAndSetResult(
            options.address,
            options.message,
            sign.result.signature
          );
        } else if (
          typeof window?.phantom !== "undefined" &&
          walletKey === "phantom"
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
        } else if (
          typeof window?.okxwallet !== "undefined" &&
          walletKey === "okx"
        ) {
          const Okx = getOkxProvider(window as any, reduxNetwork, { fractal: options.fractal });
          if (!Okx) {
            throwBWAError(
              BWAErrorCode.WALLET_NOT_FOUND,
              "OKX provider for selected network is not available",
              { context: { walletType: options.wallet, operation: 'message_signing', network: reduxNetwork } }
            );
          }
          const signature = await Okx.signMessage(options.message, "ecdsa");
          verifyAndSetResult(options.address, options.message, signature);
        } else if (walletKey === "magiceden") {
          const wallet = testWallets.filter(
            (a: any) => a.name === "Magic Eden"
          )[0];
          const signMessageOptions = {
            getProvider: async () =>
              (wallet as unknown as WalletWithFeatures<any>).features[
                SatsConnectNamespace
              ]?.provider,
            payload: {
              network: { type: toSatsConnectNetwork(reduxNetwork) },
              address: options.address,
              message: options.message,
            },
            onFinish: (response: any) => {
              try {
                verifyAndSetResult(options.address, options.message, response);
              } catch (err) {
                console.log({ err });
                setError(
                  err instanceof Error ? err : new Error("An unknown error occurred")
                );
              } finally {
                setLoading(false);
              }
            },
            onCancel: () => {
              setError(new Error("User canceled the operation"));
              setLoading(false);
            },
          };
          //@ts-ignore
          await signMessageApi(signMessageOptions);
        } else {
          throwBWAError(
            BWAErrorCode.UNSUPPORTED_WALLET,
            `Unsupported wallet: ${options.wallet}`,
            {
              severity: BWAErrorSeverity.HIGH,
              context: {
                walletType: options.wallet,
                operation: 'message_signing',
                network: reduxNetwork,
                additionalData: {
                  supportedWallets: ['Xverse', 'Unisat', 'Leather', 'Phantom', 'Okx', 'MagicEden']
                }
              },
              recoverable: true
            }
          );
        }
      } catch (err) {
        console.log({ err });
        const wrappedError = err instanceof BWAError ? err : new BWAError(
          BWAErrorCode.MESSAGE_SIGNING_FAILED,
          err instanceof Error ? err.message : "An unknown error occurred during message signing",
          {
            severity: BWAErrorSeverity.HIGH,
            context: { 
              walletType: options.wallet, 
              operation: 'message_signing',
              network: reduxNetwork 
            },
            originalError: err instanceof Error ? err : undefined
          }
        );
        setError(wrappedError);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, testWallets, reduxNetwork]
  );

  return { signMessage, loading, result, error };
};
