import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BitcoinNetworkType, sendBtcTransaction } from "sats-connect";
import { useWallets } from "@wallet-standard/react";
import type { WalletWithFeatures } from "@wallet-standard/base";
import { addNotification } from "../stores/reducers/notificationReducers";
import { RootState } from "../stores";
import Wallet from "sats-connect-v2";

type CustomWindow = Window & {
  LeatherProvider?: any;
  unisat?: any;
  BitcoinProvider?: any;
  btc?: any;
  phantom?: any;
  okxwallet?: any;
};

declare const window: CustomWindow;

const SatsConnectNamespace = "sats-connect:";

type PaymentOptions = {
  network: "testnet" | "mainnet";
  address: string;
  amount: number;
  fractal?: boolean;
};

export const usePayBTC = () => {
  const dispatch = useDispatch();
  const { wallets: testWallets } = useWallets();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const walletDetails = useSelector(
    (state: RootState) => state.general.walletDetails
  );

  const SetResult = (response: any) => {
    setResult(response);
  };

  const handleError = (err: unknown) => {
    console.error("PAY ERROR:", err);
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    dispatch(
      addNotification({
        id: Date.now(),
        message: errorMessage,
        open: true,
        severity: "error",
      })
    );
    setError(new Error(errorMessage));
  };

  const payBTC = useCallback(
    async (options: PaymentOptions) => {
      setLoading(true);
      setResult(null);
      setError(null);

      if (!walletDetails?.connected) {
        setError(new Error("Wallet not connected"));
        setLoading(false);
        return;
      }

      console.log({ options });

      try {
        let txid: string;

        switch (walletDetails.wallet) {
          case "Leather":
            const resp = await window.btc?.request("sendTransfer", {
              address: options.address,
              amount: options.amount,
            });
            txid = resp?.result.txid;

            setResult(txid);
            break;

          case "Xverse":
            const response: any = await Wallet.request("sendTransfer", {
              recipients: [
                {
                  address: options.address,
                  amount: Number(options.amount),
                },
              ],
            });
            console.log({ response });
            txid = response.result.txid;

            setResult(txid);
            break;
          case "MagicEden":
            const wallet =
              walletDetails.wallet === "MagicEden"
                ? testWallets.find((a: any) => a.name === "Magic Eden")
                : undefined;

            const sendBtcOptions = {
              ...(walletDetails.wallet === "MagicEden" && {
                getProvider: async () =>
                  (wallet as unknown as WalletWithFeatures<any>).features[
                    SatsConnectNamespace
                  ]?.provider,
              }),
              payload: {
                network: {
                  type:
                    options.network === "mainnet"
                      ? BitcoinNetworkType.Mainnet
                      : BitcoinNetworkType.Testnet,
                },
                recipients: [
                  {
                    address: options.address,
                    amountSats: BigInt(options.amount),
                  },
                ],
                senderAddress: walletDetails.cardinal,
              },
              onFinish: (response: any) => {
                console.log({ response });

                setLoading(false);
                if (typeof response === "string") {
                  txid = response;
                  setLoading(false);
                  setResult(response);
                } else if (response && typeof response.txid === "string") {
                  txid = response.txid;
                  setResult(response.txid);
                  setLoading(false);
                } else {
                  throw new Error("Invalid response format");
                }
              },
              onCancel: () => {
                // throw new Error("Transaction cancelled");
                console.log("Cancelled ");
              },
            };

            (await sendBtcTransaction(sendBtcOptions)) as unknown as string;

            break;

          case "Unisat":
            txid = await window.unisat.sendBitcoin(
              options.address,
              options.amount
            );

            setResult(txid);
            break;

          case "Okx":
            const Okx = options.fractal
              ? window.okxwallet.fractalBitcoin
              : options.network === "testnet"
              ? window.okxwallet.bitcoinTestnet
              : window.okxwallet.bitcoin;

            txid = await Okx.sendBitcoin(options.address, options.amount);

            setResult(txid);
            break;

          case "Phantom":
            throw new Error("Phantom wallet BTC payment not implemented");

          default:
            throw new Error("Unsupported wallet");
        }
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, walletDetails, testWallets]
  );

  return { payBTC, loading, result, error };
};
