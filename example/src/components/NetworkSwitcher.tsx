// What happens in this file:
// - Defines a `NetworkSwitcher` UI component for the example app
// - Uses `useNetwork()` hook from the library to read and set network via Redux
// - Allows toggling between 'mainnet' and 'testnet' with Tailwind-styled buttons
// - Persists choice via hook's built-in localStorage behavior

"use client";
import React from "react";
import { useNetwork } from "../../../dist";

const NetworkSwitcher: React.FC = () => {
  const net = useNetwork();
  const current = net?.network || "mainnet";

  const setMainnet = () => net?.setNetwork && net.setNetwork("mainnet");
  const setTestnet = () => net?.setNetwork && net.setNetwork("testnet");
  const toggle = () => net?.toggle && net.toggle();
  console.log({ current })
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="inline-flex rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
        <button
          type="button"
          onClick={setMainnet}
          className={`px-4 py-2 text-sm font-semibold transition-colors`}
          style={
            current === "mainnet"
              ? { backgroundColor: "#22c55e", color: "#ffffff" } // green-500
              : { backgroundColor: "#ffffff", color: "#334155" } // slate-700
          }
          aria-pressed={current === "mainnet"}
        >
          Mainnet
        </button>
        <button
          type="button"
          onClick={setTestnet}
          className={`px-4 py-2 text-sm font-semibold transition-colors`}
          style={{
            ...(current === "testnet"
              ? { backgroundColor: "#4b5563", color: "#ffffff" } // gray-600
              : { backgroundColor: "#ffffff", color: "#334155" } // slate-700
            ),
            borderLeft: "1px solid #e2e8f0", // slate-200
          }}
          aria-pressed={current === "testnet"}
        >
          Testnet
        </button>
      </div>

      <button
        type="button"
        onClick={toggle}
        className="text-xs text-blue-600 hover:text-blue-800 underline"
      >
        Toggle Network (current: {current})
      </button>
    </div>
  );
};

export default NetworkSwitcher;
