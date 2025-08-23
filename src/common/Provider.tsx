// What happens in this file:
// - Exposes `WalletProvider` that wires Wallet Standard, MUI Theme, ConnectionStatus, and Redux store
// - Applies initial network from `customAuthOptions.network` into Redux
// - Automatically disconnects the connected wallet whenever the Redux `network` changes
//   to prevent cross-network mismatches across all hooks and operations
"use client";
import React, { ReactNode, useEffect, useRef } from "react";

import { WalletStandardProvider } from "@wallet-standard/react";
import { ConnectionStatusProvider } from "./ConnectionStatus";

//mui
import ThemeWrapper from "./mui/ThemeProvider";

//Leather Wallet
import { Connect } from "@stacks/connect-react";
import { useAuth } from "../common/stacks/use-auth";
import { AppContext } from "../common/stacks/context";

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
  const { authOptions, state } = useAuth(customAuthOptions);
  // console.log({ customAuthOptions });

  return (
    <ThemeWrapper>
      <WalletStandardProvider>
        <ConnectionStatusProvider>
          <Provider store={bwaStore}>
            <Connect authOptions={authOptions}>
              <AppContext.Provider value={state}>
                <SetNetwork customAuthOptions={customAuthOptions} />
                {children}
              </AppContext.Provider>
            </Connect>
          </Provider>
        </ConnectionStatusProvider>
      </WalletStandardProvider>
    </ThemeWrapper>
  );
}

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
