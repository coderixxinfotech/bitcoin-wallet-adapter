import { useCallback, useState, useEffect } from "react";
import { useLeatherSign, useXverseSign, useUnisatSign } from "./index";
import { useWalletAddress } from "./index";
import { CommonSignOptions } from "../types/index";
import { base64ToHex } from "../utils";
import { useMESign } from "./useMESign";
import { useOkxSign } from "./useOkxSign";
import { usePhantomSign } from "./usePhantomSign";

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
  const { sign: meSign, result: meResult, error: meError } = useMESign();
  const {
    sign: unisatSign,
    result: unisatResult,
    error: unisatError,
  } = useUnisatSign();

  const { sign: phantomSign, result: phantomResult, error: phantomError } = usePhantomSign();
  const { sign: okxSign, result: okxResult, error: okxError } = useOkxSign();

  const signTx = useCallback(
    async (props: CommonSignOptions) => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        if (!walletDetails) throw Error("Wallet Not Connected");
        const options = {
          psbt:
            walletDetails.wallet === "Xverse" ||
            walletDetails.wallet === "MagicEden"
              ? props.psbt
              : base64ToHex(props.psbt),
          network: props.network.toLowerCase(),
          action: props.action,
          inputs: props.inputs,
        };
        // console.log({ walletDetails }, "in useSignTx");
        if (walletDetails.wallet === "Leather") {
          //@ts-ignore
          leatherSign(options);
        } else if (walletDetails.wallet === "Xverse") {
          //@ts-ignore
          xverseSign(options);
        } else if (walletDetails.wallet === "MagicEden") {
          //@ts-ignore
          meSign(options);
        } else if (walletDetails.wallet === "Unisat") {
          //@ts-ignore
          unisatSign(options);
        } else if (walletDetails.wallet === "Phantom") {
          //@ts-ignore
          phantomSign(options);
        } else if (walletDetails.wallet === "Okxwallet") {
          //@ts-ignore
          okxSign(options);
        }
      } catch (err: any) {
        setError(err);
        setLoading(false);
      }
    },
    [walletDetails, leatherSign, xverseSign, unisatSign, meSign, okxSign, phantomSign]
  );

  useEffect(() => {
    if (
      leatherResult ||
      xverseResult ||
      unisatResult ||
      meResult ||
      okxResult ||
      okxResult ||
      phantomResult
    ) {
      setResult(
        leatherResult || xverseResult || unisatResult || meResult || okxResult || phantomResult
      );
      setLoading(false);
    }

    if (leatherError || xverseError || unisatError || meError || okxError || phantomError) {
      setError(
        leatherError || xverseError || unisatError || meError || okxError || phantomError
      );
      setLoading(false);
    }
  }, [
    leatherResult,
    leatherError,
    xverseResult,
    xverseError,
    unisatResult,
    unisatError,
    meResult,
    meError,
    okxResult,
    okxError,
    phantomResult,
    phantomError
  ]);

  return { signTx, loading, result, error };
};
