import { useState, useCallback } from "react";
import { CommonSignOptions, CommonSignResponse } from "../types";
import { BytesFromHex, hexToBase64, isHex } from "../utils";
import { bytesToBase64 } from "..";

export const usePhantomSign = (): CommonSignResponse => {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const sign = useCallback(async (options: CommonSignOptions) => {
    const { psbt, network, action, inputs } = options;

    if (!isHex(psbt)) {
      setError(new Error("Phantom requires hexPsbt"));
      return;
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
      setError(e);
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
