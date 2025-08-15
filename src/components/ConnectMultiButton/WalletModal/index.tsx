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

  // Theme-aware classes matching WalletPopup design
  const themes = {
    light: {
      overlay: 'bg-black/50 backdrop-blur-sm',
      modal: 'bg-white shadow-2xl border border-gray-200',
      header: 'text-gray-900',
      closeButton: 'bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-200',
      walletCard: 'bg-white border border-gray-200 hover:border-blue-300 text-gray-900 hover:shadow-lg',
      walletLabel: 'text-gray-900',
      noWalletText: 'text-gray-600',
      installedBadge: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    },
    dark: {
      overlay: 'bg-black/70 backdrop-blur-sm',
      modal: 'bg-gray-900 shadow-2xl border border-gray-700',
      header: 'text-white',
      closeButton: 'bg-gray-800 hover:bg-red-900 text-gray-300 hover:text-red-300 border border-gray-600 hover:border-red-600',
      walletCard: 'bg-gray-800 border border-gray-700 hover:border-blue-500 text-white hover:shadow-xl',
      walletLabel: 'text-white',
      noWalletText: 'text-gray-400',
      installedBadge: 'bg-emerald-900/50 text-emerald-300 border border-emerald-700',
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
      <div className={`fixed inset-0 flex items-center justify-center p-4 ${currentThemes.overlay} ${modalContainerClass || ''}`}>
        <div className={`
          ${currentThemes.modal}
          rounded-2xl p-8 w-full max-w-md mx-auto relative
          transform transition-all duration-300 scale-100
          ${modalContentClass || ''}
        `}>
          {/* Close Button */}
          <button
            onClick={handleClose}
            className={`
              absolute top-4 right-4 p-2 rounded-lg transition-all duration-200
              ${currentThemes.closeButton}
              ${closeButtonClass || ''}
            `}
          >
            <RxCross1 className="text-lg" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className={`p-4 rounded-2xl ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'} ${iconContainerClass || ''}`}>
                {icon ? (
                  <img 
                    src={icon} 
                    alt="App Logo" 
                    className={`w-16 h-16 object-contain rounded-lg ${iconClass || ''}`}
                    style={{ maxWidth: '64px', maxHeight: '64px' }}
                  />
                ) : (
                  <FaWallet className={`text-4xl ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                )}
              </div>
            </div>
            <h2 className={`
              text-2xl font-bold mb-2 ${currentThemes.header}
              ${headingClass || ''}
            `}>
              Connect Your Wallet
            </h2>
            <p className={`text-sm ${currentThemes.noWalletText}`}>
              Choose your preferred Bitcoin wallet to continue
            </p>
          </div>

          {/* Wallet List */}
          <div className="space-y-3">
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
                  className={`w-full p-4 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 ${currentThemes.walletCard} ${walletItemClass || ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        className={`w-10 h-10 rounded-lg ${walletImageClass || ''}`}
                        src={item.logo}
                        alt={`${item.label} logo`}
                      />
                      <div className="text-left">
                        <h5 className={`font-semibold text-base ${currentThemes.walletLabel} ${walletLabelClass || ''}`}>
                          {item.label}
                        </h5>
                        <p className={`text-sm ${currentThemes.noWalletText}`}>
                          Ready to connect
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${currentThemes.installedBadge}`}>
                        Available
                      </span>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className={`text-center py-8 ${currentThemes.noWalletText}`}>
                <FaWallet className="mx-auto text-4xl mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">
                  No Wallets Found
                </p>
                <p className="text-sm">
                  Please install a Bitcoin wallet like Unisat, Xverse, or Leather to continue.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className={`text-xs text-center ${currentThemes.noWalletText}`}>
              By connecting, you agree to our terms and privacy policy
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WalletModal;
