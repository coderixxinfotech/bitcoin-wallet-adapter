"use client";
import React, { ReactNode, useCallback, useEffect } from "react";

//mui
import ThemeWrapper from "./mui/ThemeProvider";

//Leather Wallet
import { Connect } from "@stacks/connect-react";
import { useAuth } from "../common/stacks/use-auth";
import { AppContext } from "../common/stacks/context";

// Redux
import { Provider, useDispatch } from "react-redux";
import { store } from "../stores";

import { AuthOptionsArgs } from "../types";
import { useWalletAddress } from "../hooks";
import axios from "axios";
import {
  setBalance,
  setDummyUtxos,
  setMempoolBalance,
  setMempoolUrl,
  setOrdUrl,
} from "../stores/reducers/generalReducer";
import { countDummyUtxos } from "../utils";

interface WalletProviderProps {
  children: ReactNode;
  ord_url: string;
  customAuthOptions?: AuthOptionsArgs; // Assuming AuthOptionsArgs is already defined as in the previous example
  mempoolUrl?: string;
  apikey?: string;
}

function WalletProvider({
  children,
  customAuthOptions,
  mempoolUrl,
  ord_url,
  apikey,
}: WalletProviderProps) {
  const { authOptions, state } = useAuth(customAuthOptions);

  return (
    <ThemeWrapper>
      <Provider store={store}>
        {children}
        <DispatchDefaultData
          mempool_url={mempoolUrl || "https://mempool.space/api"}
          ord_url={ord_url}
          apikey={apikey}
        />
      </Provider>
    </ThemeWrapper>
  );
}

const DispatchDefaultData = ({
  mempool_url,
  ord_url,
  apikey,
}: {
  mempool_url: string;
  ord_url: string;
  apikey?: string;
}) => {
  const dispatch = useDispatch();
  const wd = useWalletAddress();

  const fetchWalletBalance = useCallback(async () => {
    try {
      if (!wd) throw Error("Wallet not connected");
      let dummyUtxos = 0;
      const cacheKey = `walletBalance`;
      const cachedData = localStorage.getItem(cacheKey);
      const now = new Date().getTime();

      let shouldFetchDummyUtxos = true; // Default to true if no cached data or cache is expired

      if (cachedData) {
        const { timestamp } = JSON.parse(cachedData);

        if (now - timestamp < 5 * 60 * 1000) {
          // Less than 5 minutes
          // Use cached data to update state and skip new balance fetch
          const {
            balance,
            mempoolBalance,
            dummyUtxos: cacheddummyUtxos,
          } = JSON.parse(cachedData);
          if (cacheddummyUtxos) dummyUtxos = cacheddummyUtxos;
          dispatch(setMempoolBalance(mempoolBalance));
          dispatch(setBalance(balance));
          dispatch(setDummyUtxos(cacheddummyUtxos));
          shouldFetchDummyUtxos = false; // Data is recent, no need to fetch dummy UTXOs
          return; // Exit function early
        }

        console.log("no cache / expired ", now - timestamp);
      }

      // Proceed to fetch new balance data
      const { data } = await axios.get(
        `${mempool_url}/address/${wd?.cardinal_address}`
      );
      if (data) {
        const newBal =
          data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
        const newMempoolBal =
          data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum;

        dispatch(setMempoolBalance(newMempoolBal));
        dispatch(setBalance(newBal));

        // Determine if need to fetch dummy UTXOs based on balance change
        if (cachedData) {
          const { balance: cachedBalance } = JSON.parse(cachedData);
          shouldFetchDummyUtxos = newBal !== cachedBalance;
        }

        // Fetch dummy UTXOs if necessary
        if (shouldFetchDummyUtxos) {
          dummyUtxos = await countDummyUtxos(
            wd.cardinal_address,
            mempool_url,
            ord_url
          );
          dispatch(setDummyUtxos(dummyUtxos));
        }
        console.log("storing cache");
        // Update cache with new balance and timestamp
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            balance: newBal,
            mempoolBalance: newMempoolBal,
            timestamp: now,
            dummyUtxos: dummyUtxos,
          })
        );
      }
    } catch (e) {
      console.error("Error fetching wallet balance:", e);
    }
  }, [wd, mempool_url, ord_url]);

  useEffect(() => {
    if (wd && mempool_url) {
      dispatch(setMempoolUrl(mempool_url));
      dispatch(setOrdUrl(ord_url));
      fetchWalletBalance();
    }
  }, [mempool_url, wd]);

  return <></>;
};

export default WalletProvider;
