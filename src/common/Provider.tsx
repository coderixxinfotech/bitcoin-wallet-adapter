// What happens in this file:
// - Exposes `WalletProvider` that wires Wallet Standard, MUI Theme, ConnectionStatus, and Redux store
// - Applies initial network from `customAuthOptions.network` into Redux
// - Automatically disconnects the connected wallet whenever the Redux `network` changes
//   to prevent cross-network mismatches across all hooks and operations
// - Removed Stacks Connect provider to avoid setImmediate postMessage conflicts with Leather inpage script
"use client";
import React, { ReactNode, useEffect, useRef } from "react";

import { WalletStandardProvider } from "@wallet-standard/react";
import { ConnectionStatusProvider } from "./ConnectionStatus";

//mui
import ThemeWrapper from "./mui/ThemeProvider";

// Redux
import { Provider, useDispatch, useSelector } from "react-redux";
import { bwaStore } from "../stores";
import type { RootState } from "../stores";

import { AuthOptionsArgs } from "../types";
import { setNetwork } from "../stores/reducers/generalReducer";
import useDisconnect from "../hooks/useDisconnect";
import { addNotification } from "../stores/reducers/notificationReducers";

interface WalletProviderProps {
  children: ReactNode;
  customAuthOptions?: AuthOptionsArgs; // Assuming AuthOptionsArgs is already defined as in the previous example
}

function WalletProvider({ children, customAuthOptions }: WalletProviderProps) {
  return (
    <ThemeWrapper>
      <WalletStandardProvider>
        <ConnectionStatusProvider>
          <Provider store={bwaStore}>
            <LeatherCompatPatches />
            <SetNetwork customAuthOptions={customAuthOptions} />
            {children}
          </Provider>
        </ConnectionStatusProvider>
      </WalletStandardProvider>
    </ThemeWrapper>
  );
}

// Small, safe runtime patch to avoid postMessage-based setImmediate polyfills
// interfering with Leather's inpage message parsing. Replaces setImmediate
// with a setTimeout(0) fallback. No-ops if setImmediate is absent.
const LeatherCompatPatches = () => {
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const w = window as any;
      if (typeof w.setImmediate === "function") {
        if (!w.__bwaSetImmediatePatched) {
          const timeouts = new Map<number, number>();
          const patchedSetImmediate = (cb: (...args: any[]) => any, ...args: any[]) => {
            const id = Math.floor(Math.random() * 1e9);
            const tid = window.setTimeout(() => {
              try {
                cb(...args);
              } catch {
                // swallow to avoid unhandled errors in microtask replacement
              }
            }, 0);
            timeouts.set(id, tid);
            return id;
          };
          const patchedClearImmediate = (id: number) => {
            const tid = timeouts.get(id);
            if (tid != null) {
              clearTimeout(tid);
              timeouts.delete(id);
            }
          };
          w.setImmediate = patchedSetImmediate;
          w.clearImmediate = patchedClearImmediate;
          w.__bwaSetImmediatePatched = true;
        }
      }
      // Note: Avoid patching window.postMessage to prevent breaking wallet detection.
      // Intercept setImmediate polyfill messages only (avoid interfering with wallet detection)
      const handler = (event: MessageEvent) => {
        try {
          if (event.source !== window) return;
          const data = (event as MessageEvent).data;
          if (typeof data === "string") {
            const trimmed = data.trim();
            if (trimmed.startsWith("setImmediate$")) {
              event.stopImmediatePropagation?.();
              return;
            }
          }
        } catch {
          // ignore
        }
      };
      window.addEventListener("message", handler, { capture: true });
      return () => {
        window.removeEventListener("message", handler, { capture: true } as any);
      };
    } catch {
      // ignore
    }
  }, []);
  return null;
};

const SetNetwork = ({ customAuthOptions }: any) => {
  const dispatch = useDispatch();
  const network = useSelector((s: RootState) => s.general.network);
  const walletDetails = useSelector((s: RootState) => s.general.walletDetails);
  const disconnect = useDisconnect();
  const prevNetworkRef = useRef<string | null>(network ?? null);

  // Apply initial network from customAuthOptions (if provided)
  useEffect(() => {
    if (customAuthOptions?.network) {
      dispatch(setNetwork(customAuthOptions.network));
    }
    return () => {};
  }, [customAuthOptions?.network, dispatch]);

  // Auto-disconnect wallet whenever Redux network changes
  useEffect(() => {
    const prev = prevNetworkRef.current;
    if (prev && network && prev !== network) {
      if (walletDetails) {
        disconnect();
        // Notify user about the enforced disconnect on network switch
        dispatch(
          addNotification({
            id: Date.now(),
            message: `Network changed to ${network}. Wallet disconnected to prevent cross-network issues.`,
            open: true,
            severity: "info",
          })
        );
      }
    }
    prevNetworkRef.current = network ?? null;
  }, [network, walletDetails, disconnect]);

  return <></>;
};

export default WalletProvider;
