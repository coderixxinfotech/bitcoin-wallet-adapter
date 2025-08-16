import React, { useState, useEffect } from "react";
import { Modal } from "@mui/material";
import { RxCross1 } from "react-icons/rx";
import { FaWallet } from "react-icons/fa";
import { IInstalledWallets } from "../../../types";
interface WalletModalProps {
  open: boolean;
  handleClose: () => void;
  wallets: IInstalledWallets[];
  getLeatherAddress: () => void;
  getPhantomAddress: () => void;
  getOkxAddress: () => void;
  getAddress: (options: any) => Promise<void>;
  getAddressOptions: any;
  getUnisatAddress: any;

  modalContainerClass?: string;
  modalContentClass?: string;
  closeButtonClass?: string;
  headingClass?: string;
  walletItemClass?: string;
  walletImageClass?: string;
  walletLabelClass?: string;

  meWallets: any;
  setWallet: any;

  icon?: string;
  iconClass?: string;
  iconContainerClass?: string;
}

const WalletModal: React.FC<WalletModalProps> = ({
  open,
  handleClose,
  wallets,
  getLeatherAddress,
  getPhantomAddress,
  getOkxAddress,
  getAddress,
  getAddressOptions,
  getUnisatAddress,
  setWallet,
  meWallets,
  modalContainerClass,
  modalContentClass,
  closeButtonClass,
  headingClass,
  walletItemClass,
  walletImageClass,
  walletLabelClass,
  icon = "https://raw.githubusercontent.com/coderixxinfotech/bitcoin-wallet-adapter/main/src/assets/btc-leather-logo.png",
  iconClass,
  iconContainerClass,
}) => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  // Auto detect theme based on system preference
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setCurrentTheme(isDark ? 'dark' : 'light');

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setCurrentTheme(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const isDark = currentTheme === 'dark';

  // Theme-aware classes matching WalletPopup design with bwa- prefix
  const themes = {
    light: {
      overlay: 'bwa-bg-black/50 bwa-backdrop-blur-sm',
      modal: 'bwa-bg-white bwa-shadow-2xl bwa-border bwa-border-gray-200',
      header: 'bwa-text-gray-900',
      closeButton: 'bwa-bg-gray-100 hover:bwa-bg-red-100 bwa-text-gray-600 hover:bwa-text-red-600 bwa-border bwa-border-gray-200 hover:bwa-border-red-200',
      walletCard: 'bwa-bg-white bwa-border bwa-border-gray-200 hover:bwa-border-blue-300 bwa-text-gray-900 hover:bwa-shadow-lg',
      walletLabel: 'bwa-text-gray-900',
      noWalletText: 'bwa-text-gray-600',
      installedBadge: 'bwa-bg-emerald-100 bwa-text-emerald-700 bwa-border bwa-border-emerald-200',
    },
    dark: {
      overlay: 'bwa-bg-black/70 bwa-backdrop-blur-sm',
      modal: 'bwa-bg-gray-900 bwa-shadow-2xl bwa-border bwa-border-gray-700',
      header: 'bwa-text-white',
      closeButton: 'bwa-bg-gray-800 hover:bwa-bg-red-900 bwa-text-gray-300 hover:bwa-text-red-300 bwa-border bwa-border-gray-600 hover:bwa-border-red-600',
      walletCard: 'bwa-bg-gray-800 bwa-border bwa-border-gray-700 hover:bwa-border-blue-500 bwa-text-white hover:bwa-shadow-xl',
      walletLabel: 'bwa-text-white',
      noWalletText: 'bwa-text-gray-400',
      installedBadge: 'bwa-bg-emerald-900/50 bwa-text-emerald-300 bwa-border bwa-border-emerald-700',
    }
  };

  const currentThemes = themes[currentTheme];
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="wallet-modal-title"
      aria-describedby="wallet-modal-description"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <div className={`bwa-fixed bwa-inset-0 bwa-flex bwa-items-center bwa-justify-center bwa-p-4 ${currentThemes.overlay} ${modalContainerClass || ''}`}>
        <div className={`
          ${currentThemes.modal}
          bwa-rounded-2xl bwa-p-8 bwa-w-full bwa-max-w-md bwa-mx-auto bwa-relative
          bwa-transform bwa-transition-all bwa-duration-300 bwa-scale-100
          ${modalContentClass || ''}
        `}>
          {/* Close Button */}
          <button
            onClick={handleClose}
            className={`
              bwa-absolute bwa-top-4 bwa-right-4 bwa-p-2 bwa-rounded-lg bwa-transition-all bwa-duration-200
              ${currentThemes.closeButton}
              ${closeButtonClass || ''}
            `}
          >
            <RxCross1 className="text-lg" />
          </button>

          {/* Header */}
          <div className="bwa-text-center bwa-mb-8">
            <div className="bwa-flex bwa-justify-center bwa-mb-4">
              <div className={`bwa-p-4 bwa-rounded-2xl ${isDark ? 'bwa-bg-blue-900/20' : 'bwa-bg-blue-50'} ${iconContainerClass || ''}`}>
                {icon ? (
                  <img 
                    src={icon} 
                    alt="App Logo" 
                    className={`bwa-w-16 bwa-h-16 bwa-object-contain bwa-rounded-lg ${iconClass || ''}`}
                    style={{ maxWidth: '64px', maxHeight: '64px' }}
                  />
                ) : (
                  <FaWallet className={`bwa-text-4xl ${isDark ? 'bwa-text-blue-400' : 'bwa-text-blue-600'}`} />
                )}
              </div>
            </div>
            <h2 className={`
              bwa-text-2xl bwa-font-bold bwa-mb-2 ${currentThemes.header}
              ${headingClass || ''}
            `}>
              Connect Your Wallet
            </h2>
            <p className={`bwa-text-sm ${currentThemes.noWalletText}`}>
              Choose your preferred Bitcoin wallet to continue
            </p>
          </div>

          {/* Wallet List */}
          <div className="bwa-space-y-3">
            {wallets && wallets?.length > 0 ? (
              wallets.map((item: IInstalledWallets, idx: number) => (
                <button
                  onClick={async (e) => {
                    const selectedItem = item.label;
                    if (selectedItem === "Leather") {
                      await getLeatherAddress();
                    } else if (selectedItem === "Xverse") {
                      await getAddress(getAddressOptions);
                    } else if (selectedItem === "Unisat") {
                      await getUnisatAddress();
                    } else if (selectedItem === "Phantom") {
                      await getPhantomAddress();
                    } else if (selectedItem === "OKX") {
                      await getOkxAddress();
                    } else if (selectedItem === "MagicEden") {
                      const wallet = meWallets.filter(
                        (a: any) => a.name === "Magic Eden"
                      )[0];
                      await setWallet(wallet);
                    }
                  }}
                  key={item.label + idx}
                  className={`bwa-w-full bwa-p-4 bwa-rounded-xl bwa-transition-all bwa-duration-200 bwa-transform hover:bwa-scale-105 active:bwa-scale-95 ${currentThemes.walletCard} ${walletItemClass || ''}`}
                >
                  <div className="bwa-flex bwa-items-center bwa-justify-between">
                    <div className="bwa-flex bwa-items-center bwa-gap-4">
                      <img
                        className={`bwa-w-10 bwa-h-10 bwa-rounded-lg ${walletImageClass || ''}`}
                        src={item.logo}
                        alt={`${item.label} logo`}
                      />
                      <div className="bwa-flex bwa-flex-col">
                        <h5 className={`bwa-font-semibold bwa-text-base ${currentThemes.walletLabel} ${walletLabelClass || ''}`}>
                          {item.label}
                        </h5>
                        <p className={`bwa-text-sm ${currentThemes.noWalletText}`}>
                          Ready to connect
                        </p>
                      </div>
                    </div>
                    <div className="bwa-flex bwa-items-center bwa-gap-2">
                      <span className={`bwa-px-3 bwa-py-1 bwa-rounded-full bwa-text-xs bwa-font-medium ${currentThemes.installedBadge}`}>
                        Available
                      </span>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className={`bwa-text-center bwa-py-8 ${currentThemes.noWalletText}`}>
                <FaWallet className="bwa-mx-auto bwa-text-4xl bwa-mb-4 bwa-opacity-50" />
                <p className="bwa-text-lg bwa-font-medium bwa-mb-2">
                  No Wallets Found
                </p>
                <p className="bwa-text-sm">
                  Please install a Bitcoin wallet like Unisat, Xverse, or Leather to continue.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bwa-mt-6 bwa-pt-4 bwa-border-t bwa-border-gray-200 dark:bwa-border-gray-700">
            <p className={`bwa-text-xs bwa-text-center ${currentThemes.noWalletText}`}>
              By connecting, you agree to our terms and privacy policy
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WalletModal;
