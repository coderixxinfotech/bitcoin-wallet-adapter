import { useState, useCallback } from "react";
import { CommonSignOptions, CommonSignResponse } from "../types";
import { hexToBase64, isHex } from "../utils";
import { 
  throwBWAError, 
  BWAErrorCode,
  BWAErrorSeverity 
} from "../utils/errorHandler";

export const useUnisatSign = (): CommonSignResponse => {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const sign = useCallback(async (options: CommonSignOptions) => {
    const { psbt, network, action, inputs } = options;

    if (!isHex(psbt)) {
      throwBWAError(
        BWAErrorCode.PSBT_INVALID,
        "Unisat wallet requires PSBT in hex format",
        {
          severity: BWAErrorSeverity.MEDIUM,
          context: { 
            walletType: 'Unisat', 
            operation: 'transaction_signing' 
          }
        }
      );
    }

    setLoading(true);

    try {
      const unisatInputs = inputs.map(({ address, index, sighash }) => ({
        address,
        index,
        ...(action == "sell" && { sighashTypes: [sighash] }),
      }));

      const options = {
        toSignInputs: unisatInputs,
        autoFinalized: false,
      };

      // @ts-ignore (Assuming unisat.signPsbt is defined elsewhere in your code)
      const signedPsbt = await window.unisat.signPsbt(psbt, options);

      setResult(hexToBase64(signedPsbt));
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
            e?.message || "Unisat transaction signing failed",
            {
              severity: BWAErrorSeverity.HIGH,
              context: { 
                walletType: 'Unisat', 
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
