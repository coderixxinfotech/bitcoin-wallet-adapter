import React, { useState, useEffect } from "react";
import { IInstalledWallets, WalletDetails } from "../../../types";
import { shortenString } from "../../../utils";
import { RiAccountCircleFill } from "react-icons/ri";
import { FaWallet, FaPowerOff } from "react-icons/fa";
import { Menu, MenuItem } from "@mui/material";
interface InnerMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  disconnect: () => void;
}

type InnerMenuType = React.ComponentType<InnerMenuProps>;

interface WalletButtonProps {
  wallets: IInstalledWallets[];
  lastWallet: string;
  walletDetails: WalletDetails | null;
  handleMenuOpen: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleMenuClose: () => void;
  handleOpen: () => void;
  handleClose: () => void;
  disconnect: () => void;
  anchorEl: null | HTMLElement;
  menuOpen: boolean;
  classname?: string;
  InnerMenu?: InnerMenuType;
  balance?: number | null;
  fractal?: boolean;
}

const WalletButton: React.FC<WalletButtonProps> = ({
  wallets,
  lastWallet,
  walletDetails,
  handleMenuOpen,
  handleMenuClose,
  handleOpen,
  handleClose,
  disconnect,
  anchorEl,
  menuOpen,
  classname,
  InnerMenu,
  balance,
  fractal,
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
      connectButton: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 border border-blue-600 focus:ring-4 focus:ring-blue-200',
      connectedButton: 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 border border-emerald-600 focus:ring-4 focus:ring-emerald-200',
      menu: 'bg-white shadow-2xl border border-gray-200',
      menuItem: 'text-gray-900 hover:bg-gray-50',
      menuItemIcon: 'text-gray-600',
    },
    dark: {
      connectButton: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 border border-blue-500 focus:ring-4 focus:ring-blue-800',
      connectedButton: 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 border border-emerald-500 focus:ring-4 focus:ring-emerald-800',
      menu: 'bg-gray-900 shadow-2xl border border-gray-700',
      menuItem: 'text-white hover:bg-gray-800',
      menuItemIcon: 'text-gray-400',
    }
  };

  const currentThemes = themes[currentTheme];
  return lastWallet && walletDetails ? (
    <div className="relative">
      <button
        onClick={(e) => (menuOpen ? handleMenuClose() : handleMenuOpen(e))}
        className={`
        ${currentThemes.connectButton}
        px-8 py-4 rounded-xl font-bold text-base flex items-center gap-3
        transform hover:scale-105 active:scale-95 transition-all duration-200
        min-w-[200px] justify-center
        ${classname || ''}
      `}
      >
        <RiAccountCircleFill className="text-xl" />
        <span className="font-medium">
          {balance
            ? `${(balance / 100_000_000).toFixed(5)} ${fractal ? " FB" : " BTC"}`
            : shortenString(walletDetails.cardinal, 5)
          }
        </span>
      </button>

      {InnerMenu ? (
        <InnerMenu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          disconnect={disconnect}
        />
      ) : (
        <Menu
          id="connected-menu"
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 8px 25px rgba(0,0,0,0.15))",
              mt: 1.5,
              borderRadius: "12px",
              border: isDark ? "1px solid rgb(55, 65, 81)" : "1px solid rgb(229, 231, 235)",
              bgcolor: isDark ? "rgb(17, 24, 39)" : "white",
              "& .MuiList-root": {
                padding: "8px",
              },
              "& .MuiMenuItem-root": {
                borderRadius: "8px",
                margin: "2px 0",
                padding: "12px 16px",
                fontSize: "14px",
                fontWeight: 500,
                color: isDark ? "white" : "rgb(17, 24, 39)",
                "&:hover": {
                  backgroundColor: isDark ? "rgb(31, 41, 55)" : "rgb(249, 250, 251)",
                },
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: isDark ? "rgb(17, 24, 39)" : "white",
                border: isDark ? "1px solid rgb(55, 65, 81)" : "1px solid rgb(229, 231, 235)",
                borderRight: "none",
                borderBottom: "none",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <div>
            <MenuItem onClick={disconnect} className="bwa-flex">
              <FaPowerOff />
              <p className="bwa-ml-2 bwa-text-xs">Disconnect</p>
            </MenuItem>
          </div>
        </Menu>
      )}
    </div>
  ) : (
    <button
      onClick={handleOpen}
      className={`
        ${currentThemes.connectButton}
        px-8 py-4 rounded-xl font-bold text-base flex items-center gap-3
        transform hover:scale-105 active:scale-95 transition-all duration-200
        min-w-[200px] justify-center
        ${classname || ''}
      `}
    >
      <FaWallet className="text-lg" />
      <span>Connect Wallet</span>
    </button>
  );
};

export default WalletButton;
