import { useCallback, useState } from "react";
import { useWalletAddress } from "./index";
import { signMessage as signMessageApi } from "sats-connect"; // Renamed to avoid naming conflict
interface CustomWindow extends Window {
  LeatherProvider?: any;
  unisat?: any;
  BitcoinProvider?: any;
}

declare const window: CustomWindow;
export const useMessageSign = () => {
  const walletDetails = useWalletAddress();
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<Error | null>(null);

  type MessageOptions = {
    network: string;
    address: string;
    message: string;
  };

  const signMessage = useCallback(
    async (options: MessageOptions) => {
      setLoading(true);
      setResult(null);
      setError(null);

      if (!walletDetails) {
        setError(new Error("Wallet Not Connected"));
        setLoading(false);
        return;
      }

      try {
        if (walletDetails.wallet === "Xverse") {
          const signMessageOptions = {
            payload: {
              network: {
                type: options.network,
              },
              address: options.address,
              message: options.message,
            },
            onFinish: (response: any) => {
              // Here you update the result with the response from the onFinish callback
              setResult(response); // Assume response contains the data you want as result
              setLoading(false);
            },
            onCancel: () => {
              // Update the error state if the user cancels the operation
              setError(new Error("User canceled the operation"));
              setLoading(false);
            },
          };
          // Call the signMessageApi with the options
          //@ts-ignore
          await signMessageApi(signMessageOptions);
        } else if (
          typeof window.unisat !== "undefined" &&
          walletDetails.wallet === "Unisat"
        ) {
          setLoading(true); // Start loading
          try {
            // Assuming window.unisat.signMessage returns a promise
            const sign = await window.unisat.signMessage(options.message);
            setResult(sign); // Update the result with the signature
          } catch (err) {
            // Handle any errors that occur during the signing process
            setError(
              err instanceof Error
                ? err
                : new Error("An error occurred during message signing")
            );
          } finally {
            setLoading(false); // End loading regardless of the outcome
          }
        }
        // Implement other wallet types...
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
        setLoading(false);
      }
    },
    [walletDetails]
  );

  return { signMessage, loading, result, error };
};
