"use client";

// What happens in this file:
// - UI for connecting to multiple Bitcoin wallets and capturing a connection signature
// - Uses Redux store for network; no `network` prop is accepted or used
// - Initiates address requests and message signing per wallet (Xverse, Unisat, Leather, OKX, Phantom, Magic Eden)
// - Emits `onSignatureCapture` with signature, message, address, wallet, and redux network

import React, { useState, useEffect, useCallback, useRef } from "react";
// Connections are delegated to the headless useWalletConnect hook

//reducer
import { useSelector } from "react-redux";
// Notifications are handled elsewhere; none needed here
import { RootState } from "../../stores";
import WalletButton from "./WalletButton";
import WalletModal from "./WalletModal";
import { IInstalledWallets } from "../../types";
// No local verification in this UI component

import { useWalletConnect } from "../../hooks";
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

// no local purposes; signing/flows are in the hook

interface InnerMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  disconnect: () => void;
}

// Type for the InnerMenu prop in the WalletButton component
type InnerMenuType = React.ComponentType<InnerMenuProps>;

// Type for signature capture callback
type SignatureCaptureCallback = (signatureData: {
  signature: string;
  message: string;
  address: string;
  wallet: string;
  network: string;
}) => void;

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
  connectionMessage,
  fractal,
  supportedWallets,
  onSignatureCapture,
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
  connectionMessage?: string;
  fractal?: boolean;
  supportedWallets?: string[];
  onSignatureCapture?: SignatureCaptureCallback;
}) {
  // Keep the latest onSignatureCapture without causing effect re-runs
  const onSignatureCaptureRef = useRef<SignatureCaptureCallback | undefined>(onSignatureCapture);
  useEffect(() => {
    onSignatureCaptureRef.current = onSignatureCapture;
  }, [onSignatureCapture]);

  // Signature is handled in the hook; this component does not sign directly
  //for notification
  const disconnectFunc = useDisconnect();
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
  // All persistence is managed by the hook

  //connect-wallet modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  const testWallets: any[] = [];
  const setWallet = (_: any) => {};

  // ME: auto-connect disabled
  useEffect(() => {}, []);

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

    // Always show Xverse option
    checkWallets.push({
      label: "Xverse",
      logo: "https://raw.githubusercontent.com/coderixxinfotech/bitcoin-wallet-adapter/main/src/assets/btc-xverse-logo.png",
    });

    // Exclude MagicEden until hook support is implemented

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

    // In testnet mode, hide wallets that don't support testnet flows in our adapter
    // Currently hidden: MagicEden, Phantom, OKX
    if (redux_network === "testnet") {
      const excludeOnTestnet = new Set(["MagicEden", "Phantom", "OKX"]);
      checkWallets = checkWallets.filter((w: any) => !excludeOnTestnet.has(w.label));
    }

    if (supportedWallets && supportedWallets.length > 0)
      // Filter out wallets that are not in supportedWallets
      checkWallets = checkWallets.filter((wallet: any) =>
        supportedWallets.includes(wallet.label.toLowerCase())
      );

    setWallets(checkWallets);
  }

  // Use effect hook to run getInstalledWalletName function on component mount
  useEffect(() => {
    getInstalledWalletName();
    // Bitcoin price is now managed centrally by the useBitcoinPrice hook
  }, [open, redux_network]);

  // Auto-restore is handled in the headless hook

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
  useWalletEffect(walletDetails, disconnect, redux_network);

  // Delegate all connections to headless hook
  const { connect: connectWallet } = useWalletConnect();
  const connectXverseViaHook = async () => {
    await connectWallet("xverse");
    handleClose();
  };

  const getUnisatAddress = async () => {
    await connectWallet("unisat");
    handleClose();
  };

  const getLeatherAddress = async () => {
    await connectWallet("leather");
    handleClose();
  };

  const getPhantomAddress = async () => {
    await connectWallet("phantom");
    handleClose();
  };

  const getOkxAddress = async () => {
    await connectWallet("okx");
    handleClose();
  };

  // MagicEden flow is not supported via hook at the moment; left out intentionally

  // Bridge: surface signature via Redux + localStorage when hook completes
  const signature = useSelector((s: RootState) => s.general.signature);
  useEffect(() => {
    if (!onSignatureCaptureRef.current) return;
    if (!signature || !walletDetails?.ordinal) return;
    const msg = localStorage.getItem('wallet-message') || '';
    onSignatureCaptureRef.current({
      signature,
      message: msg,
      address: walletDetails.ordinal,
      wallet: walletDetails.wallet || '',
      network: redux_network.toLowerCase(),
    });
  }, [signature, walletDetails?.ordinal, walletDetails?.wallet, redux_network]);

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
          getAddress={connectXverseViaHook}
          getAddressOptions={null}
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
