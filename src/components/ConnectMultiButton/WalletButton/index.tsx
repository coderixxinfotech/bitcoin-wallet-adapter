import React from "react";
import CustomButton from "../../CustomButton";
import { WalletDetails } from "../../../types";
import { shortenString } from "../../../utils";
import { RiAccountCircleFill } from "react-icons/ri";
import { FaWallet, FaPowerOff } from "react-icons/fa";
import { Menu, MenuItem, Divider } from "@mui/material";
import { HiDocument } from "react-icons/hi";

interface WalletButtonProps {
  wallets: string[];
  lastWallet: string;
  walletDetails: WalletDetails | null;
  handleMenuOpen: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleMenuClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleOpen: () => void;
  handleClose: () => void;
  disconnect: () => void;
  anchorEl: null | HTMLElement;
  menuOpen: boolean;
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
}) => {
  return lastWallet && walletDetails ? (
    <>
      <CustomButton
        icon={RiAccountCircleFill}
        text={`${shortenString(walletDetails.cardinal)}`}
        onClick={(e) => (menuOpen ? handleClose() : handleMenuOpen(e))}
        hoverBgColor="hover:bg-accent_dark"
        hoverTextColor="text-white"
        bgColor="bg-accent"
        textColor="text-white"
        className="transition-all"
      />
      <Menu
        id="connected-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Divider />
        <MenuItem onClick={disconnect}>
          <FaPowerOff />
          <p className="ml-2 text-xs">Disconnect</p>
        </MenuItem>
      </Menu>
    </>
  ) : (
    <CustomButton
      disabled={wallets?.length === 0 ? true : false}
      icon={FaWallet}
      text="Connect Wallet"
      onClick={handleOpen}
      hoverBgColor="hover:bg-accent_dark"
      hoverTextColor="text-white"
      bgColor="bg-accent"
      textColor="text-white"
      className="flex transition-all"
    />
  );
};

export default WalletButton;
