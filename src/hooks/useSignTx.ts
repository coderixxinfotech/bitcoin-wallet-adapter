import { useCallback, useState, useEffect } from "react";
import { useLeatherSign, useXverseSign, useUnisatSign } from "./index";
import { useWalletAddress } from "./index";
import { CommonSignOptions } from "../types/index";
import { base64ToHex } from "../utils";

export const useSignTx = () => {
  const walletDetails = useWalletAddress();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState<any>(null);

  const {
    sign: leatherSign,
    result: leatherResult,
    error: leatherError,
  } = useLeatherSign();
  const {
    sign: xverseSign,
    result: xverseResult,
    error: xverseError,
  } = useXverseSign();
  const {
    sign: unisatSign,
    result: unisatResult,
    error: unisatError,
  } = useUnisatSign();

  const signTx = useCallback(
    async (props: CommonSignOptions) => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        if (!walletDetails) throw Error("Wallet Not Connected");
        const options = {
          psbt:
            walletDetails.wallet === "Xverse"
              ? props.psbt
              : base64ToHex(props.psbt),
          network: props.network,
          action: props.action,
          inputs: props.inputs,
        };
        if (walletDetails.wallet === "Leather") {
          leatherSign(options);
        } else if (walletDetails.wallet === "Xverse") {
          xverseSign(options);
        } else if (walletDetails.wallet === "Unisat") {
          unisatSign(options);
        }
      } catch (err: any) {
        setError(err);
        setLoading(false);
      }
    },
    [walletDetails, leatherSign, xverseSign, unisatSign]
  );

  useEffect(() => {
    if (leatherResult || xverseResult || unisatResult) {
      setResult(leatherResult || xverseResult || unisatResult);
      setLoading(false);
    }

    if (leatherError || xverseError || unisatError) {
      setError(leatherError || xverseError || unisatError);
      setLoading(false);
    }
  }, [
    leatherResult,
    leatherError,
    xverseResult,
    xverseError,
    unisatResult,
    unisatError,
  ]);

  return { signTx, loading, result, error };
};
