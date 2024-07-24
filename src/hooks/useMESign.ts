import { useState, useCallback } from "react";
import { CommonSignOptions, CommonSignResponse } from "../types";
import { BitcoinNetworkType, signTransaction } from "sats-connect";
import { isBase64 } from "../utils";
import { useWallet, useWallets } from "@wallet-standard/react";

import type { WalletWithFeatures } from "@wallet-standard/base";

const SatsConnectNamespace = "sats-connect:";
export const useMESign = (): CommonSignResponse => {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const { wallets: testWallets } = useWallets();
  const sign = useCallback(async (options: CommonSignOptions) => {
    const { psbt, network, action, inputs } = options;

    // Check if the action is provided
    if (!action) {
      setError(
        new Error("Action must be provided: buy | sell | dummy | other")
      );
      return;
    }

    // Check if the inputs are provided and are not empty
    if (!inputs || inputs.length === 0) {
      setError(new Error("Inputs must be provided and cannot be empty"));
      return;
    }

    // Check if the network is provided
    if (!network) {
      setError(new Error("Network must be provided"));
      return;
    }

    // Make sure psbt is base64
    if (!isBase64(psbt)) {
      console.warn("Xverse requires base64 PSBT");
      setError(new Error("Xverse requires base64 PSBT"));
      return;
    }

    setLoading(true);

    try {
      const xverseInputs = inputs.map(({ address, index, sighash }) => ({
        address,
        signingIndexes: index,
        ...(action === "sell" && { sigHash: sighash }),
      }));

      const wallet = testWallets.filter((a: any) => a.name === "Magic Eden")[0];

      await signTransaction({
        getProvider: async () =>
          (wallet as unknown as WalletWithFeatures<any>).features[
            SatsConnectNamespace
          ]?.provider,
        payload: {
          network: {
            type:
              network.toLowerCase() === "mainnet"
                ? BitcoinNetworkType.Mainnet
                : BitcoinNetworkType.Testnet,
          },
          message: `Sign ${action} Transaction`,
          psbtBase64: psbt,
          broadcast: false,
          inputsToSign: xverseInputs,
        },
        onFinish: (response: any) => setResult(response.psbtBase64),
        onCancel: () => setError(new Error("Operation cancelled by user")),
      });
    } catch (e: any) {
      console.log({ e }, "ME_SIGN_TX_ERROR");
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, result, error, sign };
};
