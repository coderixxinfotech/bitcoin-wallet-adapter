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
import { useMessageSign } from "../../hooks";
import useWalletEffect from "../../hooks/useWalletEffect";
import useDisconnect from "../../hooks/useDisconnect";

interface CustomWindow extends Window {
  LeatherProvider?: any;
  unisat?: any;
  BitcoinProvider?: any;
  magicEden?: any;
  phantom?: any;
  okxwallet?: any;
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
  connectionMessage,
  fractal,
  supportedWallets,
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
  connectionMessage?: string;
  fractal?: boolean;
  supportedWallets?: string[];
}) {
  const { loading, result, error, signMessage } = useMessageSign();
  //for notification
  const disconnectFunc = useDisconnect();
  const dispatch = useDispatch();
  const walletDetails = useSelector(
    (state: RootState) => state.general.walletDetails
  );
  const redux_network = useSelector((state: RootState) =>
    state.general.network.toLowerCase()
  );
  const lastWallet = useSelector(
    (state: RootState) => state.general.lastWallet
  );

  const [wallets, setWallets] = useState<IInstalledWallets[]>([]);
  const [tempWD, setTempWD] = useState<WalletDetails | null>(null); //hold wallet details till user signs the message

  const getMessage = (address: string) => {
    const issuedAt = new Date().toISOString(); // Get the current date and time in ISO format
    return `Ordinalnovus wants you to sign in with your Bitcoin account:

${address}

Welcome to Ordinalnovus. \n\nSigning is the only way we can truly know that you are the owner of the wallet you are connecting. Signing is a safe, gas-less transaction that does not in any way give Ordinalnovus permission to perform any transactions with your wallet.\n

\nURI: https://ordinalnovus.com\n\n

Version: 1\n\n

Issued At: ${issuedAt}`;
  };

  //redux wallet management
  const updateWalletDetails = useCallback(
    async (newWalletDetails: WalletDetails | null) => {
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
    let checkWallets: any = [];
    if (typeof window.unisat !== "undefined") {
      checkWallets.push({
        label: "Unisat",
        logo: "https://raw.githubusercontent.com/coderixxinfotech/bitcoin-wallet-adapter/main/src/assets/btc-unisat-logo.png",
      });
    }

    if (!fractal && typeof window.LeatherProvider !== "undefined") {
      checkWallets.push({
        label: "Leather",
        logo: "https://raw.githubusercontent.com/coderixxinfotech/bitcoin-wallet-adapter/main/src/assets/btc-leather-logo.png",
      });
    }

    if (
      !fractal &&
      window?.BitcoinProvider?.signTransaction?.toString()?.includes("Psbt")
    ) {
      checkWallets.push({
        label: "Xverse",
        logo: "https://raw.githubusercontent.com/coderixxinfotech/bitcoin-wallet-adapter/main/src/assets/btc-xverse-logo.png",
      });
    }

    if (!fractal && typeof window.magicEden !== "undefined")
      checkWallets.push({
        label: "MagicEden",
        logo: "https://raw.githubusercontent.com/coderixxinfotech/bitcoin-wallet-adapter/main/src/assets/btc-magiceden-logo.png",
      });

    if (!fractal && typeof window.phantom !== "undefined") {
      checkWallets.push({
        label: "Phantom",
        logo: "https://raw.githubusercontent.com/coderixxinfotech/bitcoin-wallet-adapter/main/src/assets/btc-phantom-logo.png",
      });
    }

    if (typeof window.okxwallet !== "undefined") {
      checkWallets.push({
        label: "OKX",
        logo: "https://raw.githubusercontent.com/coderixxinfotech/bitcoin-wallet-adapter/main/src/assets/btc-okx-logo.png",
      });
    }

    if (supportedWallets && supportedWallets.length > 0)
      // Filter out wallets that are not in supportedWallets
      checkWallets = checkWallets.filter((wallet: any) =>
        supportedWallets.includes(wallet.label.toLowerCase())
      );

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
      } else if (
        lastWallet === "Phantom" &&
        walletDetail?.cardinal &&
        walletDetail?.ordinal
      ) {
        // If the last wallet is unisat and user data is present, set the wallet details
        updateLastWallet(lastWallet);
        updateWalletDetails(walletDetail);
      } else if (
        lastWallet === "Okx" &&
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
    disconnectFunc();
    handleMenuClose();
  }, []);

  // Use the custom hook
  useWalletEffect(walletDetails, disconnect, network, redux_network);

  //xVerse

  const getAddressOptions = {
    payload: {
      purposes: purposes.map((p) => p as AddressPurpose),
      message: "Address for receiving Ordinals and payments",
      network:
        network?.toLowerCase() === "testnet" ||
        redux_network.toLowerCase() === "testnet"
          ? ({
              type: "Testnet",
            } as BitcoinNetwork)
          : ({
              type: "Mainnet",
            } as BitcoinNetwork),
    },
    onFinish: async (response: any) => {
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

      const wd = {
        cardinal,
        cardinalPubkey,
        ordinal,
        ordinalPubkey,
        connected: true,
        wallet: "Xverse",
      };
      setTempWD(wd);

      await signMessage({
        network:
          network?.toLowerCase() || redux_network.toLowerCase() || "mainnet",
        address: ordinal,
        message: connectionMessage || getMessage(ordinal),
        wallet: "Xverse",
      });
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

      // console.log("Sign MESSAGE");
      await signMessage({
        network:
          network?.toLowerCase() || redux_network?.toLowerCase() || "mainnet",
        address: wd.ordinal,
        message: connectionMessage || getMessage(wd.ordinal),
        wallet: "Unisat",
      });

      setTempWD(wd);
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

    // console.log({ userAddresses });
    if (userAddresses.result.addresses.length) {
      const wd = {
        wallet: "Leather",
        ordinal: ordinalsAddress.address,
        cardinal: paymentAddress.address,
        ordinalPubkey: ordinalsAddress.publicKey,
        cardinalPubkey: paymentAddress.publicKey,
        connected: true,
      };

      await signMessage({
        network:
          network?.toLowerCase() || redux_network?.toLowerCase() || "mainnet",
        address: wd.ordinal,
        message: connectionMessage || getMessage(wd.ordinal),
        wallet: "Leather",
      });

      setTempWD(wd);
    }
  };

  const getPhantomAddress = async () => {
    // Accessing the phantom Bitcoin object from the window
    const phantom = (window as any).window?.phantom?.bitcoin;

    // Requesting accounts and awaiting the promise to resolve
    const accounts = await phantom.requestAccounts();

    const userAddresses = accounts;
    const addresses = userAddresses[0];

    if (addresses) {
      const wd = {
        wallet: "Phantom",
        ordinal: addresses ? addresses.address : null,
        cardinal: addresses ? addresses.address : null,
        ordinalPubkey: addresses ? addresses.publicKey : null,
        cardinalPubkey: addresses ? addresses.publicKey : null,
        connected: true,
      };

      // Sign the message with the ordinal address if available
      if (wd.ordinal) {
        await signMessage({
          network:
            network?.toLowerCase() || redux_network?.toLowerCase() || "mainnet",
          address: wd.ordinal,
          message: connectionMessage || getMessage(wd.ordinal),
          wallet: "Phantom",
        });
      } else {
        console.warn("No ordinal address found.");
      }

      // Store the wallet data
      setTempWD(wd);
    } else {
      console.warn("No addresses found.");
    }
  };

  const getOkxAddress = async () => {
    const Okx = fractal
      ? (window as any).okxwallet.fractalBitcoin
      : (window as any).okxwallet.bitcoin;
    const accounts = await Okx.requestAccounts();
    const publicKey = await Okx.getPublicKey();

    // console.log({ accounts, publicKey });

    if (accounts.length && publicKey) {
      const wd = {
        wallet: "Okx",
        ordinal: accounts[0],
        cardinal: accounts[0],
        ordinalPubkey: publicKey,
        cardinalPubkey: publicKey,
        connected: true,
      };
      await signMessage({
        network:
          network?.toLowerCase() || redux_network?.toLowerCase() || "mainnet",
        address: wd.ordinal,
        message: connectionMessage || getMessage(wd.ordinal),
        wallet: "Okx",
        fractal,
      });

      setTempWD(wd);
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
              network?.toLowerCase() === "testnet" ||
              redux_network?.toLowerCase() === "testnet"
                ? BitcoinNetworkType.Testnet
                : BitcoinNetworkType.Mainnet,
          },
        },
        onFinish: async (response) => {
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

          const wd = {
            cardinal,
            cardinalPubkey,
            ordinal,
            ordinalPubkey,
            connected: true,
            wallet: "MagicEden",
          };

          await signMessage({
            network:
              network?.toLowerCase() ||
              redux_network.toLowerCase() ||
              "mainnet",
            address: cardinal,
            message: connectionMessage || getMessage(cardinal),
            wallet: "MagicEden",
          });
          setTempWD(wd);
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

  useEffect(() => {
    // console.log({ tempWD, result });
    if (tempWD && result) {
      localStorage.setItem("wallet-detail", JSON.stringify(tempWD));
      updateWalletDetails(tempWD);
      updateLastWallet(tempWD.wallet);
      localStorage.setItem("lastWallet", tempWD.wallet);
      handleClose();
    }
  }, [tempWD, result]);

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
          fractal={fractal}
        />

        <WalletModal
          open={open}
          handleClose={handleClose}
          wallets={wallets}
          getLeatherAddress={getLeatherAddress}
          getPhantomAddress={getPhantomAddress}
          getOkxAddress={getOkxAddress}
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
