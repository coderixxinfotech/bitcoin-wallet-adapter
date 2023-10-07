"use client";
import { AppContext } from "../../common/stacks/context";
import { useConnect } from "@stacks/connect-react";
import React, { useState, useEffect, useCallback, useContext } from "react";

//xverse
import { AddressPurposes, BitcoinNetwork, getAddress } from "sats-connect";

//reducer
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "../../stores/reducers/notificationReducers";
import { RootState } from "../../stores";
import {
  setLastWallet,
  setWalletDetails,
} from "../../stores/reducers/generalReducer";
import { WalletDetails } from "../../types";
import WalletButton from "./WalletButton";
import WalletModal from "./WalletModal";
import { getBTCPriceInDollars } from "../../utils";
import { setBTCPrice } from "../../stores/reducers/generalReducer";
import { IInstalledWallets } from "../../types";
interface CustomWindow extends Window {
  unisat?: any;
  BitcoinProvider?: any;
  StacksProvider?: any;
}

declare const window: CustomWindow;

const purposes: string[] = ["ordinals", "payment"];

function ConnectMultiWallet() {
  //for notification
  const dispatch = useDispatch();
  const walletDetails = useSelector(
    (state: RootState) => state.general.walletDetails
  );
  const lastWallet = useSelector(
    (state: RootState) => state.general.lastWallet
  );
  const [wallets, setWallets] = useState<IInstalledWallets[]>([]);

  //redux wallet management
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

  //connect-wallet modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  //leather-wallet
  const state = useContext(AppContext);
  const { doOpenAuth } = useConnect();

  // Function to check which wallets are installed
  function getInstalledWalletName() {
    const checkWallets = [];
    if (typeof window.unisat !== "undefined") {
      checkWallets.push({
        label: "Unisat",
        logo: "https://raw.githubusercontent.com/coderixxinfotech/bitcoin-wallet-adapter/main/src/assets/btc-unisat-logo.png",
      });
    }

    if (window?.StacksProvider?.psbtRequest) {
      checkWallets.push({
        label: "Leather",
        logo: "https://raw.githubusercontent.com/coderixxinfotech/bitcoin-wallet-adapter/main/src/assets/btc-leather-logo.png",
      });
    }

    if (
      window?.BitcoinProvider?.signTransaction?.toString()?.includes("Psbt")
    ) {
      checkWallets.push({
        label: "Xverse",
        logo: "https://raw.githubusercontent.com/coderixxinfotech/bitcoin-wallet-adapter/main/src/assets/btc-xverse-logo.png",
      });
    }

    setWallets(checkWallets);
  }

  const getBTCPrice = useCallback(async () => {
    const price = await getBTCPriceInDollars();
    dispatch(setBTCPrice(price));
  }, [dispatch]);

  // Use effect hook to run getInstalledWalletName function on component mount
  useEffect(() => {
    getInstalledWalletName();
    getBTCPrice();
  }, [dispatch, getBTCPrice, open]);

  // Callback function to handle setting selected wallet
  const setWallet = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateLastWallet(e.target.value);
      localStorage.setItem("lastWallet", e.target.value);
      handleClose();
    },
    [updateLastWallet]
  );

  // Use effect hook to check if last wallet is in local storage and set selected wallet accordingly
  useEffect(() => {
    const localWD = localStorage.getItem("wallet-detail") || "";
    let walletDetail: WalletDetails | null = null;
    if (localWD) walletDetail = JSON.parse(localWD);

    const lastWallet = localStorage.getItem("lastWallet");
    if (lastWallet) {
      updateLastWallet(lastWallet);
      // console.log("wallet present");
      // If the last wallet is Leather and user data is not present, reset selected wallet
      if (lastWallet === "Leather" && !state?.userData) {
        updateLastWallet("");
        updateWalletDetails(null);
        localStorage.removeItem("lastWallet");
        localStorage.removeItem("wallet-detail");
      } else if (lastWallet === "Leather" && state?.userData) {
        // If the last wallet is Leather and user data is present, set the wallet details
        const cardinal = state.userData.profile.btcAddress.p2wpkh.mainnet;
        const ordinalPubkey = state.userData.profile.btcPublicKey.p2tr;
        const cardinalPubkey = state.userData.profile.btcPublicKey.p2wpkh;
        const ordinal = state.userData.profile.btcAddress.p2tr.mainnet;
        localStorage.setItem(
          "wallet-detail",
          JSON.stringify({ cardinal, ordinal, cardinalPubkey, ordinalPubkey })
        );

        updateWalletDetails({
          cardinal,
          ordinal,
          cardinalPubkey,
          ordinalPubkey,
          connected: true,
        });
      } else if (
        lastWallet === "Xverse" &&
        walletDetail &&
        (!walletDetail?.cardinal || !walletDetail?.ordinal)
      ) {
        // If the last wallet is xverse and wallet detail is missing, set the wallet details to empty
        updateLastWallet("");
        updateWalletDetails(null);
        localStorage.removeItem("lastWallet");
        localStorage.removeItem("wallet-detail");
      } else if (
        lastWallet === "Xverse" &&
        walletDetail?.cardinal &&
        walletDetail?.ordinal
      ) {
        // If the last wallet is xverse and user data is present, set the wallet details
        updateLastWallet(lastWallet);
        updateWalletDetails(walletDetail);
      } else if (
        lastWallet === "Unisat" &&
        walletDetail?.cardinal &&
        walletDetail?.ordinal
      ) {
        // If the last wallet is unisat and user data is present, set the wallet details
        updateLastWallet(lastWallet);
        updateWalletDetails(walletDetail);
      } else {
        // If the last wallet is not Leather or xverse, set selected wallet to last wallet
        updateLastWallet(lastWallet);
      }
    }
  }, [state.userData, updateLastWallet, updateWalletDetails]);

  //menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    // console.log("opening menu...");
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  //disconnect
  const disconnect = useCallback(() => {
    localStorage.removeItem("lastWallet");
    // localStorage.removeItem("blockstack-session");
    localStorage.removeItem("wallet-detail");
    updateLastWallet("");
    updateWalletDetails(null);
    handleMenuClose();
  }, [updateLastWallet, updateWalletDetails]);

  //xVerse

  const getAddressOptions = {
    payload: {
      purposes: purposes.map((p) => p as AddressPurposes),
      message: "Address for receiving Ordinals and payments",
      network: {
        type: "Mainnet",
      } as BitcoinNetwork,
    },
    onFinish: (response: any) => {
      // console.log(response, 'xverse wallet connect')
      // If the last wallet is Leather and user data is present, set the wallet details
      const cardinal = response.addresses.filter(
        (a: any) => a.purpose === "payment"
      )[0].address;
      const cardinalPubkey = response.addresses.filter(
        (a: any) => a.purpose === "payment"
      )[0].publicKey;
      const ordinal = response.addresses.filter(
        (a: any) => a.purpose === "ordinals"
      )[0].address;
      const ordinalPubkey = response.addresses.filter(
        (a: any) => a.purpose === "ordinals"
      )[0].publicKey;
      localStorage.setItem(
        "wallet-detail",
        JSON.stringify({
          cardinal,
          cardinalPubkey,
          ordinal,
          ordinalPubkey,
          connected: true,
        })
      );
      updateWalletDetails({
        cardinal,
        cardinalPubkey,
        ordinal,
        ordinalPubkey,
        connected: true,
      });
      updateLastWallet("Xverse");
      localStorage.setItem("lastWallet", "Xverse");
      handleClose();
    },
    onCancel: () => {
      updateLastWallet("");
      localStorage.removeItem("lastWallet");
      localStorage.removeItem("wallet-detail");
      dispatch(
        addNotification({
          id: new Date().valueOf(),
          message: "User rejected the request",
          open: true,
          severity: "error",
        })
      );
    },
  };

  const getUnisatAddress = async () => {
    let unisat = (window as any).unisat;
    const accounts = await unisat.requestAccounts();
    const publicKey = await unisat.getPublicKey();
    if (accounts.length && publicKey) {
      const wd = {
        ordinal: accounts[0],
        cardinal: accounts[0],
        ordinalPubkey: publicKey,
        cardinalPubkey: publicKey,
        connected: true,
      };

      localStorage.setItem("wallet-detail", JSON.stringify(wd));
      updateWalletDetails(wd);
      updateLastWallet("Unisat");
      localStorage.setItem("lastWallet", "Unisat");
      handleClose();
    }
  };

  return (
    <>
      <div className="">
        <WalletButton
          wallets={wallets}
          lastWallet={lastWallet}
          walletDetails={walletDetails}
          handleMenuOpen={handleMenuOpen}
          handleMenuClose={handleMenuClose}
          handleOpen={handleOpen}
          handleClose={handleClose}
          anchorEl={anchorEl}
          disconnect={disconnect}
          menuOpen={menuOpen}
        />

        <WalletModal
          open={open}
          handleClose={handleClose}
          wallets={wallets}
          lastWallet={lastWallet}
          setWallet={setWallet}
          doOpenAuth={doOpenAuth}
          getAddress={getAddress}
          getAddressOptions={getAddressOptions}
          getUnisatAddress={getUnisatAddress}
        />
      </div>
    </>
  );
}

export default ConnectMultiWallet;
