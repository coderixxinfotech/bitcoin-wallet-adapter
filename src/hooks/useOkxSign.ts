import { useState, useCallback } from "react";
import { CommonSignOptions, CommonSignResponse } from "../types";
import { hexToBase64, isHex } from "../utils";
import { 
  throwBWAError, 
  BWAErrorCode,
  BWAErrorSeverity 
} from "../utils/errorHandler";

export const useOkxSign = (): CommonSignResponse => {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const sign = useCallback(async (options: CommonSignOptions) => {
    const { psbt, network, action, inputs, fractal } = options;

    // console.log({ options });

    if (!isHex(psbt)) {
      throwBWAError(
        BWAErrorCode.PSBT_INVALID,
        "OKX wallet requires hex PSBT",
        {
          severity: BWAErrorSeverity.MEDIUM,
          context: { 
            walletType: 'OKX', 
            operation: 'transaction_signing' 
          }
        }
      );
    }

    setLoading(true);

    try {
      const okxInputs = inputs.map(
        ({ address, index, sighash, publickey }) => ({
          address,
          index: index[0],
          // publickey,
          ...(action == "sell" && { sighashTypes: [sighash] }),
        })
      );

      const options = {
        toSignInputs: okxInputs,
        autoFinalized: false,
      };

      // console.log({ options });
      const Okx = fractal
        ? (window as any).okxwallet.fractalBitcoin
        : network === "testnet"
        ? (window as any).okxwallet.bitcoinTestnet
        : (window as any).okxwallet.bitcoin;
      // @ts-ignore
      const signedPsbt = await Okx.signPsbt(psbt, options);
      // console.log({ signedPsbt });
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
            e?.message || "OKX transaction signing failed",
            {
              severity: BWAErrorSeverity.HIGH,
              context: { 
                walletType: 'OKX', 
                operation: 'transaction_signing', 
                network,
                additionalData: { fractal }
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
