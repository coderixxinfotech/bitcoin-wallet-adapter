import React from "react";
import CustomButton from "../CustomButton";
import { convertSatToBtc } from "../../utils";
import { FaBtc } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { addNotification } from "../../stores/reducers/notificationReducers";
import { sendBtcTransaction } from "sats-connect";

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
        throw Error("Wallet not connected");
      }
      if (lastWallet === "Leather") {
        //@ts-ignore
        const resp = await window.btc?.request("sendTransfer", {
          address: receipient,
          amount,
        });
        const txid = resp.result.txid;
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
            throw Error("Cancelled");
          },
        };
        //@ts-ignore
        return await sendBtcTransaction(sendBtcOptions);
      } else if (lastWallet === "Unisat") {
        //@ts-ignore
        let txid = await window.unisat.sendBitcoin(receipient, amount);

        return txid;
      } else {
        throw Error("Wallet Not Supported!");
      }
    } catch (e: any) {
      console.log(e, "PAY ERROR");
      dispatch(
        addNotification({
          id: new Date().valueOf(),
          message: e?.error?.message || e?.message || e,
          open: true,
          severity: "error",
        })
      );
      return e;
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
