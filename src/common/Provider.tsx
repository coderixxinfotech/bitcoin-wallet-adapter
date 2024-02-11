"use client";
import React, { ReactNode } from "react";

//mui
import ThemeWrapper from "./mui/ThemeProvider";

//Leather Wallet
import { Connect } from "@stacks/connect-react";
import { useAuth } from "../common/stacks/use-auth";
import { AppContext } from "../common/stacks/context";

// Redux
import { Provider } from "react-redux";
import { store } from "../stores";

import { AuthOptionsArgs } from "../types";

interface WalletProviderProps {
  children: ReactNode;
  customAuthOptions?: AuthOptionsArgs; // Assuming AuthOptionsArgs is already defined as in the previous example
}

function WalletProvider({ children, customAuthOptions }: WalletProviderProps) {
  const { authOptions, state } = useAuth(customAuthOptions);
  return (
    <ThemeWrapper>
      <Provider store={store}>
        <Connect authOptions={authOptions}>
          <AppContext.Provider value={state}>{children}</AppContext.Provider>
        </Connect>
      </Provider>
    </ThemeWrapper>
  );
}

export default WalletProvider;
