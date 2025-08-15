import { useState, useCallback } from "react";
import { CommonSignOptions, CommonSignResponse } from "../types";
import { BytesFromHex, hexToBase64, isHex } from "../utils";
import { bytesToBase64 } from "..";
import { 
  throwBWAError, 
  BWAErrorCode,
  BWAErrorSeverity 
} from "../utils/errorHandler";

export const usePhantomSign = (): CommonSignResponse => {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const sign = useCallback(async (options: CommonSignOptions) => {
    const { psbt, network, action, inputs } = options;

    if (!isHex(psbt)) {
      throwBWAError(
        BWAErrorCode.PSBT_INVALID,
        "Phantom wallet requires PSBT in hex format",
        {
          severity: BWAErrorSeverity.MEDIUM,
          context: { 
            walletType: 'Phantom', 
            operation: 'transaction_signing' 
          }
        }
      );
    }

    setLoading(true);

    try {
      const phantomInputs = inputs.map(({ address, index, sighash }) => ({
        address,
        signingIndexes: index,
        ...(action == "sell" && { sigHash: sighash }),
      }));

      const options = {
        inputsToSign: phantomInputs,
        // autoFinalized: false,
      };

      const phantom = (window as any).window?.phantom?.bitcoin;
      console.log({ phantom });
      console.log({ psbt, options });
      // @ts-ignore
      const signedPsbt = await phantom.signPSBT(BytesFromHex(psbt), options);

      setResult(bytesToBase64(signedPsbt));
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
            e?.message || "Phantom transaction signing failed",
            {
              severity: BWAErrorSeverity.HIGH,
              context: { 
                walletType: 'Phantom', 
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

  return {
    loading,
    result,
    error,
    sign,
  };
};
