"use client";
import React, { useState, useEffect } from "react";
import { usePayBTC, useWalletAddress } from "bitcoin-wallet-adapter";

const network = "testnet";
const testnet_recipient = "2N8eAf15Vgwuki6vQkuWC3noBRVkVzAQ4h4";

const mainnet_recipient = "bc1qacu2uu02kjn47psvvy2lvx66qzhaeu8ph3vnsk";

function TestMintButton() {
  const { payBTC, loading, result, error } = usePayBTC();
  const [status, setStatus] = useState("");
  const walletDetails = useWalletAddress();

  useEffect(() => {
    let timer: any;

    if (result) {
      setStatus(`Payment successful! Transaction ID: ${result}`);
    } else if (error) {
      console.log({ error });
      setStatus(`Payment failed: ${error.message}`);
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
        network,
        address: network === "testnet" ? testnet_recipient : mainnet_recipient,
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
