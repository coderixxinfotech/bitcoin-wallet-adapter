import { useState, useCallback } from "react";
import { CommonSignOptions, CommonSignResponse } from "../types";
import { hexToBase64, isHex } from "../utils";

export const useOkxSign = (): CommonSignResponse => {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const sign = useCallback(async (options: CommonSignOptions) => {
    const { psbt, network, action, inputs, fractal } = options;

    // console.log({ options });

    if (!isHex(psbt)) {
      setError(new Error("Okx wallet requires hexPsbt"));
      return;
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
