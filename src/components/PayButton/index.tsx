import React from "react";
import CustomButton from "../CustomButton";
import { convertSatToBtc } from "../../utils";
import { FaBtc } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { sendBtcTransaction } from "sats-connect";
import { throwBWAError, BWAErrorCode, BWAErrorSeverity } from "../../utils/errorHandler";

function PayButton({
  amount,
  receipient,
  buttonClassname,
}: {
  amount: number;
  receipient: string;
  buttonClassname?: string;
}) {
  const dispatch = useDispatch();
  const walletDetails = useSelector(
    (state: RootState) => state.general.walletDetails
  );

  const lastWallet = useSelector(
    (state: RootState) => state.general.lastWallet
  );

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      if (!walletDetails?.connected) {
        throwBWAError(
          BWAErrorCode.WALLET_NOT_CONNECTED,
          "No wallet is currently connected. Please connect a wallet to make payments.",
          {
            severity: BWAErrorSeverity.HIGH,
            context: {
              operation: 'btc_payment',
              additionalData: { amount, receipient }
            }
          }
        );
      }
      if (lastWallet === "Leather") {
        //@ts-ignore
        const resp = await window.btc?.request("sendTransfer", {
          address: receipient,
          amount,
        });
        const txid = resp?.id;
        return txid;
      } else if (lastWallet === "Xverse") {
        const sendBtcOptions = {
          payload: {
            network: {
              type: "Mainnet",
            },
            recipients: [
              {
                address: receipient,
                amountSats: amount,
              },
            ],
            senderAddress: walletDetails.cardinal,
          },
          onFinish: (response: any) => {
            return response;
          },
          onCancel: () => {
            throwBWAError(
              BWAErrorCode.USER_REJECTED,
              "Payment was cancelled by the user.",
              {
                severity: BWAErrorSeverity.LOW,
                recoverable: true,
                context: {
                  operation: 'btc_payment',
                  walletType: 'Xverse'
                }
              }
            );
          },
        };
        //@ts-ignore
        return await sendBtcTransaction(sendBtcOptions);
      } else if (lastWallet === "Unisat") {
        //@ts-ignore
        let txid = await window.unisat.sendBitcoin(receipient, amount);

        return txid;
      } else {
        throwBWAError(
          BWAErrorCode.UNSUPPORTED_WALLET,
          `${lastWallet} wallet does not support BTC payments yet.`,
          {
            severity: BWAErrorSeverity.HIGH,
            context: {
              operation: 'btc_payment',
              walletType: lastWallet
            }
          }
        );
      }
    } catch (e: any) {
      // BWA errors are already handled by the error manager
      // Re-throw to let the system handle them properly
      throw e;
    }
  };
  return (
    <div>
      <CustomButton
        icon={FaBtc}
        text={`Pay ${convertSatToBtc(amount)} BTC`}
        onClick={(e) => handleSubmit(e)}
        className={buttonClassname}
      />
    </div>
  );
}

export default PayButton;
