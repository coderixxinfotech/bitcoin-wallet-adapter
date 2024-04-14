"use client";

import React, { useState, useEffect, useCallback, useContext } from "react";
//xverse
import {
  AddressPurpose,
  BitcoinNetwork,
  BitcoinNetworkType,
  getAddress,
} from "sats-connect";

//reducer
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "../../stores/reducers/notificationReducers";
import { RootState } from "../../stores";
import {
  setLastWallet,
  setWalletDetails,
} from "../../stores/reducers/generalReducer";
import { Account, WalletDetails } from "../../types";
import WalletButton from "./WalletButton";
import WalletModal from "./WalletModal";
import { getBTCPriceInDollars } from "../../utils";
import { setBTCPrice } from "../../stores/reducers/generalReducer";
import { IInstalledWallets } from "../../types";

// ME Wallet

const SatsConnectNamespace = "sats-connect:";

import type { WalletWithFeatures } from "@wallet-standard/base";
import { useWallet, useWallets } from "@wallet-standard/react";
import { ConnectionStatusContext } from "../../common/ConnectionStatus";

interface CustomWindow extends Window {
  LeatherProvider?: any;
  unisat?: any;
  BitcoinProvider?: any;
  magicEden?: any;
}

declare const window: CustomWindow;

const purposes: string[] = ["ordinals", "payment"];

interface InnerMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  disconnect: () => void;
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
  balance,
  network,
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
  balance?: number;
  network?: "mainnet" | "testnet";
}) {
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

  const { wallets: testWallets } = useWallets();
  const { setWallet, wallet } = useWallet();
  const connectionStatus = useContext(ConnectionStatusContext);

  // ME
  useEffect(() => {
    connectOrDeselect();
  }, [wallet]);

  // Function to check which wallets are installed
  function getInstalledWalletName() {
    const checkWallets = [];
    if (typeof window.unisat !== "undefined") {
      checkWallets.push({
        label: "Unisat",
        logo: "https://raw.githubusercontent.com/coderixxinfotech/bitcoin-wallet-adapter/main/src/assets/btc-unisat-logo.png",
      });
    }

    if (typeof window.LeatherProvider !== "undefined") {
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

    if (typeof window.magicEden !== "undefined")
      checkWallets.push({
        label: "MagicEden",
        logo: "https://raw.githubusercontent.com/coderixxinfotech/bitcoin-wallet-adapter/main/src/assets/btc-magiceden-logo.png",
      });

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
        (lastWallet === "Xverse" || lastWallet === "MagicEden") &&
        walletDetail &&
        (!walletDetail?.cardinal || !walletDetail?.ordinal)
      ) {
        // If the last wallet is xverse and wallet detail is missing, set the wallet details to empty
        updateLastWallet("");
        updateWalletDetails(null);
        localStorage.removeItem("lastWallet");
        localStorage.removeItem("wallet-detail");
        if (lastWallet === "MagicEden") {
          const wallet = testWallets.filter(
            (a: any) => a.name === "Magic Eden"
          )[0];
          setWallet(wallet);
        }
      } else if (
        (lastWallet === "Xverse" || lastWallet === "MagicEden") &&
        walletDetail?.cardinal &&
        walletDetail?.ordinal
      ) {
        // If the last wallet is xverse and user data is present, set the wallet details
        updateLastWallet(lastWallet);
        updateWalletDetails(walletDetail);
        if (lastWallet === "MagicEden") {
          const wallet = testWallets.filter(
            (a: any) => a.name === "Magic Eden"
          )[0];
          setWallet(wallet);
        }
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
    localStorage.removeItem("wallet-detail");
    updateLastWallet("");
    updateWalletDetails(null);
    handleMenuClose();

    // Iterate over all items in localStorage
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith("walletBalance-")) {
        // Remove items that start with 'walletBalance-'
        localStorage.removeItem(key);
      }
    }
  }, [updateLastWallet, updateWalletDetails]);

  useEffect(() => {
    if (typeof window.unisat !== "undefined") {
      let unisat = (window as any).unisat;
      // Register the event listeners
      unisat.on("accountsChanged", disconnect);
      unisat.on("networkChanged", disconnect);
    }

    // Cleanup logic for the useEffect hook
    return () => {
      // Remove the event listeners when the component unmounts
      if (typeof window.unisat !== "undefined") {
        let unisat = (window as any).unisat;
        // Register the event listeners
        unisat.on("accountsChanged", disconnect);
        unisat.on("networkChanged", disconnect);
      }
    };
  }, []); // Empty array means this effect runs once on mount and cleanup on unmount

  //xVerse

  const getAddressOptions = {
    payload: {
      purposes: purposes.map((p) => p as AddressPurpose),
      message: "Address for receiving Ordinals and payments",
      network:
        network === "testnet"
          ? ({
              type: "Testnet",
            } as BitcoinNetwork)
          : ({
              type: "Mainnet",
            } as BitcoinNetwork),
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
    // Directly using the btc object from the window, ensure it's correctly typed or casted.
    const btc = (window as any).LeatherProvider;

    // Requesting addresses and awaiting the promise to resolve.
    const response: any = await btc.request("getAddresses");

    const userAddresses = response;

    const addresses = userAddresses.result.addresses;

    const ordinalsAddress = addresses.find(
      (x: { type: string }) => x.type === "p2tr"
    );
    const paymentAddress = addresses.find(
      (x: { type: string }) => x.type === "p2wpkh"
    );

    console.log({ userAddresses });
    if (userAddresses.result.addresses.length) {
      const wd = {
        wallet: "Leather",
        ordinal: ordinalsAddress.address,
        cardinal: paymentAddress.address,
        ordinalPubkey: ordinalsAddress.publicKey,
        cardinalPubkey: paymentAddress.publicKey,
        connected: true,
      };

      localStorage.setItem("wallet-detail", JSON.stringify(wd));
      updateWalletDetails(wd);
      updateLastWallet("Leather");
      localStorage.setItem("lastWallet", "Leather");
      handleClose();
    }
  };

  async function connectOrDeselect() {
    try {
      await getAddress({
        getProvider: async () =>
          (wallet as unknown as WalletWithFeatures<any>).features[
            SatsConnectNamespace
          ]?.provider,
        payload: {
          purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
          message: "Address for receiving Ordinals and payments",
          network: {
            type:
              network === "testnet"
                ? BitcoinNetworkType.Testnet
                : BitcoinNetworkType.Mainnet,
          },
        },
        onFinish: (response) => {
          connectionStatus?.setAccounts(
            response.addresses as unknown as Account[]
          );

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
              wallet: "MagicEden",
            })
          );
          updateWalletDetails({
            wallet: "MagicEden",
            cardinal,
            cardinalPubkey,
            ordinal,
            ordinalPubkey,
            connected: true,
          });
          updateLastWallet("MagicEden");
          localStorage.setItem("lastWallet", "MagicEden");
          handleClose();
        },
        onCancel: () => {
          alert("Request canceled");
        },
      });
    } catch (err) {
      console.log({ err }, "MEWALLETERROR");
      setWallet(null);
    }
  }

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
          meWallets={testWallets}
          setWallet={setWallet}
        />
      </div>
    </>
  );
}

export default ConnectMultiWallet;
