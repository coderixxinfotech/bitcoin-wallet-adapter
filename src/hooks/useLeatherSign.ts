// What happens in this file:
// - Exposes `useLeatherSign` hook to sign PSBTs with Leather via window.LeatherProvider.request
// - Avoids reliance on @stacks/connect-react to prevent postMessage collisions with Leather inpage script
// - Validates inputs (hex PSBT) and adds robust null checks + BWAError-based error reporting
import { useCallback, useState } from "react";
import { CommonSignOptions, CommonSignResponse } from "../types"; // Import your CommonSignOptions
import { 
  throwBWAError, 
  BWAErrorCode,
  BWAErrorSeverity 
} from "../utils/errorHandler";

import { hexToBase64, isHex } from "../utils";

type LeatherPsbtRequestOptions = {
  hex: string;
  signAtIndex?: number[];
  allowedSighash?: number[];
};

export const useLeatherSign = (
  defaultOptions: Partial<LeatherPsbtRequestOptions> = {}
): CommonSignResponse => {
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
        // provider presence check
        // @ts-ignore - window typing for injected provider
        const provider = typeof window !== 'undefined' ? (window as any)?.LeatherProvider : undefined;
        if (!provider || typeof provider.request !== 'function') {
          throwBWAError(
            BWAErrorCode.WALLET_NOT_FOUND,
            "Leather wallet is not available or not installed",
            {
              severity: BWAErrorSeverity.MEDIUM,
              context: { walletType: 'Leather', operation: 'transaction_signing', network }
            }
          );
        }

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

        // @ts-ignore - injected provider API
        const response = await provider.request(
          "signPsbt",
          mergedOptions
        );

        const signedHex: string | undefined = response?.result?.hex;
        if (!signedHex || typeof signedHex !== 'string' || !isHex(signedHex)) {
          throwBWAError(
            BWAErrorCode.TRANSACTION_SIGNING_FAILED,
            "Leather returned an invalid signature payload",
            {
              severity: BWAErrorSeverity.HIGH,
              context: { walletType: 'Leather', operation: 'transaction_signing', network },
            }
          );
        }

        const base64Result = hexToBase64(signedHex);
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
    [defaultOptions]
  );
  return { loading, result, error, sign };
};
