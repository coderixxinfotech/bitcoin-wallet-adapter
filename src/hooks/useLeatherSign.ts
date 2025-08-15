import { useCallback, useState } from "react";
import { PsbtRequestOptions, useConnect } from "@stacks/connect-react";
import { CommonSignOptions, CommonSignResponse } from "../types"; // Import your CommonSignOptions
import { 
  throwBWAError, 
  BWAErrorCode,
  BWAErrorSeverity 
} from "../utils/errorHandler";

import { hexToBase64, isHex } from "../utils";

export const useLeatherSign = (
  defaultOptions: Partial<PsbtRequestOptions> = {}
): CommonSignResponse => {
  const { signPsbt } = useConnect();
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const sign = useCallback(
    async (commonOptions: CommonSignOptions) => {
      setLoading(true);
      const { psbt, network, action, inputs } = commonOptions;

      if (!isHex(psbt)) {
        setLoading(false);
        throwBWAError(
          BWAErrorCode.PSBT_INVALID,
          "Leather wallet requires PSBT in HEX format",
          {
            severity: BWAErrorSeverity.MEDIUM,
            context: { 
              walletType: 'Leather', 
              operation: 'transaction_signing' 
            }
          }
        );
      }

      try {
        const signAtIndex = inputs.map((input) => input.index).flat();

        const mergedOptions = {
          ...defaultOptions,
          hex: psbt,
          signAtIndex,
          // publicKey: inputs[0].publickey,
          // network:
          //   network === "Mainnet" ? stacksMainnetNetwork : stacksTestnetNetwork,
          allowedSighash: [0x00, 0x01, 0x02, 0x03, 0x80, 0x81, 0x82, 0x83],
        };

        // @ts-ignore
        const { result } = await window.LeatherProvider.request(
          "signPsbt",
          mergedOptions
        );

        const base64Result = hexToBase64(result.hex);
        setResult(base64Result);
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
              e?.message || "Leather transaction signing failed",
              {
                severity: BWAErrorSeverity.HIGH,
                context: { 
                  walletType: 'Leather', 
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
    },
    [signPsbt, defaultOptions]
  );
  return { loading, result, error, sign };
};
