import { useCallback, useState } from "react";
import {
  PsbtData,
  PsbtPayload,
  PsbtRequestOptions,
  useConnect,
} from "@stacks/connect-react";
import { CommonSignOptions, CommonSignResponse } from "../types"; // Import your CommonSignOptions
import {
  stacksMainnetNetwork,
  stacksTestnetNetwork,
} from "../common/stacks/stacks-utils";
import { hexToBase64, isHex } from "../utils";

export const useHiroSign = (
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
        setError(new Error("The PSBT must be in HEX format"));
        setLoading(false);
        return;
      }

      try {
        const signAtIndex = inputs.map((input) => input.index).flat();

        const mergedOptions = {
          ...defaultOptions,
          hex: psbt,
          signAtIndex,
          publicKey: inputs[0].publickey,
          network:
            network === "Mainnet" ? stacksMainnetNetwork : stacksTestnetNetwork,
          allowedSighash: [0x00, 0x01, 0x02, 0x03, 0x80, 0x81, 0x82, 0x83],
        };

        const hex = await new Promise<string>((resolve, reject) => {
          signPsbt({
            ...mergedOptions,
            onFinish: (data: PsbtData) => {
              resolve(data.hex);
            },
            onCancel: () => {
              reject(new Error("Signing cancelled by user"));
            },
          });
        });

        const base64Result = hexToBase64(hex);
        setResult(base64Result);
      } catch (e: any) {
        setError(e);
      } finally {
        setLoading(false);
      }
    },
    [signPsbt, defaultOptions]
  );
  return { loading, result, error, sign };
};
