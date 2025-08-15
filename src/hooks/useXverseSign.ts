import { useState, useCallback } from "react";
import { CommonSignOptions, CommonSignResponse } from "../types";
import { BitcoinNetworkType, signTransaction } from "sats-connect";
import { isBase64 } from "../utils";
import { BWAErrorCode, BWAErrorSeverity, throwBWAError } from "../utils/errorHandler";

export const useXverseSign = (): CommonSignResponse => {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const sign = useCallback(async (options: CommonSignOptions) => {
    const { psbt, network, action, inputs } = options;

    try {
      // Check if the action is provided
      if (!action) {
        throwBWAError(
          BWAErrorCode.VALIDATION_ERROR,
          "Action must be provided: buy | sell | dummy | other",
          {
            severity: BWAErrorSeverity.MEDIUM,
            context: { walletType: 'Xverse', operation: 'sign' }
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
            context: { walletType: 'Xverse', operation: 'sign' }
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
            context: { walletType: 'Xverse', operation: 'sign' }
          }
        );
      }

      // Make sure psbt is base64
      if (!isBase64(psbt)) {
        throwBWAError(
          BWAErrorCode.PSBT_INVALID,
          "Xverse requires base64 PSBT",
          {
            severity: BWAErrorSeverity.MEDIUM,
            context: { walletType: 'Xverse', operation: 'sign' }
          }
        );
      }

      setLoading(true);

      const xverseInputs = inputs.map(({ address, index, sighash }) => ({
        address,
        signingIndexes: index,
        ...(action === "sell" && { sigHash: sighash }),
      }));

      const signedPsbt = await signTransaction({
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
                  walletType: 'Xverse', 
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
            e?.message || "Xverse transaction signing failed",
            {
              severity: BWAErrorSeverity.HIGH,
              context: { 
                walletType: 'Xverse', 
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
