import { useState, useCallback } from "react";
import { CommonSignOptions, CommonSignResponse } from "../types";
import { BitcoinNetworkType, signTransaction } from "sats-connect";
import { isBase64 } from "../utils";
import { useWallets } from "@wallet-standard/react";
import { 
  throwBWAError, 
  BWAErrorCode,
  BWAErrorSeverity 
} from "../utils/errorHandler";

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
      throwBWAError(
        BWAErrorCode.VALIDATION_ERROR,
        "Action must be provided: buy | sell | dummy | other",
        {
          severity: BWAErrorSeverity.MEDIUM,
          context: { 
            walletType: 'MagicEden', 
            operation: 'transaction_signing' 
          }
        }
      );
    }

    // Check if the inputs are provided and are not empty
    if (!inputs || inputs.length === 0) {
      throwBWAError(
        BWAErrorCode.VALIDATION_ERROR,
        "Inputs must be provided and cannot be empty",
        {
          severity: BWAErrorSeverity.MEDIUM,
          context: { 
            walletType: 'MagicEden', 
            operation: 'transaction_signing' 
          }
        }
      );
    }

    // Check if the network is provided
    if (!network) {
      throwBWAError(
        BWAErrorCode.NETWORK_ERROR,
        "Network must be provided",
        {
          severity: BWAErrorSeverity.MEDIUM,
          context: { 
            walletType: 'MagicEden', 
            operation: 'transaction_signing' 
          }
        }
      );
    }

    // Make sure psbt is base64
    if (!isBase64(psbt)) {
      throwBWAError(
        BWAErrorCode.PSBT_INVALID,
        "MagicEden requires base64 PSBT",
        {
          severity: BWAErrorSeverity.MEDIUM,
          context: { 
            walletType: 'MagicEden', 
            operation: 'transaction_signing' 
          }
        }
      );
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
        onCancel: () => {
          try {
            throwBWAError(
              BWAErrorCode.USER_CANCELLED,
              "Transaction signing was cancelled by the user",
              {
                severity: BWAErrorSeverity.LOW,
                recoverable: true,
                context: { 
                  walletType: 'MagicEden', 
                  operation: 'transaction_signing',
                  network 
                }
              }
            );
          } catch (e) {
            setError(e as Error);
          }
        },
      });
    } catch (e: any) {
      setLoading(false);
      if (e instanceof Error && e.name === 'BWAError') {
        // BWA errors are already handled by the error manager, just set error state
        setError(e);
      } else {
        // Wrap unexpected errors with professional context
        try {
          throwBWAError(
            BWAErrorCode.TRANSACTION_SIGNING_FAILED,
            e?.message || "MagicEden transaction signing failed",
            {
              severity: BWAErrorSeverity.HIGH,
              context: { 
                walletType: 'MagicEden', 
                operation: 'transaction_signing', 
                network 
              },
              originalError: e instanceof Error ? e : undefined
            }
          );
        } catch (bwaError) {
          setError(bwaError as Error);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, result, error, sign };
};
