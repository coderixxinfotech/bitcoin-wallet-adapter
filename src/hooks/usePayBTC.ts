import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { BitcoinNetworkType, sendBtcTransaction } from "sats-connect";
import { useWallets } from "@wallet-standard/react";
import type { WalletWithFeatures } from "@wallet-standard/base";
import { RootState } from "../stores";
import Wallet from "sats-connect-v2";
import { throwBWAError, wrapAndThrowError, BWAErrorCode, BWAErrorSeverity } from "../utils/errorHandler";

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

  // Remove handleError - we'll use throwBWAError directly

  const payBTC = useCallback(
    async (options: PaymentOptions) => {
      setLoading(true);
      setResult(null);
      setError(null);

      if (!walletDetails?.connected) {
        throwBWAError(
          BWAErrorCode.WALLET_NOT_CONNECTED,
          "No wallet is currently connected. Please connect a wallet to make BTC payments.",
          {
            severity: BWAErrorSeverity.HIGH,
            context: {
              operation: 'btc_payment',
              additionalData: { address: options.address, amount: options.amount }
            }
          }
        );
      }

      console.log({ options });

      try {
        let txid: string;

        switch (walletDetails.wallet) {
          case "Leather":
            if (!window.LeatherProvider) {
              throwBWAError(
                BWAErrorCode.WALLET_NOT_FOUND,
                "Leather wallet is not available for BTC payments",
                {
                  severity: BWAErrorSeverity.HIGH,
                  context: {
                    operation: 'btc_payment',
                    walletType: 'Leather'
                  }
                }
              );
            }

            try {
              const resp = await window.LeatherProvider.request("sendTransfer", {
                recipients: [
                  {
                    address: options.address,
                    amount: options.amount.toString(), // Leather expects string
                  },
                ],
                network: options.network,
              });
              
              if (!resp?.result?.txid) {
                throwBWAError(
                  BWAErrorCode.PAYMENT_FAILED,
                  "Invalid response from Leather wallet - no transaction ID returned",
                  {
                    severity: BWAErrorSeverity.HIGH,
                    context: {
                      operation: 'btc_payment',
                      walletType: 'Leather',
                      additionalData: { response: resp }
                    }
                  }
                );
              }
              
              txid = resp.result.txid;
              setResult(txid);
            } catch (leatherError: any) {
              // Handle Leather-specific errors
              if (leatherError?.error?.code) {
                throwBWAError(
                  BWAErrorCode.PAYMENT_FAILED,
                  `Leather wallet error: ${leatherError.error.message || 'Unknown error'}`,
                  {
                    severity: BWAErrorSeverity.HIGH,
                    context: {
                      operation: 'btc_payment',
                      walletType: 'Leather',
                      additionalData: { 
                        leatherErrorCode: leatherError.error.code,
                        leatherErrorMessage: leatherError.error.message 
                      }
                    }
                  }
                );
              } else {
                // Re-throw if it's already a BWA error
                throw leatherError;
              }
            }
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
                  throwBWAError(
                    BWAErrorCode.PAYMENT_FAILED,
                    "Invalid payment response format from MagicEden wallet",
                    {
                      severity: BWAErrorSeverity.HIGH,
                      context: {
                        operation: 'btc_payment',
                        walletType: 'MagicEden',
                        additionalData: { response }
                      }
                    }
                  );
                }
              },
              onCancel: () => {
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
            throwBWAError(
              BWAErrorCode.UNSUPPORTED_OPERATION,
              "Phantom wallet does not support BTC payments yet.",
              {
                severity: BWAErrorSeverity.HIGH,
                context: {
                  operation: 'btc_payment',
                  walletType: 'Phantom'
                }
              }
            );

          default:
            throwBWAError(
              BWAErrorCode.UNSUPPORTED_WALLET,
              `${walletDetails.wallet} wallet is not supported for BTC payments.`,
              {
                severity: BWAErrorSeverity.HIGH,
                context: {
                  operation: 'btc_payment',
                  walletType: walletDetails.wallet
                }
              }
            );
        }
      } catch (err) {
        setLoading(false);
        if (err instanceof Error && err.name === 'BWAError') {
          // BWA errors are already handled by the error manager, just re-throw
          throw err;
        } else {
          // Wrap unexpected errors with professional context
          const errorToWrap = err instanceof Error ? err : new Error(String(err));
          wrapAndThrowError(
            errorToWrap,
            BWAErrorCode.PAYMENT_FAILED,
            `BTC payment failed with ${walletDetails.wallet} wallet`,
            {
              operation: 'btc_payment',
              walletType: walletDetails.wallet,
              network: options.network
            }
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [walletDetails, testWallets]
  );

  return { payBTC, loading, result, error };
};
