'use client'
import React, { useCallback } from "react";
import { useContext, useEffect } from "react";
import { AppContext } from "../common/stacks/context";
import { useConnect } from "@stacks/connect-react";
import { Button } from "@mui/material";
import { WalletDetails } from "../types";
import { useDispatch } from "react-redux";
import { setLastWallet, setWalletDetails } from "../stores/reducers/generalReducer";
import { useWalletAddress } from "../hooks/useWalletAddress";
import { addNotification } from "../stores/reducers/notificationReducers";
function ConnectMultiButton() {
  const dispatch = useDispatch();
  const {
    connected,
  } = useWalletAddress();

  //hiro-wallet
  const state = useContext(AppContext);
  const { doOpenAuth } = useConnect();

  // redux wallet management
  const updateWalletDetails = useCallback(
    (newWalletDetails: WalletDetails | null) => {
      dispatch(setWalletDetails(newWalletDetails));
    },
    [dispatch]
  );

  const updateLastWallet = useCallback(
    (newLastWallet: string) => {
      dispatch(setLastWallet(newLastWallet));
    },
    [dispatch]
  );

  useEffect(() => {
    // hiro wallet
    if (state.userData) {
      // If the last wallet is Hiro and user data is present, set the wallet details
      const cardinal = state.userData.profile.btcAddress.p2wpkh.mainnet;
      const ordinalPubkey = state.userData.profile.btcPublicKey.p2tr;
      const cardinalPubkey = state.userData.profile.btcPublicKey.p2wpkh;
      const ordinal = state.userData.profile.btcAddress.p2tr.mainnet;
      updateWalletDetails({
        cardinal,
        ordinal,
        cardinalPubkey,
        ordinalPubkey,
        connected: true,
      });
      dispatch(
        addNotification({
          id: new Date().valueOf(),
          message: "Wallet Connected Successfully",
          open: true,
          severity: "success",
        })
      );
    }
  }, [state]);

  //disconnect
  const disconnect = useCallback(() => {
    localStorage.removeItem("lastWallet");
    localStorage.removeItem("wallet-detail");
    updateLastWallet("");
    updateWalletDetails(null);
    dispatch(
      addNotification({
        id: new Date().valueOf(),
        message: "Wallet Disconnected",
        open: true,
        severity: "error",
      })
    );
  }, [updateLastWallet, updateWalletDetails]);

  if (!connected)
    return (
      <Button variant="contained" onClick={() => doOpenAuth()}>
        Connect Wallet
      </Button>
    );

  return (
    <Button variant="contained" onClick={() => disconnect()}>
      Disconnect Wallet
    </Button>
  );
}

export default ConnectMultiButton;
