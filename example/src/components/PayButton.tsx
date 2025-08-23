"use client";
/**
 * What happens in this file:
 * - Demo Pay button using `usePayBTC()` to send a small BTC payment
 * - Reads Redux-managed network from the wallet adapter store to choose recipient
 * - Does NOT pass any `network` parameter to hooks/components
 */
import React, { useState, useEffect } from "react";
import { usePayBTC, useWalletAddress } from "../../../dist";
import { useSelector } from "react-redux";

const testnet_recipient = "2N8eAf15Vgwuki6vQkuWC3noBRVkVzAQ4h4";

const mainnet_recipient = "bc1qacu2uu02kjn47psvvy2lvx66qzhaeu8ph3vnsk";

function TestMintButton() {
  const { payBTC, loading, result, error } = usePayBTC();
  const [status, setStatus] = useState("");
  const walletDetails = useWalletAddress();

  // Read Redux-managed network directly from the wallet adapter store
  const network = useSelector((s: any) => s?.general?.network) as 'mainnet' | 'testnet' | undefined;

  useEffect(() => {
    let timer: any;

    if (result) {
      setStatus(`Payment successful! Transaction ID: ${result}`);
    } else if (error) {
      console.log({ error });
      const errMsg = (error as any)?.message ?? String(error);
      setStatus(`Payment failed: ${errMsg}`);
    } else {
      setStatus("");
    }

    if (status) {
      timer = setTimeout(() => {
        setStatus("");
      }, 5000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [result, error, status]);

  const handlePayment = async () => {
    if (!walletDetails || !walletDetails.wallet) {
      setStatus("No wallet selected");
      return;
    }

    try {
      await payBTC({
        address: network === 'testnet' ? testnet_recipient : mainnet_recipient,
        amount: 2_000,
      });
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  return (
    <div className="">
      <button
        onClick={handlePayment}
        disabled={loading}
        className="my-allocation-button"
        style={{ marginTop: "1%" }}
      >
        MINT
      </button>{" "}
      {loading && <p>Processing payment...</p>}
      {status && <p>{status}</p>}
    </div>
  );
}

export default TestMintButton;
