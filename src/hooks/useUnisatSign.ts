import { useState, useCallback } from "react";
import { CommonSignOptions, CommonSignResponse } from "../types";
import { hexToBase64, isHex } from "../utils";

export const useUnisatSign = (): CommonSignResponse => {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const sign = useCallback(async (options: CommonSignOptions) => {
    const { psbt, network, action, inputs } = options;

    if (!isHex(psbt)) {
      setError(new Error("Unisat requires hexPsbt"));
      return;
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
