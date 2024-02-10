"use client";
import React, { useState, useEffect, useCallback } from "react";
//xverse
import { AddressPurpose, BitcoinNetwork, getAddress } from "sats-connect";

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
  btc?: any;
  unisat?: any;
  BitcoinProvider?: any;
}

declare const window: CustomWindow;

const purposes: string[] = ["ordinals", "payment"];

interface InnerMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

// Type for the InnerMenu prop in the WalletButton component
type InnerMenuType = React.ComponentType<InnerMenuProps>;

function ConnectMultiWallet({
  buttonClassname,
  modalContainerClass,
  modalContentClass,
  closeButtonClass,
  headingClass,
  walletItemClass,
  walletImageClass,
  walletLabelClass,
  InnerMenu,
  icon,
  iconClass,
}: {
  buttonClassname?: string;
  modalContainerClass?: string;
  modalContentClass?: string;
  closeButtonClass?: string;
  headingClass?: string;
  walletItemClass?: string;
  walletImageClass?: string;
  walletLabelClass?: string;
  InnerMenu?: InnerMenuType;
  icon?: string;
  iconClass?: string;
}) {
  //for notification
  const dispatch = useDispatch();
  const walletDetails = useSelector(
    (state: RootState) => state.general.walletDetails
  );
  const lastWallet = useSelector(
    (state: RootState) => state.general.lastWallet
  );

  const balance = useSelector((state: RootState) => state.general.balance);

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

  // Function to check which wallets are installed
  function getInstalledWalletName() {
    const checkWallets = [];
    if (typeof window.unisat !== "undefined") {
      checkWallets.push({
        label: "Unisat",
        logo: "https://raw.githubusercontent.com/coderixxinfotech/bitcoin-wallet-adapter/main/src/assets/btc-unisat-logo.png",
      });
    }

    // if (typeof window.btc !== "undefined") {
    //   checkWallets.push({
    //     label: "Leather",
    //     logo: "https://raw.githubusercontent.com/coderixxinfotech/bitcoin-wallet-adapter/main/src/assets/btc-leather-logo.png",
    //   });
    // }

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
    (wallet: string) => {
      updateLastWallet(wallet);
      localStorage.setItem("lastWallet", wallet);
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
      // If the last wallet is Leather
      if (
        lastWallet === "Leather" &&
        walletDetail?.cardinal &&
        walletDetail?.ordinal
      ) {
        // If the last wallet is leather and user data is present, set the wallet details
        updateLastWallet(lastWallet);
        updateWalletDetails(walletDetail);
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
  }, [updateLastWallet, updateWalletDetails]);

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
      purposes: purposes.map((p) => p as AddressPurpose),
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
          wallet: "Xverse",
        })
      );
      updateWalletDetails({
        wallet: "Xverse",
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
        wallet: "Unisat",
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

  const getLeatherAddress = async () => {
    const userAddresses = await window.btc?.request("getAddresses");
    console.log({ userAddresses });
    if (userAddresses.result.addresses.length) {
      const wd = {
        wallet: "Leather",
        ordinal: userAddresses.result.addresses[1].address,
        cardinal: userAddresses.result.addresses[0].address,
        ordinalPubkey: userAddresses.result.addresses[1].publicKey,
        cardinalPubkey: userAddresses.result.addresses[0].publicKey,
        connected: true,
      };

      localStorage.setItem("wallet-detail", JSON.stringify(wd));
      updateWalletDetails(wd);
      updateLastWallet("Leather");
      localStorage.setItem("lastWallet", "Leather");
      handleClose();
    }
  };

  return (
    <>
      <div>
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
          classname={buttonClassname}
          InnerMenu={InnerMenu}
          balance={balance}
        />

        <WalletModal
          open={open}
          handleClose={handleClose}
          wallets={wallets}
          lastWallet={lastWallet}
          setWallet={setWallet}
          getLeatherAddress={getLeatherAddress}
          getAddress={getAddress}
          getAddressOptions={getAddressOptions}
          getUnisatAddress={getUnisatAddress}
          modalContainerClass={modalContainerClass}
          modalContentClass={modalContentClass}
          closeButtonClass={closeButtonClass}
          headingClass={headingClass}
          walletItemClass={walletItemClass}
          walletImageClass={walletImageClass}
          walletLabelClass={walletLabelClass}
          icon={icon}
          iconClass={iconClass}
        />
      </div>
    </>
  );
}

export default ConnectMultiWallet;
